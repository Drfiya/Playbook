/**
 * Re-embed all documents in the Supabase `documents` table
 * using OpenAI's `text-embedding-3-small` model.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   OPENAI_API_KEY=sk-... \
 *   node scripts/reembed-documents.mjs
 *
 * This script:
 *  1. Fetches all documents from Supabase (id + content)
 *  2. Batches content for the OpenAI embedding API
 *  3. Updates each document's embedding in Supabase
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const EMBEDDING_MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 100; // documents per OpenAI API call
const PAGE_SIZE = 1000; // documents per Supabase fetch

// --- Helpers ---

/** Fetch a page of documents from Supabase. */
async function fetchDocuments(offset, limit) {
    const url = `${SUPABASE_URL}/rest/v1/documents?select=id,content&order=id&offset=${offset}&limit=${limit}`;
    const res = await fetch(url, {
        headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
    });
    if (!res.ok) throw new Error(`Fetch documents failed: ${res.status} ${await res.text()}`);
    return res.json();
}

/** Generate embeddings for a batch of texts via OpenAI. */
async function generateEmbeddings(texts) {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`OpenAI embeddings error: ${res.status} — ${body}`);
    }
    const json = await res.json();
    return json.data.map(d => d.embedding);
}

/** Update a single document's embedding in Supabase. */
async function updateEmbedding(id, embedding) {
    const url = `${SUPABASE_URL}/rest/v1/documents?id=eq.${id}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ embedding }),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Update embedding for id=${id} failed: ${res.status} — ${body}`);
    }
}

// --- Main ---

async function main() {
    const missing = [];
    if (!SUPABASE_URL) missing.push('SUPABASE_URL');
    if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!OPENAI_API_KEY) missing.push('OPENAI_API_KEY');

    if (missing.length > 0) {
        console.error(`Error: Missing required env vars: ${missing.join(', ')}`);
        console.error('Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... OPENAI_API_KEY=... node scripts/reembed-documents.mjs');
        process.exit(1);
    }

    console.log(`\n🔄 Re-embedding documents with "${EMBEDDING_MODEL}"\n`);

    // 1. Fetch all documents
    let allDocs = [];
    let offset = 0;
    while (true) {
        const page = await fetchDocuments(offset, PAGE_SIZE);
        allDocs = allDocs.concat(page);
        console.log(`  Fetched ${allDocs.length} documents...`);
        if (page.length < PAGE_SIZE) break;
        offset += PAGE_SIZE;
    }
    console.log(`\n📄 Total documents: ${allDocs.length}\n`);

    // 2. Process in batches
    let processed = 0;
    let errors = 0;

    for (let i = 0; i < allDocs.length; i += BATCH_SIZE) {
        const batch = allDocs.slice(i, i + BATCH_SIZE);
        const texts = batch.map(d => d.content || '');

        try {
            // Generate embeddings for this batch
            const embeddings = await generateEmbeddings(texts);

            // Update each document
            for (let j = 0; j < batch.length; j++) {
                try {
                    await updateEmbedding(batch[j].id, embeddings[j]);
                    processed++;
                } catch (err) {
                    errors++;
                    console.error(`  ❌ Failed to update doc id=${batch[j].id}: ${err.message}`);
                }
            }

            const pct = ((processed + errors) / allDocs.length * 100).toFixed(1);
            console.log(`  ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${processed} updated, ${errors} errors (${pct}%)`);
        } catch (err) {
            console.error(`  ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} embedding failed: ${err.message}`);
            errors += batch.length;
        }
    }

    console.log(`\n✨ Done! ${processed} documents re-embedded, ${errors} errors.\n`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
