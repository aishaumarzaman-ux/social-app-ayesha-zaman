import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Shortcut so components can do: const { currentUser, login } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
