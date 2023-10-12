// список параметров https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#parameters
const formatter = new Intl.NumberFormat()
export const numberFormat = (number: number): string => formatter.format(number)

export function getUnixTimestamp(date: Date): number {
  return Math.floor(new Date(date).getTime() / 1000)
}
