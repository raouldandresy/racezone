import { useState, useEffect } from 'react';

function useFetch<T>(url: string, action?: (data: T) => T) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | string | null>(null);

  useEffect(() => {
    const fetchData = async (urlParam: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(urlParam);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const jsonData: T = await response.json();

        const formattedData = action ? action(jsonData) : jsonData;

        setData(formattedData);
      } catch (err: any) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData(url);
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
