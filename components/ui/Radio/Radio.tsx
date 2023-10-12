// import styles from "./Radio.module.scss"

interface Props {
  className?: string
  name: string
  value: string | number
  checked: boolean
  disabled?: boolean
  onChange?: any
  text?: string
  props?: any
  inRow?: boolean
}

const Radio: React.FC<Props> = ({ className, name, value, checked, disabled, onChange, text, inRow, ...props }) => {
  return (
    <div className={`radio ${className ?? ""} ${disabled ? "radio--disabled" : ""}`} {...props}>
      <label className="radio__label">
        <input
          hidden
          type="radio"
          name={name}
          value={value}
          checked={checked || false}
          disabled={disabled}
          onChange={(e) => {
            if (onChange && typeof onChange === "function") {
              onChange(e)
            }
          }}
        />
        {inRow === false && <span className="radio__custom" />}
        {text && <span className="radio__txt">{text}</span>}
      </label>
    </div>
  )
}

export default Radio
