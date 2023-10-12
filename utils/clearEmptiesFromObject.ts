export function clearEmptiesFromObject(obj) {
  const newObj = { ...obj }
  for (const key in newObj) {
    if (newObj[key] === "" || newObj[key] === null || newObj[key] === undefined) {
      delete newObj[key]
    }
    if (Array.isArray(newObj[key]) && !newObj[key].length) delete newObj[key]
  }
  return Object.keys(newObj).length ? newObj : undefined
}
