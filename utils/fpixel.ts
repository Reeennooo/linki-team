export const FB_PIXEL_ID = 509211884587765

export const pageview = () => {
  //@ts-ignore
  window.fbq("track", "PageView")
}

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
  //@ts-ignore
  window.fbq("track", name, options)
}
