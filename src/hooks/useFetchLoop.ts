import { useState, useRef, useEffect } from 'react';

function useFetchLoop<T>(url: string, action?: (data: T, prevData?: T) => T, intervalTime: number = 5000, checkPrev: boolean = false, isFocused: boolean = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | string | null>(null);

  const prevDataRef = useRef<T | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData: T = await response.json();
        let formattedData = jsonData;

        if (action) {
          formattedData = checkPrev ? action(jsonData, prevDataRef.current) :  action(jsonData);
        }

        setData(formattedData);
        prevDataRef.current = formattedData;

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    if(isFocused){
      fetchData();
      const interval = setInterval(fetchData, intervalTime);

      return () => clearInterval(interval);
    }
  }, [url,isFocused]);

  return { data, loading, error };
}

export default useFetchLoop;
