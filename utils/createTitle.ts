export function createTitle(title: string, styles) {
  let wordArr = title.split(" ")
  wordArr = wordArr.map((word) => `<div  class=${styles["word"]}>${word}</div>`)
  return wordArr.join(" ")
}
