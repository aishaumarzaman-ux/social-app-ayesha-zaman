import { useState, useEffect } from 'react';

// Generic piece of state that stays synced to a localStorage key.
// Used for small, standalone preferences (e.g. dark mode) — NOT for the
// core app data, which goes through utils/storage.js instead.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`useLocalStorage: failed to persist "${key}"`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
