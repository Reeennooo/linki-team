const queryString = require("qs")

export function paramsStringify(data, options = {}) {
  return queryString.stringify(data, options)
}
