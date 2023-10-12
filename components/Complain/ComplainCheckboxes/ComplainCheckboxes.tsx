import { Dispatch, SetStateAction } from "react"
import Checkbox from "components/ui/Checkbox/Checkbox"
import styles from "./ComplainCheckboxes.module.scss"

interface ComplainCheckboxesProps {
  complainValue: string[]
  setComplainValue: Dispatch<SetStateAction<string[]>>
}

const ComplainCheckboxes: React.FC<ComplainCheckboxesProps> = ({ complainValue, setComplainValue }) => {
  const checkboxesListData = [
    { id: 1, value: "Spam" },
    { id: 2, value: "Sale of illegal goods" },
    { id: 3, value: "Fraud or deception" },
    { id: 4, value: "Materials for adults 18+" },
    { id: 5, value: "Fake information" },
    { id: 6, value: "Violence and hostility" },
  ]
  return (
    <div className={styles.list}>
      {checkboxesListData.map((item) => {
        return (
          <Checkbox
            key={item.id}
            name={item.value}
            value={item.value}
            checked={complainValue.includes(item.value)}
            text={item.value}
            onChange={(e) => {
              setComplainValue((prevState) => {
                return e.target.checked ? [...prevState, item.value] : prevState.filter((i) => i !== item.value)
              })
            }}
          />
        )
      })}
    </div>
  )
}

export default ComplainCheckboxes
