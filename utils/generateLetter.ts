function generateLetter(url) {
  if (url) {
    const re = /^(?:https?:\/\/)?(?:www\.)?([^/]+)/
    return url.match(re)[1].substring(0, 1)
  } else {
    return false
  }
}
export { generateLetter }
