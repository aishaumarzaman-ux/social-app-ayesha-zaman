// A quick "at a glance" stats strip for the dashboard — total posts, likes
// received, comments received, and a simple engagement score. Pure derived
// data from what's already in localStorage via usePosts, no new storage keys,
// no new route — it just sits on top of the required My Posts page.
function StatCard({ label, value, accent }) {
  return (
    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

export default function StatsOverview({ posts, getLikesForPost, getCommentsForPost }) {
  const totalPosts = posts.length;
  const published = posts.filter((p) => !p.isDraft && p.isPublic).length;
  const drafts = posts.filter((p) => p.isDraft).length;

  const totalLikes = posts.reduce((sum, p) => sum + getLikesForPost(p.id).length, 0);
  const totalComments = posts.reduce((sum, p) => sum + getCommentsForPost(p.id).length, 0);

  // Simple engagement score: average interactions per post, one decimal place.
  const engagement = totalPosts > 0
    ? ((totalLikes + totalComments) / totalPosts).toFixed(1)
    : '0.0';

  if (totalPosts === 0) return null;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Total Posts" value={totalPosts} accent="text-slate-800 dark:text-slate-100" />
      <StatCard label="Published" value={published} accent="text-emerald-600 dark:text-emerald-400" />
      <StatCard label="Drafts" value={drafts} accent="text-slate-500 dark:text-slate-400" />
      <StatCard label="Engagement / post" value={engagement} accent="text-brand-600 dark:text-brand-400" />
    </div>
  );
}
