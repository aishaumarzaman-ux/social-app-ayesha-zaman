import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { storage } from './utils/storage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import RequireAuth from './components/RequireAuth';

// Every page is its own lazy chunk — only downloads when visited.
const FeedPage = lazy(() => import('./pages/FeedPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const PostsDashboard = lazy(() => import('./pages/dashboard/PostsDashboard'));
const SavedPosts = lazy(() => import('./pages/dashboard/SavedPosts'));
const CreatePost = lazy(() => import('./pages/dashboard/CreatePost'));
const EditPost = lazy(() => import('./pages/dashboard/EditPost'));
const ProfileSettings = lazy(() => import('./pages/dashboard/ProfileSettings'));

function PageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <svg className="h-8 w-8 animate-spin text-brand-600" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => storage.getTheme());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    storage.setTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<FeedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />

            {/* Protected — dashboard tree */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardLayout />
                </RequireAuth>
              }
            >
              <Route index element={<PostsDashboard />} />
              <Route path="posts" element={<PostsDashboard />} />
              <Route path="saved" element={<SavedPosts />} />
              <Route path="create" element={<CreatePost />} />
              <Route path="edit/:postId" element={<EditPost />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
