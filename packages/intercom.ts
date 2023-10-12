declare global {
  interface Window {
    Intercom: any
  }
}

const APP_ID = "c3kcv3tc"

export interface IntercomUserData {
  name?: string
  surname?: string
  role?: string
  email?: string
  created_at?: number
  user_hash?: string
  last_request_at?: number
}

export const loadIntercom = (cb) => {
  const w: any = window
  const ic = w.Intercom
  if (typeof ic === "function") {
    ic("reattach_activator")
    ic("update", w.intercomSettings)
    typeof cb === "function" && cb()
  } else {
    const d = document
    const i = function () {
      // eslint-disable-next-line prefer-rest-params
      i.c(arguments)
    }
    i.q = []
    i.c = function (args) {
      i.q.push(args)
    }
    w.Intercom = i
    const l = function () {
      const s = d.createElement("script")
      s.type = "text/javascript"
      s.async = true
      s.src = `https://widget.intercom.io/widget/${APP_ID}`
      s.onload = () => {
        typeof cb === "function" && cb()
      }
      const x = d.getElementsByTagName("script")[0]
      x.parentNode.insertBefore(s, x)
    }
    return l()
  }
}

export default class Intercom {
  static show() {
    window.Intercom && window.Intercom("show")
  }

  static changeVisibility(isVisible = true) {
    if (typeof window === "undefined") return
    if (window.innerWidth >= 768) return
    const intercomContainer = document.getElementById("intercom-container")
    const intercomContainerApp = document.querySelector(".intercom-lightweight-app") as HTMLElement
    if (intercomContainer) {
      intercomContainer.style.transition = "visibility 0.3s ease, opacity 0.3s ease"
      intercomContainer.style.visibility = isVisible ? "" : "hidden"
      intercomContainer.style.opacity = isVisible ? "" : "0"
    }
    if (intercomContainerApp) {
      intercomContainerApp.style.transition = "visibility 0.3s ease, opacity 0.3s ease"
      intercomContainerApp.style.visibility = isVisible ? "" : "hidden"
      intercomContainerApp.style.opacity = isVisible ? "" : "0"
    }
  }

  static update(data?: IntercomUserData) {
    window.Intercom && window.Intercom("update", data)
  }

  static shutdown() {
    window.Intercom && window.Intercom("shutdown")
  }

  static boot(data: IntercomUserData = {}) {
    window.Intercom &&
      window.Intercom("boot", {
        app_id: APP_ID,
        ...data,
      })
  }
}
