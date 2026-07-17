import { useCallback, useState } from 'react';
import { storage, generateId } from '../utils/storage';

// Central place for every post/like/comment CRUD operation.
// Components call these instead of touching storage.js directly.
export function usePosts() {
  // A tick we bump whenever data changes, so components that want to
  // "refresh" after a mutation can just re-read storage.
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  // ---------- reads ----------
  const getAllPosts = useCallback(() => storage.getPosts(), []);

  const getPublicPosts = useCallback(() => {
    return storage
      .getPosts()
      .filter((p) => p.isPublic && !p.isDraft)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, []);

  const getUserPosts = useCallback((userId) => {
    return storage
      .getPosts()
      .filter((p) => p.authorId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, []);

  const getUserPublicPosts = useCallback((userId) => {
    return storage
      .getPosts()
      .filter((p) => p.authorId === userId && p.isPublic && !p.isDraft)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, []);

  const getPostById = useCallback((postId) => {
    return storage.getPosts().find((p) => p.id === postId) || null;
  }, []);

  // ---------- post CRUD ----------
  const createPost = useCallback(({ authorId, description, image, isPublic, isDraft }) => {
    const now = new Date().toISOString();
    const newPost = {
      id: generateId('post'),
      authorId,
      description,
      image: image || null,
      isPublic: !!isPublic,
      isDraft: !!isDraft,
      createdAt: now,
      updatedAt: now,
    };
    storage.setPosts([newPost, ...storage.getPosts()]);
    refresh();
    return newPost;
  }, []);

  const updatePost = useCallback((postId, updates) => {
    const posts = storage.getPosts();
    const next = posts.map((p) =>
      p.id === postId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    storage.setPosts(next);
    refresh();
  }, []);

  const deletePost = useCallback((postId) => {
    storage.setPosts(storage.getPosts().filter((p) => p.id !== postId));
    storage.setComments(storage.getComments().filter((c) => c.postId !== postId));
    storage.setLikes(storage.getLikes().filter((l) => l.postId !== postId));
    refresh();
  }, []);

  const toggleVisibility = useCallback((postId) => {
    const posts = storage.getPosts();
    const next = posts.map((p) =>
      p.id === postId ? { ...p, isPublic: !p.isPublic } : p
    );
    storage.setPosts(next);
    refresh();
  }, []);

  const publishPost = useCallback((postId) => {
    updatePost(postId, { isDraft: false, isPublic: true });
  }, [updatePost]);

  // ---------- likes ----------
  const getLikesForPost = useCallback((postId) => {
    return storage.getLikes().filter((l) => l.postId === postId);
  }, []);

  const isLikedByUser = useCallback((postId, userId) => {
    if (!userId) return false;
    return storage.getLikes().some((l) => l.postId === postId && l.userId === userId);
  }, []);

  const toggleLike = useCallback((postId, userId) => {
    const likes = storage.getLikes();
    const existing = likes.find((l) => l.postId === postId && l.userId === userId);
    if (existing) {
      storage.setLikes(likes.filter((l) => l.id !== existing.id));
    } else {
      storage.setLikes([
        ...likes,
        { id: generateId('like'), postId, userId, createdAt: new Date().toISOString() },
      ]);
    }
    refresh();
  }, []);

  // ---------- comments ----------
  const getCommentsForPost = useCallback((postId) => {
    return storage
      .getComments()
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, []);

  const addComment = useCallback((postId, authorId, text) => {
    const newComment = {
      id: generateId('cmt'),
      postId,
      authorId,
      text,
      createdAt: new Date().toISOString(),
    };
    storage.setComments([...storage.getComments(), newComment]);
    refresh();
    return newComment;
  }, []);

  const deleteComment = useCallback((commentId) => {
    storage.setComments(storage.getComments().filter((c) => c.id !== commentId));
    refresh();
  }, []);

  return {
    getAllPosts,
    getPublicPosts,
    getUserPosts,
    getUserPublicPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    toggleVisibility,
    publishPost,
    getLikesForPost,
    isLikedByUser,
    toggleLike,
    getCommentsForPost,
    addComment,
    deleteComment,
  };
}
