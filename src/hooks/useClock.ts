import { useState, useEffect } from 'react';

export function useClock() {
  const [time, setTime] = useState(formatTime());

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function formatTime(): string {
  return new Date().toTimeString().slice(0, 8) + ' UTC';
}
