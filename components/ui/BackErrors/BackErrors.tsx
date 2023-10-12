import styles from "./BackErrors.module.scss"
import { useAppSelector } from "hooks"
import { selectUIState } from "redux/slices/uiSlice"
import { useEffect, useState } from "react"

interface Props {
  addClass?: string
}

const BackErrors: React.FC<Props> = ({ addClass }) => {
  const { backErrors } = useAppSelector(selectUIState)

  const renderErrors = () => {
    for (const key in backErrors) {
      if (typeof backErrors[key] === "string") {
        return <p>{backErrors[key]}</p>
      } else if (typeof backErrors[key] === "object") {
        return backErrors[key].map((err, i) => <p key={i}>{err}</p>)
      }
    }
  }

  return (
    <>{backErrors && <div className={`${styles["back-errors"]} ${addClass ? addClass : ""}`}>{renderErrors()}</div>}</>
  )
}

export default BackErrors
