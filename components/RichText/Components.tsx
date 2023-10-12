import React, { Ref, PropsWithChildren } from "react"
import ReactDOM from "react-dom"
import styles from "./RichText.module.scss"

import IconTextBolder from "public/assets/svg/editor/TextBolder.svg"
import IconTextItalic from "public/assets/svg/editor/TextItalic.svg"
import IconTextUnderline from "public/assets/svg/editor/TextUnderline.svg"
import IconTextAlignLeft from "public/assets/svg/editor/TextAlignLeft.svg"
import IconTextAlignCenter from "public/assets/svg/editor/TextAlignCenter.svg"
import IconTextAlignRight from "public/assets/svg/editor/TextAlignRight.svg"
import IconTextAlignJustify from "public/assets/svg/editor/TextAlignJustify.svg"
import IconListNumbers from "public/assets/svg/editor/ListNumbers.svg"
import IconListBullets from "public/assets/svg/editor/ListBullets.svg"
import IconQuote from "public/assets/svg/editor/Quote.svg"
import IconLink from "public/assets/svg/editor/Link.svg"

interface BaseProps {
  className?: string
  [key: string]: unknown
}
type OrNull<T> = T | null

export const Button = React.forwardRef(
  (
    {
      className = "",
      active,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
        reversed?: boolean
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => {
    return (
      <span
        {...props}
        ref={ref}
        className={`${styles["editor-button"]} ${className} ${active ? styles["is-active"] : ""}`}
      >
        {props.children}
      </span>
    )
  }
)
Button.displayName = "EditorButton"

export const EditorValue = React.forwardRef(
  (
    {
      className = "",
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any
      } & BaseProps
    >,
    ref: Ref<OrNull<null>>
  ) => {
    const textLines = value.document.nodes
      .map((node) => node.text)
      .toArray()
      .join("\n")
    return (
      <div className={className} ref={ref} {...props}>
        <div>Slate&apos;s value as text</div>
        <div>{textLines}</div>
      </div>
    )
  }
)
EditorValue.displayName = "EditorValue"
const iconSelector = (icon) => {
  switch (icon) {
    case "format_bold":
      return <IconTextBolder />
    case "format_italic":
      return <IconTextItalic />
    case "format_underlined":
      return <IconTextUnderline />
    case "left":
      return <IconTextAlignLeft />
    case "center":
      return <IconTextAlignCenter />
    case "right":
      return <IconTextAlignRight />
    case "numbered-list":
      return <IconListNumbers />
    case "bulleted-list":
      return <IconListBullets />
    case "block-quote":
      return <IconQuote />
    case "link":
      return <IconLink />
    case "justify":
      return <IconTextAlignJustify />
    default:
      return <p>NONE</p>
  }
}
export const Icon = React.forwardRef(
  ({ className = "", ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => {
    return (
      <span className={className} {...props} ref={ref}>
        {iconSelector(props.children)}
      </span>
    )
  }
)
Icon.displayName = "EditorIcon"
export const Instruction = React.forwardRef(
  ({ className = "", ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <div className={className} {...props} ref={ref} />
  )
)
Instruction.displayName = "EditorInstruction"
export const Menu = React.forwardRef(
  ({ className = "", ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <div {...props} ref={ref} className={`${styles["editor-buttons"]} ${className}`} />
  )
)
Menu.displayName = "EditorMenu"

export const Portal = ({ children }) => {
  return typeof document === "object" ? ReactDOM.createPortal(children, document.body) : null
}

export const Toolbar = React.forwardRef(
  ({ className = "", ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <Menu className={className} {...props} ref={ref} />
  )
)
Toolbar.displayName = "EditorToolbar"
