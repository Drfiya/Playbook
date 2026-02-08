/**
 * Supabase Edge Function: RAG Chat
 *
 * Performs retrieval-augmented generation against the chapter content
 * stored in the `documents` table. Accepts a user's question, generates
 * an embedding, finds the most relevant chunks via `match_documents`,
 * and returns a grounded answer from OpenAI.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- Configuration ---

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const EMBEDDING_MODEL = "text-embedding-3-small";
const CHAT_MODEL = "gpt-4o-mini";
const MATCH_COUNT = 8;

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:5173",
  "https://playbook-rho.vercel.app",
];

// --- Helpers ---

/** Build CORS headers for the given origin. */
function corsHeaders(origin: string): Record<string, string> {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
    "Content-Type": "application/json",
  };
}

/** Call OpenAI embeddings API to turn text into a 1536-d vector. */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI Embeddings API error: ${response.status} — ${error}`);
  }

  const json = await response.json();
  return json.data[0].embedding;
}

/** Call OpenAI chat completions API with context and question. */
async function generateChatResponse(
  question: string,
  contextChunks: { content: string; metadata: Record<string, unknown> }[],
  chapterContext?: { title?: string; id?: string },
): Promise<string> {
  // Build context text from retrieved chunks
  const contextText = contextChunks
    .map((chunk, i) => {
      const title = (chunk.metadata?.title as string) || "Unknown Chapter";
      return `[Source ${i + 1}: ${title}]\n${chunk.content}`;
    })
    .join("\n\n---\n\n");

  const systemPrompt = `You are the AI Coach for the AI Consulting Playbook — a premium training course for AI consultants. 

Your role:
- Answer questions ONLY using the provided context from the playbook chapters.
- Reference specific chapters and concepts when answering.
- If the context doesn't cover the question, say so honestly — don't make things up.
- Be concise, practical, and encouraging. Use formatting (bold, bullet points) for readability.
- When quoting the playbook, use quotation marks.

${chapterContext?.title ? `The user is currently reading: "${chapterContext.title}"` : ""}

--- PLAYBOOK CONTEXT ---
${contextText}
--- END CONTEXT ---`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.4,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI Chat API error: ${response.status} — ${error}`);
  }

  const json = await response.json();
  return json.choices[0].message.content;
}

// --- Main Handler ---

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  // Only accept POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: corsHeaders(origin) },
    );
  }

  try {
    // Validate config
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY secret is not set");
    if (!SUPABASE_URL) throw new Error("SUPABASE_URL is not set");
    if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

    // Parse request body
    const { question, chapterContext } = await req.json();
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "A non-empty 'question' field is required" }),
        { status: 400, headers: corsHeaders(origin) },
      );
    }

    // 1. Generate embedding from the user's question
    const embedding = await generateEmbedding(question.trim());

    // 2. Query Supabase for matching document chunks
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: matches, error: matchError } = await supabase.rpc(
      "match_documents",
      {
        query_embedding: embedding,
        match_count: MATCH_COUNT,
        filter: {},
      },
    );

    if (matchError) {
      throw new Error(`Supabase match_documents error: ${matchError.message}`);
    }

    // Pass all matches to the LLM — let it determine relevance from content
    const relevantMatches = matches || [];
    console.log(`[RAG] "${question.trim()}" → ${relevantMatches.length} matches`);

    // 3. Generate a grounded answer using OpenAI chat
    const answer = await generateChatResponse(
      question.trim(),
      relevantMatches,
      chapterContext,
    );

    // 4. Build source references for the frontend
    const sources = relevantMatches.map(
      (m: { metadata: Record<string, unknown>; similarity: number }) => ({
        title: (m.metadata?.title as string) || "Unknown Chapter",
        similarity: Math.round(m.similarity * 100) / 100,
      }),
    );

    return new Response(
      JSON.stringify({ response: answer, sources }),
      { status: 200, headers: corsHeaders(origin) },
    );
  } catch (error) {
    console.error("Edge Function error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Internal server error" }),
      { status: 500, headers: corsHeaders(origin) },
    );
  }
});
