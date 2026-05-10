/**
 * API utility for communicating with the ScriptForge backend
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Generate content using the AI backend (non-streaming)
 */
export async function generateContent(params) {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate content');
  }

  return data;
}

/**
 * Generate content with streaming (SSE) for real-time output
 * @param {Object} params - Generation parameters
 * @param {Function} onChunk - Called with each text chunk
 * @param {Function} onDone - Called when stream completes
 * @param {Function} onError - Called on error
 * @returns {Function} Abort function
 */
export function generateContentStream(params, { onChunk, onDone, onError }) {
  const controller = new AbortController();

  fetch(`${API_BASE}/generate/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    signal: controller.signal,
  }).then(async (response) => {
    if (!response.ok) {
      const data = await response.json();
      onError(new Error(data.error || 'Stream failed'));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) {
              onError(new Error(data.error));
              return;
            }
            if (data.done) {
              onDone(data);
            } else if (data.text) {
              onChunk(data.text);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    }
  }).catch((err) => {
    if (err.name !== 'AbortError') {
      onError(err);
    }
  });

  return () => controller.abort();
}

/**
 * Check if the backend API is healthy
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
