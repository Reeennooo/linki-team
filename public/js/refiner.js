window._refinerQueue = window._refinerQueue || []
function _refiner() {
  _refinerQueue.push(arguments)
}
_refiner("setProject", "578832a0-0cbd-11ed-8918-571e592b018a")
;(function () {
  var a = document.createElement("script")
  a.type = "text/javascript"
  a.async = !0
  a.src = "https://js.refiner.io/v001/client.js"
  var b = document.getElementsByTagName("script")[0]
  b.parentNode.insertBefore(a, b)
})()

_refiner("identifyUser", {
  id: "USER-ID-ABC-123", // Replace with your user ID
  email: "jane@awesome.com", // Replace with user Email
  name: "Jane Doe", // Replace with user name
})
