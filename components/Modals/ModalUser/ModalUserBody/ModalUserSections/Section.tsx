import React, { FC, memo, ReactNode } from "react"

interface ISectionProps {
  title: string
  children: ReactNode | ReactNode[]
}

const Section: FC<ISectionProps> = (props) => {
  const { title, children } = props

  return (
    <div className={`popup-body__section`}>
      <h3 className={"popup-body__section-title"}>{title}</h3>
      {children}
    </div>
  )
}

export default memo(Section)
