import ReactPortal from "./ReactProtal"
import styles from "./Modal.module.scss"
import { ReactNode, useEffect, useRef, useState } from "react"
import { useOnClickOutside } from "hooks/useOnClickOutside"
import { LinkiLoader } from "components/ui/Loaders/Loaders"
import { useAppDispatch } from "hooks"
import { toggleDocumentScroll } from "redux/slices/uiSlice"
// import Intercom from "packages/intercom"

interface Props {
  isOpen: boolean
  // setIsOpen: (param: boolean) => void
  onClose: () => void
  name: string
  children?: ReactNode
  closeOutside?: (param: HTMLElement) => boolean
  header?: ReactNode
  footer?: ReactNode
  additionalInfo?: ReactNode
  isLoading?: boolean
  isFooterExist?: boolean
  addClass?: string
  fakeModal?: boolean
}

const Modal: React.FC<Props> = ({
  isOpen,
  // setIsOpen,
  onClose,
  name,
  children,
  closeOutside,
  header,
  footer,
  additionalInfo,
  isLoading,
  isFooterExist = true,
  addClass,
  fakeModal,
}) => {
  const [isModalExist, setModalExist] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalLoading, setModalLoading] = useState(false)
  const [scrollShadow, setScrollShadow] = useState("")
  const [scrollBody, setScrollBody] = useState("")
  const [scrollPos, setScrollPos] = useState(0)
  const mainInnerRef = useRef()

  const dispatch = useAppDispatch()

  function handleFilterScroll(inner) {
    if (!inner) return
    const currentScroll = inner.scrollTop
    const maxScroll = inner.scrollHeight - inner.clientHeight
    setScrollBody(currentScroll > 70 && currentScroll > scrollPos ? "down" : "up")
    setScrollPos(currentScroll)

    if (maxScroll === 0) {
      setScrollShadow("")
    } else if (currentScroll > 0 && currentScroll < maxScroll) {
      setScrollShadow(`${styles["main--shadow-top"]} ${styles["main--shadow-bottom"]}`)
    } else if (currentScroll < maxScroll) {
      setScrollShadow(`${styles["main--shadow-bottom"]}`)
    } else if (currentScroll <= maxScroll) {
      setScrollShadow(`${styles["main--shadow-top"]}`)
    }
  }
  useEffect(() => {
    handleFilterScroll(mainInnerRef.current)
  }, [])

  const modalRef = useRef()

  useEffect(() => {
    if (isOpen) {
      // Intercom.changeVisibility(false)
      dispatch(toggleDocumentScroll({ data: true, breakpoint: 768 }))
      setModalExist(true)
      setTimeout(() => {
        setScrollBody("")
        setModalOpen(true)
      }, 0)
    } else {
      // if (isModalExist) Intercom.changeVisibility(true)
      if (isModalExist) dispatch(toggleDocumentScroll({ data: false }))
      setModalOpen(false)
      setTimeout(() => {
        setModalExist(false)
      }, 200)
    }
  }, [isOpen])

  useEffect(() => {
    setModalLoading(isLoading)
  }, [isLoading])

  useOnClickOutside(modalRef, (e) => {
    if (fakeModal) return
    const target = e.target as HTMLElement
    if (closeOutside && !closeOutside(target)) return
    if (target.closest(".modal") || !isModalExist) return
    // Intercom.changeVisibility(true)
    setModalOpen(false)
    setTimeout(() => {
      setModalExist(false)
      // setIsOpen(false)
      dispatch(toggleDocumentScroll({ data: false }))
      onClose()
    }, 200)
  })

  const closeModal = () => {
    // Intercom.changeVisibility(true)
    setModalOpen(false)
    setTimeout(() => {
      setModalExist(false)
      dispatch(toggleDocumentScroll({ data: false }))
      onClose()
    }, 200)
  }

  const innerRef = useRef()
  const [isPointerDown, setPointerDown] = useState<boolean>(false)
  const [startTopPos, setStartTopPos] = useState<number>(0)
  const [isMoved, setMoved] = useState<boolean>(false)

  const handleDown = (e) => {
    if (window.innerWidth >= 768) return
    setPointerDown(true)
    const innerRefCurrent = innerRef.current as HTMLElement
    setStartTopPos(innerRefCurrent.offsetTop - e.clientY)
  }
  const handleUp = () => {
    setPointerDown(false)
    if (!isMoved) closeModal()
    setMoved(false)
  }
  const handleMove = (e) => {
    if (window.innerWidth >= 768 || !isPointerDown) return
    setMoved(true)
    const size = e.clientY + startTopPos
    if (size < 25 || size > window.innerHeight / 2) return
    const modalRefCurrent = modalRef.current as HTMLElement
    modalRefCurrent.style.paddingTop = size + "px"
  }

  if (!isModalExist) return null

  return (
    <ReactPortal portalID={name}>
      <div
        ref={modalRef}
        className={`modal ${styles.modal} ${isModalOpen ? styles["modal--is-active"] : ""} ${
          scrollBody === "down" ? styles["modal--scroll-down"] : ""
        } ${isModalLoading ? styles["modal--is-loading"] : ""} ${
          !isFooterExist || !footer ? styles["modal--no-footer"] : ""
        } ${addClass ? addClass : ""}`}
      >
        <div className={styles.modal__overlay} onClick={closeModal} />
        <div className={`modal__inner ${styles.modal__inner}`} ref={innerRef}>
          <button
            onPointerDown={handleDown}
            onPointerUp={handleUp}
            onPointerMove={handleMove}
            className={styles["modal__move-btn"]}
          />
          <div className={`modal__main ${styles.main} ${scrollShadow}`}>
            <div
              ref={mainInnerRef}
              className={`modal__main-inner ${styles.main__inner}`}
              onScroll={(e) => {
                handleFilterScroll(e.target)
              }}
            >
              {header && (
                <div className={`modal__header ${styles.header}`}>
                  {isModalLoading ? <div className={styles.header__loading} /> : header}
                </div>
              )}
              {additionalInfo && !isModalLoading && additionalInfo}
              <div className={`modal__body ${styles.body}`}>
                {isModalLoading ? (
                  <LinkiLoader />
                ) : (
                  <div className={`modal__body-inner ${styles.body__inner}`}>{children}</div>
                )}
              </div>
            </div>
          </div>
          {footer && isFooterExist && (
            <div className={`modal__footer ${styles.footer}`}>
              {isModalLoading ? <div className={styles.footer__loading} /> : footer}
            </div>
          )}
        </div>
      </div>
    </ReactPortal>
  )
}

export default Modal
