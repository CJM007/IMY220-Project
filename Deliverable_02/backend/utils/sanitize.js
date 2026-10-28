export function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

export function sanitizePublicUser(user) {
  if (!user) return null;
  const { passwordHash, email, notifications, ...rest } = user;
  return rest;
}
