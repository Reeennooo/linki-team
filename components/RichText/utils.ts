import parse from "html-dom-parser"
import { jsx } from "slate-hyperscript"
import { Text } from "slate"
import escapeHtml from "escape-html"

const deserializeReducer = (acc = [], node) => {
  const annotations =
    node.attribs &&
    node.attribs.class &&
    node.attribs.class.split(" ").reduce((classNames, className) => {
      const [, align] = /align-(left|center|right)/.exec(className) || []
      if (align) {
        return { ...classNames, align }
      }

      const [, indent] = /indent-(\d+)/.exec(className) || []
      if (indent) {
        return { ...classNames, indent: parseInt(indent, 10) }
      }

      const [, lineHeight] = /line-height-(.+)/.exec(className) || []
      if (lineHeight) {
        return { ...classNames, lineHeight: lineHeight.replace("_", ".") }
      }

      const [, fontSize] = /font-size-(\d+)/.exec(className) || []
      if (fontSize) {
        return { ...classNames, fontSize: parseInt(fontSize, 10) }
      }

      if (["bold", "italic", "underline"].includes(className)) {
        return { ...classNames, [className]: true }
      }

      return {
        ...classNames,
        annotations: {
          ...classNames.annotations,
          [className]: true,
        },
      }
    }, {})

  if (!node.name && node.type === "text") {
    return [...acc, { text: node.data.trim() }]
  }

  const children = node.children && node.children.length ? node.children.reduce(deserializeReducer, []) : [{ text: "" }]

  switch (node.name) {
    case "html":
    case "body":
    case "div":
      return [...acc, ...children]
    case "ol":
      return [
        ...acc,
        jsx(
          "element",
          { ...annotations, type: "numbered-list" },
          children.filter((child) => child.text !== "")
        ),
      ]
    case "ul":
      return [
        ...acc,
        jsx(
          "element",
          { ...annotations, type: "bulleted-list" },
          children.filter((child) => child.text !== "")
        ),
      ]
    case "li":
      return [...acc, jsx("element", { ...annotations, type: "list-item" }, children)]
    case "hr":
      return [...acc, jsx("element", { ...annotations, type: "hr" }, children)]
    case "a":
      return [...acc, jsx("element", { ...annotations, type: "link", url: node.attribs.href }, children)]
    case "span":
      return [
        ...acc,
        jsx(
          "fragment",
          { ...annotations },
          children.map((child) => ({ ...annotations, ...child }))
        ),
      ]
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "th":
    case "td":
    case "blockquote":
    case "p":
      return [...acc, jsx("element", { ...annotations, type: "paragraph" }, children)]
    default:
      return acc
  }
}

const deserializeHtml = (html = "") => {
  const nodes = parse(html.replace(/\r?\n|\r/g, ""))
  const deserializedHtml = nodes.reduce(deserializeReducer, [])

  const patchDeserializedHtml = deserializedHtml.reduce((acc, node) => {
    // Remove empty text nodes.
    if (!node.type && node.text && !node.text.trim()) {
      return acc
    }

    // Handle span tags outside of paragraphs.
    if (Array.isArray(node)) {
      // eslint-disable-next-line prefer-destructuring, no-param-reassign
      node = node[0]
    }

    // Handle text outside of paragraphs.
    if (!node.type && typeof node.text !== "undefined") {
      const lastNode = acc[acc.length - 1]
      // Combine node with previous, patched paragraph.
      if (lastNode && lastNode.type === "paragraph" && lastNode.isPatch) {
        return [
          ...acc.slice(0, -1),
          {
            ...lastNode,
            children: [...lastNode.children, node],
          },
        ]
      }

      // Create a new patch node by placing it in a paragraph.
      return [...acc, { type: "paragraph", isPatch: true, children: [node] }]
    }

    return [...acc, node]
  }, [])

  return patchDeserializedHtml
}

const serializeReducer = (acc = [], node) => {
  const className = Object.entries(node).reduce((classNames, [prop, value]) => {
    switch (prop) {
      case "align":
        return [...classNames, `align-${value}`]
      case "indent":
        return [...classNames, `indent-${value}`]
      case "lineHeight":
        return [...classNames, `line-height-${String(value).replace(".", "_")}`]
      case "fontSize":
        return [...classNames, `font-size-${value}`]
      case "bold":
      case "italic":
      case "underline":
        return [...classNames, prop]
      default:
        return classNames
    }
  }, [])

  const classAttribute = className.length ? ` class="${className.join(" ")}"` : ""

  if (Text.isText(node)) {
    return classAttribute
      ? `${acc}<span${classAttribute}>${escapeHtml(node.text)}</span>`
      : `${acc}${escapeHtml(node.text)}`
  }

  const children = node.children.reduce(serializeReducer, "")

  switch (node.type) {
    case "bulleted-list":
      return `${acc}<ul${classAttribute}>${children}</ul>`
    case "numbered-list":
      return `${acc}<ol${classAttribute}>${children}</ol>`
    case "list-item":
      return `${acc}<li${classAttribute}>${children}</li>`
    case "hr":
      return `${acc}<hr />`
    case "paragraph":
      return `${acc}<p${classAttribute}>${children}</p>`
    case "block-quote":
      return `${acc}<blockquote${classAttribute}>${children}</blockquote>`
    case "link":
      return `${acc}<a href="${escapeHtml(node.url)}"${classAttribute}>${children}</a>`
    default:
      return `${acc}${children}`
  }
}

const serializeHtml = (nodes) => {
  const serializedHtml = nodes.reduce(serializeReducer, "")
  // return `<html><body>${serializedHtml}</body></html>`
  return serializedHtml
}

export { deserializeHtml, serializeHtml }
