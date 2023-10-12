// Временное решение. Сервер присылает строку - в типах число.

export const ratingConverter = (rating: number | string): string => {
  const isRatingString = typeof rating === "string"

  if (isRatingString && rating === "0") return "Newbie"
  if (isRatingString && rating.length === 1) return rating
  if (!isRatingString && rating === 0) return "Newbie"

  return Number(rating).toFixed(1).replace(".", ",")
}
