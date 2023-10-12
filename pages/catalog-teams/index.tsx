import type { NextPage } from "next"
import Head from "next/head"
import PageHead from "components/PageHead"
import { wrapper } from "redux/store"
import { withAuthGSSP } from "hocs/withAuthGSSP"
import { PageLayoutContent, PageLayoutHeader, PageLayoutWrapper } from "components/PageLayout"
import CatalogTeamsSection from "components/CatalogTeams/CatalogTeamsSection/CatalogTeamsSection"
import ModalPmTeam from "components/Modals/ModalPmTeam/ModalPmTeam"
import { closeModal, selectModals } from "redux/slices/modals"
import { useAppDispatch, useAppSelector } from "hooks"
import dynamic from "next/dynamic"
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

const CatalogTeams: NextPage = () => {
  const { modalsList } = useAppSelector(selectModals)
  const dispatch = useAppDispatch()
  return (
    <>
      <PageHead
        title={"Teams on Linki"}
        description={
          "A marketplace of teams that are ready to bring your ideas and plans to life. Choose a team, describe your wishes for implementation of ideas and get a high-quality result from industry professionals"
        }
        noIndex={true}
      />
      <PageLayoutWrapper>
        <PageLayoutHeader title="Teams" />
        <PageLayoutContent mod={"no-top-padding"} child={<CatalogTeamsSection />} />
      </PageLayoutWrapper>
      <ReactTooltip id={"global-tooltip"} className={"custom-tooltip-theme2"} effect={"solid"} place={"bottom"} />
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

export default CatalogTeams

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  withAuthGSSP(store, async () => {
    return {
      props: {},
    }
  })
)
