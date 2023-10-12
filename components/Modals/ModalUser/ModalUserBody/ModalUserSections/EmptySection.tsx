import stylesModal from "../../../../ui/Modal/Modal.module.scss"
import React, { FC, memo } from "react"

interface IProps {
  title: string
}

const EmptySection: FC<IProps> = (props) => {
  const { title } = props

  return (
    <div className={stylesModal["modal-empty-section"]}>
      <h3 className={stylesModal["modal-empty-section__title"]}>{title}</h3>
      <p className={stylesModal["modal-empty-section__txt"]}>Not specified</p>
    </div>
  )
}
export default memo(EmptySection)
