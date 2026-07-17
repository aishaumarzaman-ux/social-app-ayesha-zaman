// utils/helpers.js

// Turns an ISO timestamp into a short relative label like Facebook's ("5m", "3h", "2d")
// and falls back to a formatted date for anything older than a week.
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// Longer, full date — used on profile "joined" and post detail pages.
export function formatFullDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Reads a File (from an <input type="file">) and resolves to a base64 data URL.
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Returns the first letter of a name, uppercased, for avatar fallbacks.
export function getInitial(name = '') {
  return name.trim().charAt(0).toUpperCase() || '?';
}
