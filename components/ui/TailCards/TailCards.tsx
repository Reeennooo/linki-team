import { useMemo } from "react"
import TailCard from "components/ui/TailCards/TailCard"

interface TailCardsProps {
  dataLength: number
  minLength?: number
  href?: string
  alwaysAdd?: boolean
  icon?: string
  onClick?: () => void
}

const TailCards: React.FC<TailCardsProps> = ({ dataLength, minLength = 4, href, alwaysAdd, icon, onClick }) => {
  return useMemo(() => {
    if (!dataLength && !alwaysAdd) return null
    const countNeeded = minLength - dataLength
    const additionalList = []
    if (countNeeded > 0) {
      for (let i = 0; i < countNeeded; i++) {
        additionalList.push(<TailCard key={i} href={href} icon={icon} onClick={onClick} />)
      }
    }
    return (
      <>
        {additionalList} {countNeeded <= 0 && alwaysAdd && <TailCard href={href} icon={icon} onClick={onClick} />}
      </>
    )
  }, [alwaysAdd, dataLength, minLength])
}

export default TailCards
