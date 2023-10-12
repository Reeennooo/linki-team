import { memo, useEffect, useRef, useState } from "react"
import styles from "./InputSearch.module.scss"
import SearchIcon from "public/assets/svg/search-icon.svg"
import { useOnClickOutside } from "../../../hooks/useOnClickOutside"
import IconClose from "public/assets/svg/close.svg"
import { kMaxLength } from "buffer"

interface Props {
  name?: string
  value?: string
  placeholder?: string
  addClass?: string
  onChange?(val: string): void
  isDrop?: boolean
  dropData?: any
  searchBy?: string
  onClick?(val: any): void
  onFocus?(val: any): void
  onClickBtnClose?: () => void
  error?: string
  limit?: number
}

const InputSearch: React.FC<Props> = ({
  placeholder = "Search...",
  value = "",
  name = "search",
  addClass,
  onChange,
  isDrop,
  dropData,
  searchBy,
  onClick,
  onFocus,
  onClickBtnClose,
  error,
  limit,
}) => {
  const [searchValue, setSearchValue] = useState(value)
  const [isSearchDropOpen, setSearchDropOpen] = useState(false)
  const [dropSearchValue, setDropSearchValue] = useState([])

  useEffect(() => {
    setSearchValue(value)
  }, [value])

  useEffect(() => {
    if (searchValue) {
      if (searchBy) {
        setDropSearchValue(
          dropData?.filter((i) => i[searchBy]?.name?.toLowerCase().includes(searchValue.toLowerCase()))
        )
      } else {
        setDropSearchValue(dropData?.filter((i) => i?.name?.toLowerCase().includes(searchValue.toLowerCase())))
      }
    } else {
      setDropSearchValue([])
    }
  }, [dropData, searchValue])

  const changeHandler = (value) => {
    setSearchValue(value)
    if (onChange) onChange(value)
    setSearchDropOpen(value.length > 0)
  }

  const dropDataList = dropSearchValue?.map((i, index) => {
    const item = searchBy ? i[searchBy] : i
    return (
      <li
        key={index}
        className={styles.search__li}
        onClick={() => {
          if (onClick) onClick(i)
        }}
      >
        <button
          type="button"
          className={styles["search__li-btn"]}
          onClick={() => {
            setSearchDropOpen(false)
            if (onChange) onChange(item.name)
            setSearchValue(item.name)
            setDropSearchValue([])
          }}
        >
          {item.name}
        </button>
      </li>
    )
  })
  const inputWrapRef = useRef()

  useOnClickOutside(inputWrapRef, (e) => {
    setSearchDropOpen(false)
  })

  return (
    <div
      ref={inputWrapRef}
      className={`input-search ${styles["search"]} ${addClass ? addClass : ""} ${
        searchValue?.length > 0 ? styles["is-active"] : ""
      }`}
    >
      <span
        className={`${styles["search__close"]} `}
        onClick={() => {
          changeHandler("")
          if (onClickBtnClose) onClickBtnClose()
        }}
      >
        <IconClose />
      </span>
      <input
        value={searchValue}
        type="text"
        name={name}
        onChange={(e) => changeHandler(e.target.value)}
        placeholder={placeholder}
        className={`${error ? styles["error"] : ""}`}
        onFocus={(e) => {
          if (onFocus) onFocus(e.target.value)
        }}
        maxLength={limit ? limit : 32767}
      />
      <SearchIcon className={`${styles["search__search-icon"]} svg-search-icon`} width={20} />
      {isDrop && dropSearchValue?.length > 0 && isSearchDropOpen && (
        <div className={styles.search__drop}>
          <ul className={styles["search__drop-inner"]}>{dropDataList}</ul>
        </div>
      )}
    </div>
  )
}

export default memo(InputSearch)
