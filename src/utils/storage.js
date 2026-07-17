// utils/storage.js
// Single source of truth for all localStorage reads/writes.
// Never call localStorage directly from a component — always go through here.

const KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  CURRENT_USER: 'currentUser',
  THEME: 'theme',
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`storage: failed to read "${key}"`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`storage: failed to write "${key}"`, err);
  }
}

export const storage = {
  // ---------- users ----------
  getUsers() {
    return safeGet(KEYS.USERS, []);
  },
  setUsers(users) {
    safeSet(KEYS.USERS, users);
  },

  // ---------- posts ----------
  getPosts() {
    return safeGet(KEYS.POSTS, []);
  },
  setPosts(posts) {
    safeSet(KEYS.POSTS, posts);
  },

  // ---------- comments ----------
  getComments() {
    return safeGet(KEYS.COMMENTS, []);
  },
  setComments(comments) {
    safeSet(KEYS.COMMENTS, comments);
  },

  // ---------- likes ----------
  getLikes() {
    return safeGet(KEYS.LIKES, []);
  },
  setLikes(likes) {
    safeSet(KEYS.LIKES, likes);
  },

  // ---------- current session ----------
  getCurrentUser() {
    return safeGet(KEYS.CURRENT_USER, null);
  },
  setCurrentUser(user) {
    safeSet(KEYS.CURRENT_USER, user);
  },
  clearCurrentUser() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  // ---------- theme (bonus: dark mode) ----------
  getTheme() {
    return safeGet(KEYS.THEME, 'light');
  },
  setTheme(theme) {
    safeSet(KEYS.THEME, theme);
  },
};

// Generates a reasonably-unique id like "post_1737012345678_ab12x"
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
