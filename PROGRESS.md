# SocialApp — Build Progress Notes

## ✅ DONE (Part 1 — foundation, complete and tested-by-eye)
- Project setup: package.json, vite.config.js, tailwind.config.js, postcss.config.js, index.html
- src/index.css (Tailwind directives + base styles, dark mode via `class` strategy)
- src/utils/storage.js — ALL localStorage helpers (getUsers/setUsers, getPosts/setPosts,
  getComments/setComments, getLikes/setLikes, getCurrentUser/setCurrentUser/clearCurrentUser,
  getTheme/setTheme, generateId())
- src/utils/helpers.js — formatDate, formatFullDate, fileToBase64, getInitial
- src/context/AuthContext.jsx — signup, login, logout, updateCurrentUser, isAuthenticated
- src/hooks/useAuth.js — useContext(AuthContext) shortcut
- src/hooks/useLocalStorage.js — generic localStorage-synced state (used for theme)
- src/hooks/usePosts.js — FULL CRUD: getPublicPosts, getUserPosts, getUserPublicPosts,
  getPostById, createPost, updatePost, deletePost, toggleVisibility, publishPost,
  getLikesForPost, isLikedByUser, toggleLike, getCommentsForPost, addComment, deleteComment
- src/components/ui/Button.jsx — variants: primary/secondary/danger/ghost, sizes, isLoading spinner
- src/components/ui/Input.jsx — label + error, forwardRef for react-hook-form register()
- src/components/ui/Avatar.jsx — image or initial-letter fallback, 3 sizes
- src/components/ui/Modal.jsx — overlay + Escape key + click-outside close
- src/components/ui/Badge.jsx — draft/public/private pill
- src/components/layout/Navbar.jsx — auth-aware links + dark mode toggle (NOTE: search prop
  was removed from Navbar; search bar should live inside FeedPage.jsx directly — see below)
- src/components/layout/Footer.jsx
- src/components/post/PostActions.jsx — like + comment buttons, guest → /login redirect
- src/components/post/PostCard.jsx — full reusable post card (feed + profile)
- src/components/post/PostForm.jsx — shared create/edit form: RHF validation, image preview,
  live char counter (400 amber / 480 red / 500 disabled), Save as Draft + Publish buttons
- src/components/post/CommentSection.jsx — list + add + delete-own-comment with inline
  "Are you sure? Yes/No" confirmation (NOT window.confirm)
- src/components/profile/ProfileHeader.jsx — cover image/gradient, avatar, bio, location,
  joined date, conditional Edit Profile button
- src/components/RequireAuth.jsx — protected route guard, redirects to /login

## ✅ DONE (Part 2a — routing + all public pages, complete and tested-by-eye)
- src/main.jsx — `<BrowserRouter>` + `<AuthProvider>` wrapping `<App />`
- src/App.jsx — full route map wired with `React.lazy()` + `<Suspense>`, theme state
  (light/dark, persisted via `storage.getTheme/setTheme`, toggles `dark` class on `<html>`),
  Navbar + Footer shell, `/dashboard/*` nested under `<RequireAuth><DashboardLayout /></RequireAuth>`
- src/pages/FeedPage.jsx — public posts, empty state, **bonus: live search filter**
- src/pages/LoginPage.jsx — RHF validation, inline error, already-authed redirect, reads
  `location.state.message` banner (e.g. "Please login to interact")
- src/pages/SignupPage.jsx — RHF validation exactly per PDF (name/email/password/confirm via
  `watch()`), already-authed redirect
- src/pages/PostDetailPage.jsx — full post, like/unlike, `<CommentSection>`
- src/pages/ProfilePage.jsx — `<ProfileHeader>` + user's public posts, owner-only edit button
  (handled inside ProfileHeader via `isOwner`)
- src/pages/NotFoundPage.jsx — simple 404

## ✅ DONE (Part 2b — dashboard pages + README, complete)
- src/pages/dashboard/DashboardLayout.jsx
- src/pages/dashboard/PostsDashboard.jsx
- src/pages/dashboard/CreatePost.jsx
- src/pages/dashboard/EditPost.jsx
- src/pages/dashboard/ProfileSettings.jsx
- README.md (all 10 sections; screenshots + live demo link are placeholders — fill in
  after `npm run dev` and deploying)

## 🔲 Historical TODO notes (kept for reference, now completed above)

Everything above this line is done and internally consistent — imports, prop names, and hook
signatures below all match what already exists. Nothing needs to be guessed; just follow the
patterns already used in FeedPage/PostDetailPage/ProfilePage (same Tailwind classes, same
`useAuth()` / `usePosts()` hooks, same empty-state style).

1. **src/pages/dashboard/DashboardLayout.jsx** — persistent left sidebar (links to
   posts/create/settings, + bonus Saved Posts if you add bookmarks) + `<Outlet />` for the
   active sub-page.

2. **src/pages/dashboard/PostsDashboard.jsx** — `usePosts().getUserPosts(currentUser.id)` (ALL
    statuses), row per post with Badge (draft/public/private), Edit/Delete/Toggle buttons,
    Delete uses `<Modal>` for confirmation (not `confirm()`), Drafts get a "Publish" button
    (`publishPost`), empty state "You haven't created any posts yet. Create your first post!".

3. **src/pages/dashboard/CreatePost.jsx** — renders `<PostForm>`, on submit calls
    `createPost({ authorId: currentUser.id, ...formData })`; on draft show "Post saved as
    draft" + reset form; on publish `navigate('/')`.

4. **src/pages/dashboard/EditPost.jsx** — `useParams()` postId, `getPostById`, if
    `post.authorId !== currentUser.id` → `<Navigate to="/dashboard/posts" />`, pass
    `defaultValues={post}` into `<PostForm>`, on submit call `updatePost(postId, formData)`.

5. **src/pages/dashboard/ProfileSettings.jsx** — RHF pre-filled with currentUser (name
    required, bio optional max 150 chars w/ live counter, location optional), avatar upload
    with `fileToBase64` + live preview, calls `updateCurrentUser()`, success message "Profile
    updated successfully".

6. **README.md** — all 10 required sections (see PDF pages 14–15). Needs real screenshots
    once the app is run, and a live demo link once deployed — those two can't be done inside
    this sandbox, flag them for the user to fill in after `npm run dev` / deploying to Vercel.

## Design notes to stay consistent
- Palette: `brand` = indigo-blue (#4b64e5 family), backgrounds `surface-light`/`surface-dark`,
  fonts: Sora (display/headings) + Inter (body) — already wired in tailwind.config.js/index.css.
- Dark mode: Tailwind `darkMode: 'class'` — toggle by adding/removing `dark` on `<html>`.
- Every list needs an empty state (per PDF "Common Mistakes to Avoid").
- Always use `post.id` / `user.id` / `comment.id` as React keys, never array index.
- Never call `localStorage` directly in a page/component — always go through `utils/storage.js`
  or the `usePosts`/`useAuth` hooks.
