const BASE_URL = "http://localhost:3000/api";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

// ---------- current user (localStorage convenience, not a real session) ----------

export function getCurrentUser() {
  const stored = localStorage.getItem("currentUser");
  return stored ? JSON.parse(stored) : null;
}

export function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

// ---------- auth ----------

export function signIn(email, password) {
  return request("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signUp(userData) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// ---------- users / profile / friends ----------

export function getUser(id) {
  return request(`/users/${id}`);
}

export function updateUserProfile(id, updates) {
  return request(`/users/${id}`, { method: "PUT", body: JSON.stringify(updates) });
}

export function deleteAccount(id) {
  return request(`/users/${id}`, { method: "DELETE" });
}

export function addFriend(id, friendId) {
  return request(`/users/${id}/friend`, {
    method: "POST",
    body: JSON.stringify({ friendId }),
  });
}

export function removeFriend(id, friendId) {
  return request(`/users/${id}/friend`, {
    method: "DELETE",
    body: JSON.stringify({ friendId }),
  });
}

// ---------- posts ----------

export function getAllPosts() {
  return request("/posts");
}

export function getLocalFeed(userIds) {
  return request(`/posts/feed?userIds=${userIds.join(",")}`);
}

export function getPostsByUser(id) {
  return request(`/posts/feed?userIds=${id}`);
}

export function getPost(id) {
  return request(`/posts/${id}`);
}

export function getAlbumsForPost(id) {
  return request(`/posts/${id}/albums`);
}

export function createPost(postData) {
  return request("/posts", { method: "POST", body: JSON.stringify(postData) });
}

export function updatePost(id, updates) {
  return request(`/posts/${id}`, { method: "PUT", body: JSON.stringify(updates) });
}

export function deletePost(id) {
  return request(`/posts/${id}`, { method: "DELETE" });
}

export function addComment(postId, comment) {
  return request(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(comment),
  });
}

export function reportPost(postId, userId, reason) {
  return request(`/posts/${postId}/reports`, {
    method: "POST",
    body: JSON.stringify({ userId, reason }),
  });
}

// ---------- albums ----------

export function getAllAlbums() {
  return request("/albums");
}

export function getAlbumsByUser(userId) {
  return request(`/albums/user/${userId}`);
}

export function getAlbum(id) {
  return request(`/albums/${id}`);
}

export function createAlbum(albumData) {
  return request("/albums", { method: "POST", body: JSON.stringify(albumData) });
}

export function updateAlbum(id, updates) {
  return request(`/albums/${id}`, { method: "PUT", body: JSON.stringify(updates) });
}

export function deleteAlbum(id) {
  return request(`/albums/${id}`, { method: "DELETE" });
}

export function addPostToAlbum(albumId, postId) {
  return request(`/albums/${albumId}/posts`, {
    method: "POST",
    body: JSON.stringify({ postId }),
  });
}

export function removePostFromAlbum(albumId, postId) {
  return request(`/albums/${albumId}/posts`, {
    method: "DELETE",
    body: JSON.stringify({ postId }),
  });
}
