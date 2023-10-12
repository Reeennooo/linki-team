import { CSSProperties, useCallback, useMemo, useRef, useState } from "react"
import isHotkey from "is-hotkey"
import { Editable, withReact, useSlate, Slate, useSelected } from "slate-react"
import { Editor, Range, Transforms, createEditor, Element as SlateElement } from "slate"
import { withHistory } from "slate-history"
import { Button, Icon, Toolbar } from "./Components"
import styles from "./RichText.module.scss"
import isUrl from "is-url"
import { serializeHtml } from "./utils"
import { LinkElement } from "./custom-types"
import useValueForSlate from "../../hooks/useValueForSlate"
import { valueToLocalStorage } from "../../utils/valueToLocalStorage"

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
}

const LIST_TYPES = ["numbered-list", "bulleted-list"]
const TEXT_ALIGN_TYPES = ["left", "right", "justify", "center"]

interface Props {
  setDescriptionValue: (param: string) => void
  addClass?: string
  initText?: string | null
  mod?: "sm"
  error?: boolean
  projectID?: number
  modalType?: string
  noAutofocus?: boolean
  editId?: string
}

const RichText: React.FC<Props> = ({
  setDescriptionValue,
  mod,
  addClass,
  initText,
  error,
  projectID,
  modalType,
  noAutofocus,
  editId,
}) => {
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(() => withInlines(withHistory(withReact(createEditor()))), [])
  const valueRef = useRef({})
  const initialValue = useValueForSlate({ valueRef, projectID, initText })
  const [isFocused, setFocused] = useState(false)

  const insertCursorAtEnd = useCallback(() => {
    setFocused(true)
    Transforms.select(editor, Editor.end(editor, []))
  }, [editor, noAutofocus, setFocused])

  const handleBlur = useCallback(() => {
    setFocused(false)
  }, [setFocused])

  return (
    <div
      className={[
        styles["editor-wrp"],
        addClass,
        error && styles["error"],
        mod && styles["editor-wrp--" + mod],
        isFocused && styles["focused"],
      ]
        .filter(Boolean)
        .join(" ")}
      id={editId ? editId : null}
    >
      <Slate
        editor={editor}
        value={initialValue}
        onChange={(v) => {
          setDescriptionValue(serializeHtml(v))

          if (["pm at work"].includes(modalType)) {
            valueToLocalStorage({ valueRef, editor, projectID, v })
          }
        }}
      >
        <Toolbar>
          <div className={`${styles["editor-font"]}`}>
            <MarkButton format="bold" icon="format_bold" />
            <MarkButton format="italic" icon="format_italic" />
            <MarkButton format="underline" icon="format_underlined" />
          </div>
          <div className={`${styles["editor-align"]}`}>
            {TEXT_ALIGN_TYPES.map((el, i) => {
              return <BlockButton key={i} format={el} />
            })}
          </div>
          <div className={`${styles["editor-lists"]}`}>
            {LIST_TYPES.map((el, i) => {
              return <BlockButton key={i} format={el} />
            })}
          </div>
          <div className={styles["editor-link"]}>
            <AddLinkButton />
          </div>
          <div className={styles["editor-quote"]}>
            <BlockButton format="block-quote" />
          </div>
          <div className={`${styles["editor-history"]}`}>
            <button
              className={`${styles["editor-history__btn"]}`}
              onClick={() => {
                editor.undo()
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.625 9.5625L2.25 6.1875L5.625 2.8125" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M5.625 14.0625H11.8125C12.8568 14.0625 13.8583 13.6477 14.5967 12.9092C15.3352 12.1708 15.75 11.1693 15.75 10.125V10.125C15.75 9.60791 15.6482 9.0959 15.4503 8.61818C15.2524 8.14046 14.9624 7.70639 14.5967 7.34076C14.2311 6.97513 13.797 6.6851 13.3193 6.48722C12.8416 6.28935 12.3296 6.1875 11.8125 6.1875H2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={`${styles["editor-history__btn"]}`}
              onClick={() => {
                editor.redo()
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.375 9.5625L15.75 6.1875L12.375 2.8125" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M12.375 14.0625H6.1875C5.14321 14.0625 4.14169 13.6477 3.40327 12.9092C2.66484 12.1708 2.25 11.1693 2.25 10.125V10.125C2.25 9.60791 2.35185 9.0959 2.54972 8.61818C2.7476 8.14046 3.03763 7.70639 3.40326 7.34076C3.76889 6.97513 4.20296 6.6851 4.68068 6.48722C5.1584 6.28935 5.67041 6.1875 6.18749 6.1875H15.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </Toolbar>
        <Editable
          className={`${styles["editor-field"]}`}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Description"
          spellCheck
          onFocus={insertCursorAtEnd}
          onBlur={handleBlur}
          autoFocus={noAutofocus ? false : true}
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type")
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor
  if (!selection) return false
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    })
  )
  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    case "link":
      return (
        <LinkComponent attributes={attributes} element={element}>
          {children}
        </LinkComponent>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  const styles: CSSProperties = {}
  if (leaf.text === "") {
    styles.paddingLeft = "0.1px"
  }

  return (
    <span {...attributes} style={styles}>
      {children}
    </span>
  )
}

const BlockButton = ({ format }) => {
  const editor = useSlate()

  return (
    <Button
      active={isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type")}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{format}</Icon>
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const withInlines = (editor) => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = (element) => ["link", "button"].includes(element.type) || isInline(element)

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = (data) => {
    const text = data.getData("text/plain")

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }
  return editor
}

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
}

const isLinkActive = (editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  })
  return !!link
}

const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  })
}

const wrapLink = (editor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)

  const link: LinkElement = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: "end" })
  }
}

const InlineChromiumBugfix = () => (
  <span contentEditable={false} style={{ fontSize: 0 }}>
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
)

const LinkComponent = ({ attributes, element, ...props }) => {
  const selected = useSelected()
  const styles: CSSProperties = {}
  if (selected) {
    styles.boxShadow = "0 0 0 3px #ddd"
  }
  return (
    <a {...attributes} style={styles} href={element.url}>
      <InlineChromiumBugfix />
      {props.children}
      <InlineChromiumBugfix />
    </a>
  )
}

const AddLinkButton = () => {
  const editor = useSlate()
  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event) => {
        event.preventDefault()
        const url = window.prompt("Enter the URL of the link:")
        if (!url) return
        insertLink(editor, url)
      }}
    >
      <Icon>{"link"}</Icon>
    </Button>
  )
}

export default RichText
