import { useMemo } from "react"
import { deserializeHtml } from "../components/RichText/utils"
import { Descendant } from "slate"

interface Descriptions {
  [key: string]: Descendant[]
}

interface Props {
  valueRef: { current: Descriptions }
  projectID: number
  initText: string
}

const defaultInitialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
]

const isBrowser = typeof window !== "undefined"

const useValueForSlate = ({ valueRef, projectID, initText }: Props): Descendant[] => {
  return useMemo(() => {
    if (isBrowser) {
      const descriptions = localStorage.getItem("descriptions")
      const parsedDescriptions: Descriptions = descriptions ? JSON.parse(descriptions) : {}
      valueRef.current = parsedDescriptions

      if (!parsedDescriptions[projectID] && !initText) return defaultInitialValue

      const currentData: Descendant[] = parsedDescriptions[projectID]
        ? parsedDescriptions[projectID]
        : deserializeHtml(initText)

      return currentData.length ? currentData : defaultInitialValue
    } else {
      if (!initText) return defaultInitialValue

      const preparedData: Descendant[] = deserializeHtml(initText)
      return preparedData.length ? preparedData : defaultInitialValue
    }
  }, [initText, projectID, valueRef])
}

export default useValueForSlate
