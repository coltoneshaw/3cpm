import { useRef, useEffect } from 'react';

function useInterval(callback: Function, delay: number | null) {
  console.log('use Interval was called');
  const intervalRef = useRef<NodeJS.Timeout>();
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    // if (typeof delay === 'number') {
    //   intervalRef.current = setInterval(tick, delay);
    //   return () => clearInterval(intervalRef.current);
    // }
    // return null;
    if (typeof delay === 'number') {
      intervalRef.current = setInterval(tick, delay);
    }

    if (!delay && intervalRef.current) clearInterval(intervalRef.current);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [delay]);

  return intervalRef;
}

export default useInterval;
