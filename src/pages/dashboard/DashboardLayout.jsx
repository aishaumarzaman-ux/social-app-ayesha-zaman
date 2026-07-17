import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

const LINKS = [
  { to: '/dashboard/posts', label: 'My Posts', icon: '📝' },
  { to: '/dashboard/saved', label: 'Saved Posts', icon: '🔖' },
  { to: '/dashboard/create', label: 'Create Post', icon: '➕' },
  { to: '/dashboard/settings', label: 'Profile Settings', icon: '⚙️' },
];

// Persistent left sidebar + the active sub-page rendered through <Outlet />.
export default function DashboardLayout() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <aside className="sm:w-56 sm:flex-shrink-0">
        <nav className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:flex-col sm:overflow-visible">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard/posts'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )
              }
            >
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
