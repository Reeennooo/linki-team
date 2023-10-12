import React from "react"

interface Props {
  addClass?: string
  props?: any
}

const PaymentLayout: React.FC<Props> = ({ addClass, ...props }) => {
  return <div className={`${addClass ? addClass : ""}`}>PaymentLayout</div>
}

export default PaymentLayout
