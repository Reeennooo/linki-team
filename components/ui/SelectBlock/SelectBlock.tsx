import { components } from "react-select"
import { useState } from "react"
import dynamic from "next/dynamic"

const Select = dynamic(() => import("react-select"), {
  ssr: false,
})

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      {props.selectProps.size === "lg" ? (
        <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.04289 0.792893C1.43342 0.402369 2.06658 0.402369 2.45711 0.792893L8 6.33579L13.5429 0.792893C13.9334 0.402369 14.5666 0.402369 14.9571 0.792893C15.3476 1.18342 15.3476 1.81658 14.9571 2.20711L8.70711 8.45711C8.31658 8.84763 7.68342 8.84763 7.29289 8.45711L1.04289 2.20711C0.652369 1.81658 0.652369 1.18342 1.04289 0.792893Z"
          />
        </svg>
      ) : (
        <svg width="10" height="6" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.396447 0.146447C0.591709 -0.0488155 0.908291 -0.0488155 1.10355 0.146447L7 6.04289L12.8964 0.146447C13.0917 -0.0488155 13.4083 -0.0488155 13.6036 0.146447C13.7988 0.341709 13.7988 0.658291 13.6036 0.853553L7.35355 7.10355C7.15829 7.29882 6.84171 7.29882 6.64645 7.10355L0.396447 0.853553C0.201184 0.658291 0.201184 0.341709 0.396447 0.146447Z"
          ></path>
        </svg>
      )}
    </components.DropdownIndicator>
  )
}
interface IselectOPtions {
  value: string | number
  label: string
  specialization_id?: string | number
}

interface Props {
  props?: any
  readOnly?: boolean
  addClass?: string
  onMenuOpen?: any
  onBlur?: any
  onMenuClose?: any
  onChange?: any
  options: IselectOPtions[]
  isMulti?: boolean
  placeholder?: string
  dataPlaceholder?: string
  value?: object[]
  size?: "lg" | "md"
  editId?: string
}

const SelectBlock: React.FC<Props> = ({
  readOnly,
  onMenuOpen,
  onBlur,
  onMenuClose,
  onChange,
  options,
  addClass,
  isMulti,
  placeholder,
  dataPlaceholder,
  value,
  size = "md",
  editId,
  ...props
}) => {
  const [openSelect, setOpenSelect] = useState(false)
  const [isAnim, setIsAnim] = useState(false)
  const openCloseSelect = (bol) => {
    if (bol) {
      setOpenSelect(bol)
      setTimeout(() => {
        setIsAnim(true)
      }, 0)
    } else {
      setIsAnim(false)
      setTimeout(() => {
        setOpenSelect(bol)
      }, 200)
    }
  }

  return (
    <>
      <Select
        id={editId ? editId : ""}
        blurInputOnSelect={true}
        isSearchable={false}
        // defaultValue={props.options[1]}
        {...props}
        className={`react-select ${isAnim ? "is-anim" : ""}  ${addClass ?? ""} ${readOnly ? " readOnly" : ""} ${
          size !== "md" ? "react-select--" + size : ""
        } ${value?.length > 0 ? "react-select--not-empty" : ""}`}
        placeholder={placeholder}
        options={options}
        isMulti={isMulti}
        classNamePrefix="react-select"
        menuIsOpen={openSelect}
        openMenuOnClick={!readOnly}
        onBlur={() => {
          openCloseSelect(false)
          if (onBlur && typeof onBlur === "function") {
            onBlur()
          }
        }}
        value={value}
        onMenuOpen={() => {
          openCloseSelect(true)
          if (onMenuOpen && typeof onMenuOpen === "function") {
            onMenuOpen()
          }
        }}
        onMenuClose={() => {
          openCloseSelect(false)
          if (onMenuClose && typeof onMenuClose === "function") {
            onMenuClose()
          }
        }}
        onChange={(val) => {
          if (onChange && typeof onChange === "function") {
            onChange(val)
          }
        }}
        components={{
          DropdownIndicator,
        }}
      />
    </>
  )
}

export default SelectBlock
