import stylesModal from "components/ui/Modal/Modal.module.scss"
import React from "react"

interface IModalUserEmptyProps {
  list: string[]
}

const ModalUserEmpty: React.FC<IModalUserEmptyProps> = ({ list }) => {
  const sections = list?.map((item, index) => {
    if (!item) return null
    return (
      <div key={index} className={stylesModal["modal-empty-section"]}>
        <h3 className={stylesModal["modal-empty-section__title"]}>{item}</h3>
        <p className={stylesModal["modal-empty-section__txt"]}>Not specified</p>
      </div>
    )
  })
  return <div>{sections}</div>
}

export default ModalUserEmpty
