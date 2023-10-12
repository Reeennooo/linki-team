export function setDatalayer(obj) {
  // @ts-ignore
  if (window?.dataLayer) dataLayer.push(obj)
}
