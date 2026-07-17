import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatFullDate } from '../../utils/helpers';

// Renders the cover image, avatar, bio, location, joined date.
// Shows "Edit Profile" only when isOwner is true.
export default function ProfileHeader({ user, isOwner }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div
        className="h-40 w-full sm:h-52"
        style={
          user.coverImage
            ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, #4b64e5, #8fa2f2)' }
        }
      />
      <div className="relative px-6 pb-6">
        <div className="-mt-10 mb-3">
          <Avatar
            src={user.avatar}
            name={user.name}
            size="lg"
            className="border-4 border-white dark:border-slate-900"
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
              {user.name}
            </h1>
            {user.location && (
              <p className="text-sm text-slate-500">📍 {user.location}</p>
            )}
            <p className="text-xs text-slate-400">
              Joined {formatFullDate(user.joinedAt)}
            </p>
          </div>

          {isOwner && (
            <Link to="/dashboard/settings">
              <Button variant="secondary" size="sm">Edit Profile</Button>
            </Link>
          )}
        </div>

        {user.bio && (
          <p className="mt-3 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
            {user.bio}
          </p>
        )}
      </div>
    </div>
  );
}
