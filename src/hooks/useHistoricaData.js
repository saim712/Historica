import { useState, useEffect, useCallback } from 'react';

// placeholder webhook URL - replace with your real n8n endpoint
const WEBHOOK_URL = process.env.REACT_APP_HISTORICA_WEBHOOK ||
  'https://n8n.example.com/webhook/historica';

// cache key and duration (milliseconds)
const CACHE_KEY = 'historicaData';
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

const readCache = () => {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (Date.now() - parsed.ts < CACHE_DURATION) {
      return parsed.data;
    }
    localStorage.removeItem(CACHE_KEY);
  } catch { }
  return null;
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch { }
};

export default function useHistoricaData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cache = readCache();
      if (cache) {
        setData(cache);
        setLoading(false);
        return;
      }

      const res = await fetch(WEBHOOK_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      writeCache(json);
    } catch (err) {
      setError(err.message || 'fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}
