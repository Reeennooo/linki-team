import type { NextPage } from "next"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"

import CatalogTeamsDirection from "components/CatalogTeams/CatalogTeamsDirection/CatalogTeamsDirection"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, selectModals } from "redux/slices/modals"
import ModalPmTeam from "components/Modals/ModalPmTeam/ModalPmTeam"
import { useRouter } from "next/router"
import { useGetDirectionsQuery } from "redux/api/content"
import { useEffect, useState } from "react"

interface Props {
  teamToEditId: number
  initialData: any
}

const CatalogDirectionTeams: NextPage<Props> = ({ teamToEditId, initialData }) => {
  const { modalsList } = useAppSelector(selectModals)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: direction } = useGetDirectionsQuery()
  const [title, setTitle] = useState("")
  useEffect(() => {
    if (!direction?.length) return
    setTitle(direction.filter((dir) => dir.id === Number(router.query.id))[0].name)
  }, [direction])
  return (
    <>
      <PageHead
        title="Check out the tariffs on the linki platform"
        description="Get more from the linki platform: enhance your opportunities, receive priority support and earn more with us"
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader backBtn={true} title={`${title}`} />
        <PageLayoutContent child={<CatalogTeamsDirection />} />
      </PageLayoutWrapper>
      <ModalPmTeam
        isOpen={modalsList.includes("modal-pm-team")}
        onClose={() => {
          dispatch(closeModal("modal-pm-team"))
        }}
        headerUserClickable={false}
        modalName={"modal-pm-teamr"}
      />
    </>
  )
}

export default CatalogDirectionTeams

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
