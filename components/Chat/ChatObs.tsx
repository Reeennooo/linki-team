import React, { Dispatch, SetStateAction, useEffect, useRef } from "react"
import styles from "components/Modals/ModalChat/ModalChat.module.scss"
import useIntersection from "hooks/useIntersection"

interface Props {
  modalName: string
  setIsIntersectionTopView: Dispatch<SetStateAction<boolean>>
  rootMargin?: string
}

const ChatObs: React.FC<Props> = ({ modalName, setIsIntersectionTopView, rootMargin = "92px 0px 98px 0px" }) => {
  const intersectionTopRef = useRef(null)
  const intersectionTop = useIntersection(intersectionTopRef, {
    root: null,
    rootMargin: rootMargin, // top, right, bottom, left
    threshold: 1.0,
  })

  const handleScroll = () => {
    if (intersectionTop && intersectionTop.intersectionRatio < 1) {
      // console.log("Obscured")
      setIsIntersectionTopView(false)
    } else {
      // console.log("Fully in view. Search")
      setIsIntersectionTopView(true)
    }
  }

  useEffect(() => {
    document?.querySelector(`#${modalName} .modal__main-inner`)?.addEventListener("scroll", handleScroll)
    return () => {
      document?.querySelector(`#${modalName} .modal__main-inner`)?.removeEventListener("scroll", handleScroll)
    }
  })

  return <div className={`modal__obs-top ${styles["modal__obs-top"]}`} ref={intersectionTopRef} />
}

export default ChatObs
