import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

export default function Navbar({ theme, onToggleTheme }) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-surface-dark/90">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-brand-600">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">S</span>
          SocialApp
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {/* Bonus add-on: dark mode toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard/posts" className="hidden text-sm font-medium text-slate-600 hover:text-brand-600 sm:block dark:text-slate-300">
                Dashboard
              </Link>
              <Link to={`/profile/${currentUser.id}`}>
                <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
