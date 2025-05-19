import { useState } from "react";

export function useAsk() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async (question: string): Promise<string | null> => {
    if (!question.trim()) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      return data.answer || null;
    } catch (err) {
      console.error("Failed to fetch:", err);
      setError("Something went wrong. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { ask, loading, error };
}
