import Link from "next/link"
interface Props {
  className?: string
  name: string
  value: string | number
  checked: boolean
  disabled?: boolean
  onChange?: any
  text?: string
  policy?: boolean
  props?: any
  error?: boolean
}

const Checkbox: React.FC<Props> = ({
  className,
  name,
  value,
  checked,
  disabled,
  onChange,
  text,
  policy,
  error,
  ...props
}) => {
  return (
    <div className={`checkbox ${className ?? ""} ${error ? "checkbox--error" : ""}`} {...props}>
      <label className="checkbox__label">
        <input
          hidden
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            if (onChange && typeof onChange === "function") {
              onChange(e)
            }
          }}
        />
        <span className="checkbox__custom">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.5 0C2.29086 0 0.5 1.79086 0.5 4V16C0.5 18.2091 2.29086 20 4.5 20H16.5C18.7091 20 20.5 18.2091 20.5 16V4C20.5 1.79086 18.7091 0 16.5 0H4.5ZM16.2584 6.65177C16.6184 6.2329 16.5706 5.60154 16.1518 5.24158C15.7329 4.88162 15.1015 4.92937 14.7416 5.34823L8.625 12.4657L6.25842 9.71187C5.89846 9.29301 5.2671 9.24526 4.84823 9.60522C4.42937 9.96518 4.38162 10.5965 4.74158 11.0154L7.86658 14.6518C8.05655 14.8728 8.33352 15 8.625 15C8.91648 15 9.19345 14.8728 9.38342 14.6518L16.2584 6.65177Z"
              fill="#6420FF"
            />
          </svg>
        </span>
        {text && !policy && <span className="checkbox__txt">{text}</span>}
        {policy && !text && (
          <span className="checkbox__txt">
            Yes, I understand and agree to the{" "}
            <a href="https://www.craft.do/s/xn75VwZHhPM9Az" rel="noreferrer" target="_blank">
              {" "}
              Terms of Service
            </a>
            {", including the"}
            <a href="https://www.craft.do/s/YzggdQ63ppjnU4" rel="noreferrer" target="_blank">
              {" "}
              User Agreement
            </a>
            {" and "}
            <a href="https://www.craft.do/s/vgyz5JXmLj77Ky" rel="noreferrer" target="_blank">
              Privacy Policy
            </a>
          </span>
        )}
      </label>
    </div>
  )
}

export default Checkbox
