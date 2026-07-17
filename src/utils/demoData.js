// utils/demoData.js
// Purely optional. Lets the app look "lived-in" for a demo/recording by
// seeding 5 users + posts with real photo URLs, using the exact same
// storage.js functions as the rest of the app — so it's not hardcoded into
// any component, and it never runs unless the user explicitly asks for it.
import { storage, generateId } from './storage';

// Real, free-to-use portrait/photo URLs (picsum + pravatar — no API key needed).
const DEMO_USERS = [
  {
    name: 'Ayesha Raza',
    email: 'ayesha@demo.com',
    password: 'Demo1234',
    bio: 'Frontend dev · coffee-powered · Lahore',
    location: 'Lahore, Pakistan',
    avatar: 'https://i.pravatar.cc/150?img=47',
    coverImage: 'https://picsum.photos/seed/ayesha-cover/800/300',
  },
  {
    name: 'Bilal Ahmed',
    email: 'bilal@demo.com',
    password: 'Demo1234',
    bio: 'Photography + hiking on weekends',
    location: 'Islamabad, Pakistan',
    avatar: 'https://i.pravatar.cc/150?img=12',
    coverImage: 'https://picsum.photos/seed/bilal-cover/800/300',
  },
  {
    name: 'Sara Khan',
    email: 'sara@demo.com',
    password: 'Demo1234',
    bio: 'Designer. Cat person. Always learning.',
    location: 'Karachi, Pakistan',
    avatar: 'https://i.pravatar.cc/150?img=32',
    coverImage: 'https://picsum.photos/seed/sara-cover/800/300',
  },
  {
    name: 'Hamza Tariq',
    email: 'hamza@demo.com',
    password: 'Demo1234',
    bio: 'CS student · gamer · building cool stuff',
    location: 'Faisalabad, Pakistan',
    avatar: 'https://i.pravatar.cc/150?img=15',
    coverImage: 'https://picsum.photos/seed/hamza-cover/800/300',
  },
  {
    name: 'Zainab Malik',
    email: 'zainab@demo.com',
    password: 'Demo1234',
    bio: 'Traveler & foodie. Always planning the next trip ✈️',
    location: 'Multan, Pakistan',
    avatar: 'https://i.pravatar.cc/150?img=25',
    coverImage: 'https://picsum.photos/seed/zainab-cover/800/300',
  },
];

// One post per index below, authorIndex maps into DEMO_USERS.
const DEMO_POSTS = [
  { authorIndex: 0, text: 'Just shipped a new feature — small win but feels great 🚀', image: 'https://picsum.photos/seed/post1/600/400' },
  { authorIndex: 1, text: 'Weekend hike, best view I have seen in months.', image: 'https://picsum.photos/seed/post2/600/400' },
  { authorIndex: 2, text: 'Coffee, laptop, deadline. The usual Monday.', image: 'https://picsum.photos/seed/post3/600/400' },
  { authorIndex: 0, text: 'Finally finished the redesign, feedback welcome!', image: null },
  { authorIndex: 3, text: 'Pulled an all-nighter fixing a bug that turned out to be a missing semicolon 😅', image: 'https://picsum.photos/seed/post5/600/400' },
  { authorIndex: 4, text: 'Trying street food in a new city — 10/10 would recommend.', image: 'https://picsum.photos/seed/post6/600/400' },
  { authorIndex: 3, text: 'Finally beat that game I have been stuck on for weeks 🎮', image: null },
  { authorIndex: 4, text: 'Packing for the next trip already, cannot sit still.', image: 'https://picsum.photos/seed/post8/600/400' },
];

const COMMENT_TEXTS = [
  'Nice work!',
  'This is so cool, congrats!',
  'Love this 😍',
  'Where was this taken?',
  'Needed to see this today, thanks for sharing.',
];

// Seeds demo users + posts + likes + comments. Safe to call repeatedly —
// it checks for an existing demo user before adding duplicates.
export function seedDemoData() {
  const existingUsers = storage.getUsers();
  const alreadySeeded = existingUsers.some((u) => u.email === 'ayesha@demo.com');
  if (alreadySeeded) return existingUsers.find((u) => u.email === 'ayesha@demo.com');

  const newUsers = DEMO_USERS.map((u) => ({
    id: generateId('usr'),
    ...u,
    joinedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }));
  storage.setUsers([...existingUsers, ...newUsers]);

  const existingPosts = storage.getPosts();
  const newPosts = DEMO_POSTS.map((p, i) => ({
    id: generateId('post'),
    authorId: newUsers[p.authorIndex].id,
    description: p.text,
    image: p.image,
    isPublic: true,
    isDraft: false,
    createdAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
  }));
  storage.setPosts([...newPosts, ...existingPosts]);

  // Cross-likes: every post gets liked by 1-3 of the OTHER demo users
  // (never the post's own author), so the feed looks genuinely active.
  const existingLikes = storage.getLikes();
  const newLikes = [];
  newPosts.forEach((post) => {
    const author = newUsers.find((u) => u.id === post.authorId);
    const otherUsers = newUsers.filter((u) => u.id !== author.id);
    const likeCount = 1 + Math.floor(Math.random() * otherUsers.length);
    const shuffled = [...otherUsers].sort(() => Math.random() - 0.5).slice(0, likeCount);
    shuffled.forEach((liker) => {
      newLikes.push({
        id: generateId('like'),
        postId: post.id,
        userId: liker.id,
        createdAt: new Date().toISOString(),
      });
    });
  });
  storage.setLikes([...existingLikes, ...newLikes]);

  // Cross-comments: a couple of comments per post from other users.
  const existingComments = storage.getComments();
  const newComments = [];
  newPosts.forEach((post) => {
    const author = newUsers.find((u) => u.id === post.authorId);
    const otherUsers = newUsers.filter((u) => u.id !== author.id);
    const commentCount = Math.floor(Math.random() * 3); // 0-2 comments
    const shuffled = [...otherUsers].sort(() => Math.random() - 0.5).slice(0, commentCount);
    shuffled.forEach((commenter, idx) => {
      newComments.push({
        id: generateId('cmt'),
        postId: post.id,
        authorId: commenter.id,
        text: COMMENT_TEXTS[(idx + post.id.length) % COMMENT_TEXTS.length],
        createdAt: new Date().toISOString(),
      });
    });
  });
  storage.setComments([...existingComments, ...newComments]);

  return newUsers[0];
}
