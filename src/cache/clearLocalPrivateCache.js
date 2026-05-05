export async function clearLocalPrivateCache() {
  // Part 4 does not keep a custom SQLite message cache.
  // Firestore stores message/attachment metadata and Storage stores media bytes.
  // Sign-out still routes users away from private screens, and future local caches can be cleared here.
  return Promise.resolve();
}
