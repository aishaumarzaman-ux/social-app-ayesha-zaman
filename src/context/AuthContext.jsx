import { createContext, useState } from 'react';
import { storage, generateId } from '../utils/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialise straight from localStorage so a page refresh keeps the session alive.
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser());

  function signup({ name, email, password }) {
    const users = storage.getUsers();
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (emailTaken) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: generateId('usr'),
      name,
      email,
      password,
      bio: '',
      location: '',
      avatar: null,
      coverImage: null,
      joinedAt: new Date().toISOString(),
    };

    storage.setUsers([...users, newUser]);
    return newUser;
  }

  function login(email, password) {
    const users = storage.getUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!match) {
      throw new Error('Invalid email or password');
    }

    // eslint-disable-next-line no-unused-vars
    const { password: _pw, ...safeUser } = match;
    storage.setCurrentUser(safeUser);
    setCurrentUser(safeUser);
    return safeUser;
  }

  function logout() {
    storage.clearCurrentUser();
    setCurrentUser(null);
  }

  function updateCurrentUser(updatedData) {
    if (!currentUser) return;

    const merged = { ...currentUser, ...updatedData };

    // Persist to the session key.
    storage.setCurrentUser(merged);
    setCurrentUser(merged);

    // Persist to the users array too (password must be preserved from the stored record).
    const users = storage.getUsers();
    const nextUsers = users.map((u) =>
      u.id === merged.id ? { ...u, ...updatedData } : u
    );
    storage.setUsers(nextUsers);
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
