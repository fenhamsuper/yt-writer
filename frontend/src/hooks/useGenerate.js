import { useState, useCallback, useRef } from 'react';
import { generateContentStream } from '../utils/api';

/**
 * Custom hook managing content generation state and streaming
 */
export function useGenerate() {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(null);

  const generate = useCallback((params) => {
    // Abort any existing stream
    if (abortRef.current) {
      abortRef.current();
    }

    setIsLoading(true);
    setIsStreaming(true);
    setContent('');
    setError(null);

    abortRef.current = generateContentStream(params, {
      onChunk: (text) => {
        setContent(prev => prev + text);
        setIsLoading(false);
      },
      onDone: () => {
        setIsLoading(false);
        setIsStreaming(false);
        abortRef.current = null;
      },
      onError: (err) => {
        setError(err.message || 'Something went wrong. Please try again.');
        setIsLoading(false);
        setIsStreaming(false);
        abortRef.current = null;
      },
    });
  }, []);

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
      setIsStreaming(false);
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    abort();
    setContent('');
    setError(null);
  }, [abort]);

  return { generate, abort, reset, isLoading, isStreaming, content, error };
}
