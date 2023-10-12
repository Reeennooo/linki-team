import Link from "next/link"
import { USER_TYPE_CUSTOMER } from "utils/constants"

interface Props {
  length: number
  icon?: boolean
  addClass?: string
  userType: number
}

const ProjectPlug: React.FC<Props> = ({ addClass, icon, length, userType }) => {
  const plugsArr = []
  let start = length === 3 ? length - 1 : length
  while (start >= 1) {
    plugsArr.push(start--)
  }
  return (
    <>
      {plugsArr.map((plug, i) => {
        return (
          <Link href={userType === USER_TYPE_CUSTOMER ? "/projects/create" : "/projects"} key={i}>
            <a className={`project-plug ${addClass ? addClass : ""}`}>
              {icon && <div className="project-plug__icon"></div>}
            </a>
          </Link>
        )
      })}
    </>
  )
}

export default ProjectPlug
