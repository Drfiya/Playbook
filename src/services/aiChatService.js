/**
 * AI Chat Service — Sends user questions to the Supabase Edge Function
 * which performs RAG (Retrieval-Augmented Generation) against the
 * playbook's vector database and returns grounded answers.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/chat`;

/**
 * Send a message to the AI Coach via the Supabase RAG Edge Function.
 * @param {Object} payload
 * @param {string} payload.message - The user's question
 * @param {Object} [payload.context] - Current chapter context
 * @returns {Promise<{success: boolean, response?: string, sources?: Array, error?: string}>}
 */
export async function sendMessageToAI(payload) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase configuration missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    }

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        question: payload.message,
        chapterContext: payload.context?.chapter || null,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Edge Function error (${response.status}):`, errorBody);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.response) {
      console.error('Edge Function returned empty response:', data);
      throw new Error('AI response was empty');
    }

    return {
      success: true,
      response: data.response,
      sources: data.sources || [],
    };
  } catch (error) {
    console.error('AI Chat Service Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to connect to AI service',
    };
  }
}

/**
 * Build context object for the AI Coach.
 * @param {Object} currentChapter - The current chapter object
 * @param {Object} progress - User's progress data
 * @returns {Object} Context object for the Edge Function
 */
export function buildChatContext(currentChapter, progress) {
  return {
    chapter: currentChapter ? {
      id: currentChapter.id,
      title: currentChapter.title,
      subtitle: currentChapter.subtitle || '',
    } : null,
    userProgress: progress ? {
      sectionsRead: progress.sectionsRead?.length || 0,
      exercisesCompleted: progress.exercisesCompleted?.length || 0,
      quizScore: progress.quizScore || null,
      videoWatched: progress.videoWatched || false,
      completed: progress.completed || false,
    } : null,
  };
}

/**
 * Format conversation history for the Edge Function.
 * @param {Array} conversation - Array of conversation messages
 * @param {number} maxMessages - Maximum number of messages to include (default: 10)
 * @returns {Array} Formatted conversation history
 */
export function formatConversationHistory(conversation, maxMessages = 10) {
  const recentMessages = conversation
    .slice(-maxMessages)
    .map(msg => ({
      role: msg.role === 'coach' ? 'assistant' : 'user',
      content: msg.message,
    }));

  return recentMessages;
}
