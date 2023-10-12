import styles from "./ModalProjectCompleted.module.scss"
import React, { useEffect, useRef, useState } from "react"
import Modal from "components/ui/Modal/Modal"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"

interface IModalProjectCompletedProps {
  isOpen: boolean
  onClose: () => void
  modalName?: string
}

const defaultSecondRemain = 10

const ModalProjectCompleted: React.FC<IModalProjectCompletedProps> = ({
  isOpen,
  onClose,
  modalName = "modal-project-completed",
}) => {
  const [timerActive, setTimerActive] = useState<boolean>(true)
  const [secondRemain, setSecondRemain] = useState<number>(defaultSecondRemain)

  useEffect(() => {
    if (isOpen) {
      setTimerActive(true)
      setSecondRemain(defaultSecondRemain)
    }
  }, [isOpen])

  useEffect(() => {
    let interval = null
    if (isOpen) {
      if (timerActive) {
        interval = setInterval(() => {
          setSecondRemain((seconds) => seconds - 1)
        }, 1000)
        if (secondRemain <= 0) {
          clearInterval(interval)
          setTimerActive(false)
          onClose()
        }
      } else if (!timerActive && secondRemain !== 0) {
        clearInterval(interval)
      }
      return () => clearInterval(interval)
    }
  }, [isOpen, secondRemain, timerActive])

  const Confettiful = function (el) {
    this.el = el
    this.containerEl = null

    this.confettiFrequency = 3
    this.confettiColors = ["#fce18a", "#ff726d", "#b48def", "#f4306d"]
    this.confettiAnimations = ["slow", "medium", "fast"]

    this._setupElements()
    this._renderConfetti()
  }

  Confettiful.prototype._setupElements = function () {
    const containerEl = document.createElement("div")
    const elPosition = this.el.style.position
    // if (elPosition !== "relative" || elPosition !== "absolute") {
    //   this.el.style.position = "relative"
    // }
    containerEl.classList.add("confetti-container")

    this.el.appendChild(containerEl)

    this.containerEl = containerEl
  }

  Confettiful.prototype._renderConfetti = function () {
    this.confettiInterval = setInterval(() => {
      const confettiEl = document.createElement("div")
      const confettiSize = Math.floor(Math.random() * 3) + 7 + "px"
      const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)]
      const confettiLeft = Math.floor(Math.random() * this.el.offsetWidth) + "px"
      const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)]

      confettiEl.classList.add("confetti", "confetti--animation-" + confettiAnimation)
      confettiEl.style.left = confettiLeft
      confettiEl.style.width = confettiSize
      confettiEl.style.height = confettiSize
      confettiEl.style.backgroundColor = confettiBackground

      // @ts-ignore
      confettiEl.removeTimeout = setTimeout(function () {
        confettiEl.parentNode.removeChild(confettiEl)
      }, 3000)

      this.containerEl.appendChild(confettiEl)
    }, 25)
  }

  const contRef = useRef()
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        // @ts-ignore
        window.confettiful = new Confettiful(contRef.current)
      }, 300)
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={modalName}
      header={<DetailedPopupHeader title={"Congratulations!"} onClose={onClose} />}
      footer={
        <div className={styles.block__footer}>
          <p className={styles.block__remaining}>The window will close automatically in: {secondRemain} sec.</p>{" "}
          <DefaultBtn
            addClass={styles.block__btn}
            txt={"Completed projects"}
            mod={"transparent-grey"}
            onClick={() => {
              window.location.replace("/projects?tab=3")
            }}
          />
        </div>
      }
    >
      <div className={styles.block}>
        <div ref={contRef} className="js-container" />
        <h2 className={styles.block__title}>Project Completed</h2>
        <img className={styles.block__img} src={"/assets/completed.png"} alt={"completed"} />
      </div>
    </Modal>
  )
}

export default ModalProjectCompleted
