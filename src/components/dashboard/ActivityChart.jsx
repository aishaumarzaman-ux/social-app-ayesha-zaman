// Hand-built SVG bar chart — no chart library, keeps the tech stack exactly
// what the README claims. Shows likes + comments per post so the dashboard
// isn't just a plain list.
export default function ActivityChart({ posts, getLikesForPost, getCommentsForPost }) {
  if (!posts || posts.length === 0) return null;

  // Most recent 6 posts, oldest first so the bars read left-to-right in time.
  const recent = [...posts].slice(0, 6).reverse();

  const rows = recent.map((post) => ({
    id: post.id,
    label: post.description.slice(0, 18) + (post.description.length > 18 ? '…' : ''),
    likes: getLikesForPost(post.id).length,
    comments: getCommentsForPost(post.id).length,
  }));

  const maxVal = Math.max(...rows.map((r) => r.likes + r.comments), 1);

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
        Engagement — your last {rows.length} post{rows.length > 1 ? 's' : ''}
      </h2>

      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const total = row.likes + row.comments;
          const likePct = (row.likes / maxVal) * 100;
          const commentPct = (row.comments / maxVal) * 100;

          return (
            <div key={row.id} className="flex items-center gap-3">
              <span className="w-28 flex-shrink-0 truncate text-xs text-slate-500 dark:text-slate-400">
                {row.label}
              </span>
              <div className="flex h-3 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-rose-400 transition-all duration-700 ease-out"
                  style={{ width: `${likePct}%` }}
                  title={`${row.likes} likes`}
                />
                <div
                  className="h-full bg-brand-400 transition-all duration-700 ease-out"
                  style={{ width: `${commentPct}%` }}
                  title={`${row.comments} comments`}
                />
              </div>
              <span className="w-16 flex-shrink-0 text-right text-xs font-medium text-slate-500 dark:text-slate-400">
                {total === 0 ? '—' : `${total} total`}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-400" /> Likes
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-400" /> Comments
        </span>
      </div>
    </div>
  );
}
