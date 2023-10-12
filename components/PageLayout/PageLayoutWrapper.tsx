import { useAppSelector } from "hooks"
import { selectMenuCollapsed, selectWindowLoaded } from "redux/slices/uiSlice"
import AsideMenu from "components/AsideMenu/AsideMenu"
import ProfileSkeleton from "components/ProfileSkeleton/ProfileSkeleton"

const PageLayoutWrapper = ({ children }) => {
  const collapsed = useAppSelector(selectMenuCollapsed)
  const windowLoaded = useAppSelector(selectWindowLoaded)

  return (
    <>
      <div className={`page-layout ${collapsed ? "is-collapsed" : ""}`}>
        <AsideMenu addClass={"page-layout__aside"} />
        <div className={`page-layout__inner`}>{children}</div>
      </div>
      <ProfileSkeleton isActive={!windowLoaded} />
    </>
  )
}

export default PageLayoutWrapper
