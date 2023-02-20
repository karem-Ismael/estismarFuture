export function getPageFromHash(history) {
  if (history.location.hash.startsWith("#page=")) {
    return +history.location.hash.slice(6);
  }
}
