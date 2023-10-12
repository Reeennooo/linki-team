export function scrollToFn(href, profile, shift) {
  if (!document.getElementById(href)) return
  const y = document.getElementById(href).getBoundingClientRect().top + window.pageYOffset - shift
  const yProfile =
    document.getElementById(href).getBoundingClientRect().top +
    document.querySelector(".page-layout__content-wrp")?.scrollTop -
    150
  if (profile) {
    document.querySelector(".page-layout__content-wrp")?.scrollTo({ top: yProfile, behavior: "smooth" })
  } else {
    window.scrollTo({ top: y, behavior: "smooth" })
  }
}
