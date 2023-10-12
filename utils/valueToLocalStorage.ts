import { Descendant } from "slate"

interface Descriptions {
  [key: string]: Descendant[]
}

interface Props {
  valueRef: React.MutableRefObject<Descriptions>
  editor: any
  projectID: number
  v: Descendant[]
}

export const valueToLocalStorage = (args: Props) => {
  const { valueRef, editor, projectID, v } = args
  const isAstChange = editor.operations.some((op) => "set_selection" !== op.type)

  if (isAstChange) {
    valueRef.current = { ...valueRef.current, [projectID.toString()]: v }
    const preparedToSendData = JSON.stringify(valueRef.current)
    localStorage.setItem("descriptions", preparedToSendData)
  }
}
