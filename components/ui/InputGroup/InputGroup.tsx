import styles from "./InputGroup.module.scss"
import EyeClose from "public/assets/svg/EyeSlash.svg"
import EyeOPen from "public/assets/svg/Eye.svg"
import { useMemo, useState } from "react"
import NumberFormat from "react-number-format"

interface Props {
  placeholder: string
  type: string
  error?: string
  props?: any
  smClass?: boolean
  fieldProps: any
  addClass?: string
  inputPrefix?: string
  absError?: boolean
  textarea?: boolean
  editId?: string
  icon?: any
  allowEmptyFormatting?: boolean
}

const InputGroup: React.FC<Props> = ({
  placeholder,
  type,
  error,
  fieldProps,
  addClass,
  smClass,
  inputPrefix,
  absError,
  textarea,
  editId,
  icon,
  allowEmptyFormatting = true,
}) => {
  const [eyeOPen, setEyeOPen] = useState(false)

  return (
    <>
      <div
        className={`${styles["input-group"]} ${addClass ? addClass : ""} ${smClass ? styles["input-group_sm"] : ""}`}
      >
        {textarea && (
          <textarea
            type={type === "password" && eyeOPen ? "text" : type}
            autoComplete="false"
            className={`${error ? styles.error : ""} ${fieldProps.value ? styles["no-empty"] : ""}`}
            placeholder={placeholder}
            {...fieldProps}
            id={editId ? editId : null}
          />
        )}
        {type === "number" && (
          <NumberFormat
            autoComplete="false"
            className={`${error ? styles.error : ""} ${fieldProps.value ? styles["no-empty"] : ""}`}
            placeholder={placeholder}
            {...fieldProps}
            prefix={inputPrefix ?? ""}
            id={editId ? editId : null}
          />
        )}
        {type === "tel" && (
          <div>
            {icon ? icon : ""}
            <NumberFormat
              type="tel"
              {...fieldProps}
              format={
                fieldProps.value?.replace(/[^A-Za-zА-Яа-я0-9]/g, "").length > 11
                  ? fieldProps.value?.replace(/[^A-Za-zА-Яа-я0-9]/g, "").length > 12
                    ? "+### ### ### ####"
                    : "+## ### ### #####"
                  : "+# ### ### #####"
              }
              allowEmptyFormatting={allowEmptyFormatting}
              placeholder={placeholder}
              mask=" "
              data-min="11"
              className={`${error ? styles.error : ""} ${fieldProps.value ? styles["no-empty"] : ""}`}
            />
          </div>
        )}
        {!textarea && type !== "number" && type !== "tel" && (
          <input
            type={type === "password" && eyeOPen ? "text" : type}
            autoComplete="false"
            className={`${error ? styles.error : ""} ${fieldProps.value ? styles["no-empty"] : ""}`}
            placeholder={placeholder}
            {...fieldProps}
            id={editId ? editId : null}
          />
        )}

        {type === "password" && (
          <div
            className={`${styles["input-group__eye"]} ${fieldProps.value ? styles["is-active"] : ""} ${
              fieldProps.value.length < 1 ? styles.error : ""
            } `}
            onClick={() => {
              setEyeOPen(!eyeOPen)
            }}
          >
            {eyeOPen ? <EyeOPen className="svg-eye_open" /> : <EyeClose className="svg-eye_close" />}
          </div>
        )}
        {error && (
          <label className={`input-group__error ${styles["input-group__error"]} ${absError ? styles.abs : ""}`}>
            {error}
          </label>
        )}
      </div>
    </>
  )
}

export default InputGroup
