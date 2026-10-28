const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const options = {
    method,
    credentials: "include",
  };
  if (body !== undefined) {
    if (isForm) {
      options.body = body;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }
  }
  const res = await fetch(`${BASE_URL}${path}`, options);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status}).`;
    throw new Error(message);
  }
  return data;
}

// ---- Auth ----
export const signUp = (payload) => request("/api/auth/signup", { method: "POST", body: payload });
export const signIn = (payload) => request("/api/auth/signin", { method: "POST", body: payload });
export const signOut = () => request("/api/auth/signout", { method: "POST" });
export const getCurrentUser = () => request("/api/auth/me");

// ---- Users ----
export const getUser = (id) => request(`/api/users/${id}`);
export const updateUser = (id, fields) => request(`/api/users/${id}`, { method: "PUT", body: fields });
export const deleteAccount = (id) => request(`/api/users/${id}`, { method: "DELETE" });
export const uploadProfileImage = (id, formData) =>
  request(`/api/users/${id}/profile-image`, { method: "POST", body: formData, isForm: true });
export const addFriend = (id) => request(`/api/users/${id}/friend`, { method: "POST" });
export const removeFriend = (id) => request(`/api/users/${id}/friend`, { method: "DELETE" });
export const toggleFavorite = (id) => request(`/api/users/${id}/favorite`, { method: "POST" });
export const requestVerification = () => request(`/api/users/me/verify-request`, { method: "POST" });
export const markNotificationRead = (notifId) =>
  request(`/api/users/me/notifications/${notifId}/read`, { method: "POST" });
export const searchUsers = (q) => request(`/api/users/search?q=${encodeURIComponent(q)}`);

// ---- Posts ----
export const getFeed = ({ scope = "global", sort = "newest", hashtag } = {}) => {
  const params = new URLSearchParams({ scope, sort });
  if (hashtag) params.set("hashtag", hashtag);
  return request(`/api/posts?${params.toString()}`);
};
export const getPost = (id) => request(`/api/posts/${id}`);
export const createPost = (formData) => request("/api/posts", { method: "POST", body: formData, isForm: true });
export const updatePost = (id, fields) => request(`/api/posts/${id}`, { method: "PUT", body: fields });
export const deletePost = (id) => request(`/api/posts/${id}`, { method: "DELETE" });
export const addComment = (id, text) => request(`/api/posts/${id}/comments`, { method: "POST", body: { text } });
export const reportPost = (id, reasonId) => request(`/api/posts/${id}/reports`, { method: "POST", body: { reasonId } });
export const getReasons = () => request("/api/reasons");
export const getHiddenPosts = () => request("/api/posts/hidden");
export const searchPosts = (q) => request(`/api/posts/search?q=${encodeURIComponent(q)}`);
export const getPostsByHashtag = (tag) => request(`/api/posts/hashtag/${encodeURIComponent(tag)}`);

// ---- Albums ----
export const getAllAlbums = () => request("/api/albums");
export const getUserAlbums = (userId) => request(`/api/albums/user/${userId}`);
export const getAlbum = (id) => request(`/api/albums/${id}`);
export const createAlbum = (payload) => request("/api/albums", { method: "POST", body: payload });
export const updateAlbum = (id, fields) => request(`/api/albums/${id}`, { method: "PUT", body: fields });
export const deleteAlbum = (id) => request(`/api/albums/${id}`, { method: "DELETE" });
export const addPostToAlbum = (albumId, postId) => request(`/api/albums/${albumId}/posts/${postId}`, { method: "POST" });
export const removePostFromAlbum = (albumId, postId) => request(`/api/albums/${albumId}/posts/${postId}`, { method: "DELETE" });
export const searchAlbums = (q) => request(`/api/albums/search?q=${encodeURIComponent(q)}`);
export const getHashtagSuggestions = () => request("/api/albums/hashtag-suggestions");

// ---- Search (autocomplete) ----
export const getSuggestions = (q) => request(`/api/search/suggest?q=${encodeURIComponent(q)}`);

// ---- Admin ----
export const adminGetUsers = () => request("/api/admin/users");
export const adminUpdateUser = (id, fields) => request(`/api/admin/users/${id}`, { method: "PUT", body: fields });
export const adminDeleteUser = (id) => request(`/api/admin/users/${id}`, { method: "DELETE" });
export const adminGetVerificationRequests = () => request("/api/admin/verification-requests");
export const adminSetVerified = (id, approve) => request(`/api/admin/users/${id}/verify`, { method: "POST", body: { approve } });
export const adminGetPosts = () => request("/api/admin/posts");
export const adminUpdatePost = (id, fields) => request(`/api/admin/posts/${id}`, { method: "PUT", body: fields });
export const adminDeletePost = (id) => request(`/api/admin/posts/${id}`, { method: "DELETE" });
export const adminGetReportedPosts = () => request("/api/admin/reported-posts");
export const adminClearReports = (id) => request(`/api/admin/posts/${id}/clear-reports`, { method: "POST" });
export const adminGetAlbums = () => request("/api/admin/albums");
export const adminUpdateAlbum = (id, fields) => request(`/api/admin/albums/${id}`, { method: "PUT", body: fields });
export const adminDeleteAlbum = (id) => request(`/api/admin/albums/${id}`, { method: "DELETE" });
export const adminGetReasons = () => request("/api/admin/reasons");
export const adminAddReason = (text) => request("/api/admin/reasons", { method: "POST", body: { text } });
export const adminDeleteReason = (id) => request(`/api/admin/reasons/${id}`, { method: "DELETE" });

export function imageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}
