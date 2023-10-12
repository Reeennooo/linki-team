export const hasValueBetweenTags = (text: string | undefined): number | undefined => {
  if (!text) return

  const hasLettersAndNumbers = text.split(/<[^>]+>/g).filter((s) => s.trim().length > 0)
  return hasLettersAndNumbers.length
}
