import Modal from "components/ui/Modal/Modal"
import stylesmodalonboarding from "./ModalOnboarding.module.scss"
import styles from "components/ui/Modal/Modal.module.scss"
import React, { memo, useEffect, useState } from "react"
import DetailedPopupHeader from "components/DetailedPopup/DetailedPopupHeader/DetailedPopupHeader"
import IcontitleAndTags from "components/IcontitleAndTags/IcontitleAndTags"
import DetailedPopupDetails from "components/DetailedPopup/DetailedPopupDetails/DetailedPopupDetails"
import DetailedPopupPortfolio from "components/DetailedPopup/DetailedPopupPortfolio/DetailedPopupPortfolio"
import DetailedPopupLangList from "components/DetailedPopup/DetailedPopupLangList/DetailedPopupLangList"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import DetailedPopupSpecList from "components/DetailedPopup/DetailedPopupSpecList/DetailedPopupSpecList"
import DetailedTotalDaysAndSum from "components/DetailedPopup/DetailedTotalDaysAndSum/DetailedTotalDaysAndSum"
import DetailedPopupProject from "components/DetailedPopup/DetailedPopupProject/DetailedPopupProject"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import DetailedPopupName from "components/DetailedPopup/DetailedPopupName/DetailedPopupName"
import DetailedPopupCategory from "components/DetailedPopup/DetailedPopupCategory/DetailedPopupCategory"
import DetailedPopupFiles from "components/DetailedPopup/DetailedPopupFiles/DetailedPopupFiles"
import Complain from "components/Complain/Complain"
import DetailedPopupGrade from "components/DetailedPopup/DetailedPopupGrade/DetailedPopupGrade"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"
import DetailedPopupCalculate from "components/DetailedPopup/DetailedPopupCalculate/DetailedPopupCalculate"
import RichText from "components/RichText/RichText"
import ExpertCard from "components/ExpertCard/ExpertCard"
import AddUserButton from "components/ui/btns/AddUserButton/AddUserButton"
import DetailedPopupTotal from "components/DetailedPopup/DetailedPopupTotal/DetailedPopupTotal"
import PersonCard from "components/PersonCard/PersonCard"

interface Props {
  isOpen: boolean
  onClose: () => void
  modalName?: string
  closeOutside?: (param: HTMLElement) => boolean
  isFooterExist?: boolean
  modalContent?: string
}

const ModalOnboarding: React.FC<Props> = ({
  isOpen,
  onClose,
  modalName = "modal-onboarding",
  closeOutside,
  isFooterExist = true,
  modalContent,
}) => {
  const closeModalOnboarding = () => {
    return false
  }
  const [offerData, setOfferData] = useState(null)

  return (
    <>
      <Modal
        fakeModal={true}
        addClass={`tour-mp-fake-modal ${stylesmodalonboarding["onboarding-modal"]} ${
          isOpen ? stylesmodalonboarding["is-open"] : ""
        }`}
        isOpen={true}
        onClose={() => {
          console.log("close 2")
        }}
        isLoading={false}
        name={modalName}
        closeOutside={closeOutside}
        isFooterExist={true}
        header={
          modalContent === "evaluate" ||
          modalContent === "pm-creates-offer" ||
          modalContent === "pm-creates-offer-deskr" ? (
            <DetailedPopupHeader
              title={modalContent === "evaluate" ? "Evaluate the work on the project" : "Create an offer"}
              onClose={closeModalOnboarding}
              headerUserClickable={false}
              id={1}
            />
          ) : (
            <DetailedPopupHeader
              name={`Ivan Teremov`}
              img={"/img/onboarding/7.jpg"}
              rating={4.5}
              onClose={closeModalOnboarding}
              headerUserClickable={false}
              id={1}
            />
          )
        }
        additionalInfo={
          <>
            {(modalContent === "wiew-project-card" || modalContent === "wiew-expert-project-card") && (
              <DetailedPopupProject
                data={{
                  start: "25.05.2022",
                  days: 265,
                  progress: true,
                  sum: 15555,
                }}
              />
            )}
            {modalContent === "wiew-vacancy-card" && (
              <DetailedPopupProject
                data={{
                  salary: 130,
                  hours: 119,
                }}
              />
            )}
            {modalContent === "pm-wiews-project-at-work" && (
              <DetailedPopupProject
                data={{
                  start: "25.05.2022",
                  days: 265,
                  sum: 15555,
                }}
              />
            )}

            {(modalContent === "pm-project-info" || modalContent === "pm-project-done") && (
              <DetailedPopupProject
                data={{
                  start: "25.05.2022",
                  days: 265,
                  sum: 15555,
                  progress: true,
                }}
              />
            )}
          </>
        }
        footer={
          isFooterExist ? (
            <>
              {(modalContent === "pm" || modalContent === "pm-offer" || modalContent === "pm-wiews-project") && (
                <div className={styles["footer__nav-btns"]}>
                  <button type="button" className={styles.arr} disabled={true}>
                    <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 20.9998L1 10.9998L11 0.999756" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button type="button" className={`${styles.arr} ${styles["arr--right"]}`} disabled={false}>
                    <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 0.999756L11 10.9998L1 20.9998" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
              {modalContent === "pm" && (
                <div className={`${styles["footer__btns--alone"]}`}>
                  <DefaultBtn txt={"Under consideration"} />
                </div>
              )}
              {modalContent === "pm-offer" && (
                <div className={`${styles["footer__btns--alone"]}`}>
                  <DefaultBtn txt={"Ready for work"} />
                </div>
              )}
              {(modalContent === "wiew-project-card" || modalContent === "pm-wiews-project") && (
                <div className={`${styles.footer__btns} ${styles["footer__btns--wide"]}`}>
                  <Complain orderID={1} />
                  <DefaultBtn
                    txt={modalContent === "pm-wiews-project" ? "Respond" : "Finish"}
                    disabled={false}
                    onClick={() => false}
                  />
                </div>
              )}
              {modalContent === "evaluate" && (
                <div className={`${styles.footer__btns} ${styles["footer__btns"]}`}>
                  <DefaultBtn txt={"Submit"} disabled={true} onClick={() => false} />
                </div>
              )}
              {modalContent === "pm-wiews-project-at-work" && (
                <div className={`${styles.footer__btns} ${styles["footer__btns"]}`}>
                  <DefaultBtn txt={"Save"} disabled={true} onClick={() => false} />
                </div>
              )}
              {(modalContent === "pm-creates-offer" ||
                modalContent === "pm-creates-offer-deskr" ||
                modalContent === "pm-creates-offer-search-expert" ||
                modalContent === "pm-creates-offer-open-expert-card" ||
                modalContent === "pm-creates-offer-open-expert-card-total") && (
                <div className={`${styles.footer__btns} ${styles["footer__btns"]}`}>
                  <DefaultBtn txt={"Send an offer"} disabled={true} onClick={() => false} />
                </div>
              )}
              {(modalContent === "wiew-vacancy-card" || modalContent === "pm-wiews-project-at-work-candidate") && (
                <>
                  <div className={styles["footer__nav-btns"]}>
                    <button type="button" className={styles.arr} disabled={true}>
                      <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 20.9998L1 10.9998L11 0.999756" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button type="button" className={`${styles.arr} ${styles["arr--right"]}`} disabled={false}>
                      <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 0.999756L11 10.9998L1 20.9998" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <div className={`${styles.footer__btns} ${styles["footer__btns"]}`}>
                    <Complain orderID={0} isCheckboxes />

                    <IconBtn
                      icon={"archive"}
                      width={18}
                      height={18}
                      onClick={() => {
                        return false
                      }}
                    />
                    <DefaultBtn
                      txt={"Ready for work"}
                      addClass={styles["footer__btn-ready"]}
                      onClick={() => {
                        console.log("fake modal")
                      }}
                    />
                  </div>
                </>
              )}
              {(modalContent === "wiew-expert-project-card" || modalContent === "pm-project-done") && (
                <>
                  <div className={`${styles.footer__btns} ${styles["footer__btns--wide"]}`}>
                    <Complain
                      isCheckboxes
                      title={"Complain about the project"}
                      subtitle={"Why do you want to complain about this project?"}
                      orderID={1}
                    />
                    <DefaultBtn
                      txt={"Team Chat"}
                      href={"https://asdasdasd"}
                      addClass={styles["footer__btn-team-chat"]}
                      isTargetBlank
                      mod={"transparent-grey"}
                      icon={"chat"}
                      disabled={false}
                    />
                    <DefaultBtn txt={"Finish project"} addClass={styles["footer__btn-finish"]} onClick={() => false} />
                  </div>
                </>
              )}
              {modalContent === "pm-project-info" && (
                <div className={`${styles.footer__btns} ${styles["footer__btns"]}`}>
                  <DefaultBtn
                    txt={"Team Chat"}
                    href={"https://asdasdasd"}
                    addClass={styles["footer__btn-team-chat"]}
                    isTargetBlank
                    mod={"transparent-grey"}
                    icon={"chat"}
                    disabled={false}
                  />
                </div>
              )}
            </>
          ) : (
            ""
          )
        }
      >
        {modalContent === "pm" && (
          <>
            <IcontitleAndTags
              addClass="iat popup-body__section"
              title={"Startups"}
              tags={[
                { id: 1, name: "test" },
                { id: 2, name: "test2" },
                { id: 3, name: "test2" },
                { id: 4, name: "test2" },
                { id: 5, name: "test2" },
              ]}
              iconId={4}
            />
            <DetailedPopupDetails defOpen={true} addClass="popup-body__section" description={""} />
            <DetailedPopupPortfolio
              addClass="popup-body__section"
              portfolio={[
                {
                  id: 1,
                  description: "Project managerLeo August Branding — Saint Petersburg, Russian Federation",
                  image_url: "/img/onboarding/7.jpg",
                  url: "LinkedIn",
                },
              ]}
            />
            <div className={`popup-body__section`}>
              <h3 className={"popup-body__section-title"}>Languages</h3>
              <DetailedPopupLangList
                langList={[
                  { code: "test", id: 1, name: "English" },
                  { code: "test", id: 2, name: "Spanish" },
                  { code: "test", id: 3, name: "Deutsch" },
                ]}
              />
            </div>
            <div className={`popup-body__section`}>
              <h3 className={"popup-body__section-title"}>Timezone</h3>
              <p className={"popup-body__p"}>Asia/Barnaul</p>
            </div>
          </>
        )}

        {modalContent === "pm-offer" && (
          <>
            <DetailedPopupDetails
              defOpen={true}
              addClass="popup-body__section"
              description={""}
              addTitle={"Description of the end result"}
            />
            <DetailedPopupSpecList
              specList={[
                {
                  hours: 12,
                  id: 1,
                  job_role: "Middle UX/UI Designer",
                  salary_per_hour: 12,
                  user: null,
                  area_expertise_id: 1,
                  job_role_id: 1,
                },
                {
                  hours: 12,
                  id: 2,
                  job_role: "Project Manager Salary",
                  salary_per_hour: 12,
                  user: null,
                  area_expertise_id: 1,
                  job_role_id: 1,
                },
                {
                  hours: 12,
                  id: 3,
                  job_role: "Voice artists",
                  salary_per_hour: 12,
                  user: null,
                  area_expertise_id: 1,
                  job_role_id: 1,
                },
                {
                  hours: 12,
                  id: 4,
                  job_role: "Senior UX/UI Designer",
                  salary_per_hour: 12,
                  user: null,
                  area_expertise_id: 1,
                  job_role_id: 1,
                },
                {
                  hours: 12,
                  id: 5,
                  job_role: "Backend Developer",
                  salary_per_hour: 12,
                  user: null,
                  area_expertise_id: 1,
                  job_role_id: 1,
                },
                {
                  hours: 12,
                  id: 6,
                  job_role: "Frontend Developer",
                  salary_per_hour: 12,
                  user: null,
                  area_expertise_id: 1,
                  job_role_id: 1,
                },
                {
                  hours: 12,
                  id: 7,
                  job_role: "QA",
                  salary_per_hour: 12,
                  user: null,
                  area_expertise_id: 1,
                  job_role_id: 1,
                },
              ]}
            />
            <DetailedTotalDaysAndSum addClass={"popup-body__section"} sum={12600} days={36} />
          </>
        )}

        {(modalContent === "wiew-project-card" ||
          modalContent === "wiew-expert-project-card" ||
          modalContent === "pm-wiews-project" ||
          modalContent === "pm-project-done") && (
          <>
            {modalContent !== "pm-wiews-project" && modalContent === "wiew-project-card" && (
              <TabsLinear
                list={[
                  { id: 1, txt: "Project Information" },
                  { id: 2, txt: "Cooperation offer" },
                  { id: 3, txt: "Technical task" },
                ]}
                activeId={1}
                onClick={() => false}
              />
            )}
            {modalContent !== "pm-wiews-project" && modalContent === "wiew-expert-project-card" && (
              <TabsLinear
                list={[
                  { id: 1, txt: "Project Information" },
                  { id: 2, txt: "Technical task" },
                  { id: 3, txt: "Project team" },
                ]}
                activeId={1}
                onClick={() => false}
              />
            )}
            {modalContent === "pm-project-done" && (
              <TabsLinear
                list={[
                  { id: 1, txt: "Project Information" },
                  { id: 2, txt: "Technical task" },
                  { id: 3, txt: "Team & Budget" },
                ]}
                activeId={1}
                onClick={() => false}
              />
            )}
            <DetailedPopupName
              addClass="popup-body__section"
              name={"Create a milk site"}
              cover={"/assets/covers/1-min.jpg"}
            />
            <DetailedPopupDetails
              defOpen={true}
              addClass="popup-body__section"
              description={
                modalContent === "pm-wiews-project"
                  ? "I ask the children to forgive me for dedicating this book to an adult. I'll justify it: this adult is my best friend. And one more thing: he understands everything in the world, even children's books. And finally, he lives in France, and there is now hungry and cold. And he really needs comfort. If all this does not justify me, I will dedicate my book to the boy that my adult friend once was. After all, all adults were children at first, only few of them remember this. So I fix the dedication: When I was six years old, in a book called 'True Storie', which told about virgin forests, I once saw an amazing picture. In the picture, a huge snake - a boa constrictor - was swallowing a predatory beast. Here's how it was drawn: And finally, he lives in France, and there is now hungry and cold. And he really needs comfort. If all this does not justify me, I will dedicate my book to the boy that my adult friend once was. "
                  : ""
              }
            />
            <DetailedPopupCategory
              addClass="popup-body__section"
              categories={[
                {
                  id: 1,
                  name: "Print Design",
                  project_direction_id: 1,
                },
                {
                  id: 2,
                  name: "Visual Design",
                  project_direction_id: 1,
                },
                {
                  id: 3,
                  name: "UX/UI Design",
                  project_direction_id: 1,
                },
              ]}
            />
            <DetailedPopupFiles
              addClass="popup-body__section"
              files={["/uploads/orders/order262/SCANIMATION (Commu....jpg", "/uploads/orders/order262/IMG_6287 PNG"]}
            />
          </>
        )}
        {modalContent === "evaluate" && (
          <DetailedPopupGrade
            pmData={{
              name: "Ivan Teremov",
              position: "Project manager",
              img: "/img/onboarding/7.jpg",
            }}
          />
        )}
        {modalContent === "wiew-vacancy-card" && (
          <>
            <DetailedPopupName
              addClass="popup-body__section"
              name={"Create a milk site"}
              cover={"/assets/covers/1-min.jpg"}
            />
            <DetailedPopupDetails defOpen={true} addClass="popup-body__section" description={""} />
            <DetailedPopupCategory
              addClass="popup-body__section"
              categories={[
                {
                  id: 1,
                  name: "Print Design",
                  project_direction_id: 1,
                },
                {
                  id: 2,
                  name: "Visual Design",
                  project_direction_id: 1,
                },
                {
                  id: 3,
                  name: "UX/UI Design",
                  project_direction_id: 1,
                },
              ]}
            />
            <DetailedPopupFiles
              addClass="popup-body__section"
              files={["/uploads/orders/order262/SCANIMATION (Commu....jpg", "/uploads/orders/order262/IMG_6287 PNG"]}
            />
          </>
        )}
        {modalContent === "pm-creates-offer" && (
          <>
            <DetailedPopupCalculate
              addClass={"popup-body__section"}
              initialExperts={null}
              setOfferData={setOfferData}
              days={1}
              description={""}
              pmPrice={1}
            />
          </>
        )}
        {modalContent === "pm-creates-offer-deskr" && (
          <>
            <DetailedPopupCalculate
              addClass={"popup-body__section"}
              initialExperts={null}
              setOfferData={setOfferData}
              days={1}
              description={"<p>Get up in the morning, wash your face, put <p><a href='test'>linki example</a></p></p>"}
              pmPrice={1}
            />
          </>
        )}
        {modalContent === "pm-creates-offer-search-expert" && (
          <>
            <DetailedPopupCalculate
              addClass={"popup-body__section"}
              initialExperts={null}
              setOfferData={setOfferData}
              days={1}
              description={""}
              pmPrice={1}
              initialStep={modalContent === "pm-creates-offer-search-expert" ? 1 : null}
            />
          </>
        )}
        {modalContent === "pm-creates-offer-open-expert-card" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <p className="projects-section__title">Description of the end result</p>
              <p style={{ marginBottom: "12px" }} className="projects-section__subtitle">
                Describe below what each participant in this project needs to do
              </p>
              <RichText
                mod={"sm"}
                addClass={`${styles["calculate-editor"]}`}
                initText={null}
                setDescriptionValue={() => {
                  return false
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ marginBottom: "12px" }} className="projects-section__title">
                Calculate the average project cost
              </p>
              <ExpertCard
                initialOpen={true}
                expert={{
                  id: 1,
                  salary_per_hour: 50,
                  hours: 1,
                  job_role: "UX/UI Designer",
                  area_expertise_id: 9,
                }}
                dellExpert={() => false}
                changePrice={() => false}
                changeHours={() => false}
              />
              <AddUserButton txt={"Add Specialist"} onClick={() => false} />
            </div>
          </>
        )}
        {modalContent === "pm-creates-offer-open-expert-card-total" && (
          <>
            <p className="projects-section__title">Description of the end result</p>
            <p style={{ marginBottom: "12px" }} className="projects-section__subtitle">
              Describe below what each participant in this project needs to do
            </p>
            <RichText
              mod={"sm"}
              addClass={`${styles["calculate-editor"]}`}
              initText={null}
              setDescriptionValue={() => {
                return false
              }}
            />
            <DetailedPopupTotal
              vat={1185}
              totalTeamSum={11500}
              pmTotal={1500}
              comission={250}
              totalSum={12600}
              applyFn={() => false}
              editMod={false}
              showBtn={false}
              changePeriodFn={() => false}
              tempPeriod={36}
              period={36}
              setEditMOd={() => false}
              setPmPercent={() => false}
              pmPrice={1500}
            />
          </>
        )}
        {modalContent === "pm-wiews-project-at-work" && (
          <>
            <TabsLinear
              list={[
                { id: 1, txt: "Project Information" },
                { id: 2, txt: "Technical task" },
                { id: 3, txt: "Team & Budget" },
              ]}
              activeId={2}
              onClick={() => false}
            />
            <p className="projects-section__title">Description of the end result</p>
            <p style={{ marginBottom: "12px" }} className="projects-section__subtitle">
              Describe below what each participant in this project needs to do
            </p>
            <RichText
              mod={"sm"}
              addClass={`${styles["calculate-editor"]}`}
              initText={null}
              setDescriptionValue={() => {
                return false
              }}
            />
            <DetailedPopupDetails
              defOpen={true}
              addClass="popup-body__section"
              description={
                "I ask the children to forgive me for dedicating this book to an adult. I'll justify it: this adult is my best friend. And one more thing: he understands everything in the world, even children's books. And finally, he lives in France, and there is now hungry and cold. And he really needs comfort. If all this does not justify me, I will dedicate my book to the boy that my adult friend once was. After all, all adults were children at first, only few of them remember this. So I fix the dedication: When I was six years old, in a book called 'True Stories', which told about virgin forests, I once saw an amazing picture. In the picture, a huge snake - a boa constrictor - was swallowing a predatory beast. "
              }
            />
          </>
        )}

        {modalContent === "pm-wiews-project-at-work-candidate" && (
          <>
            <p className="projects-section__title">Roles & Skills</p>
            <IcontitleAndTags
              key={1}
              addClass="iat popup-body__section"
              title={"Web Designer"}
              tags={[]}
              iconId={10}
              userType={2}
              tagsName={"Skills"}
              topBlockPrice={120}
            />
            <DetailedPopupDetails
              defOpen={true}
              addClass="popup-body__section"
              description={
                "The strongest specialist in the field of web design and moreThe strongest specialist in the field of web design and moreThe strongest specialist in the field of web design and moreThe strongest specialist in the field of web design and moreThe strongest specialist in the field of web design and moreThe strongest specialist in the field of web design and moreThe strongest specialist in the field of web design and moreThe strongest"
              }
            />
            <DetailedPopupPortfolio
              addClass="popup-body__section"
              portfolio={[
                {
                  id: 1,
                  description: "Project managerLeo August Branding — Saint Petersburg, Russian Federation",
                  image_url: "/img/onboarding/7.jpg",
                  url: "LinkedIn",
                },
              ]}
            />
            <div className={`popup-body__section`}>
              <h3 className={"popup-body__section-title"}>Languages</h3>
              <DetailedPopupLangList
                langList={[
                  { code: "test", id: 1, name: "English" },
                  { code: "test", id: 2, name: "Spanish" },
                  { code: "test", id: 3, name: "Deutsch" },
                ]}
              />
            </div>
            <div className={`popup-body__section`}>
              <h3 className={"popup-body__section-title"}>Timezone</h3>
              <p className={"popup-body__p"}>Asia/Barnaul</p>
            </div>
          </>
        )}

        {modalContent === "pm-project-info" && (
          <>
            <TabsLinear
              list={[
                { id: 1, txt: "Project Information" },
                { id: 2, txt: "Technical task" },
                { id: 3, txt: "Technical task" },
              ]}
              activeId={3}
              onClick={() => false}
            />
            <div className="popup-body__cards-list">
              <PersonCard
                userId={1}
                expertAvatar={"/img/onboarding/7.jpg"}
                expertName={"Ivan "}
                surname={"Teremov"}
                expertJobRole={"UX/UI Designer"}
                salary_per_hour={120}
                hours={20}
              />
              <PersonCard userId={1} expertJobRole={"Java developer"} salary_per_hour={120} hours={20} />
            </div>

            <DetailedPopupTotal
              vat={1185}
              totalTeamSum={11500}
              pmTotal={1500}
              comission={250}
              totalSum={12600}
              applyFn={() => false}
              editMod={false}
              showBtn={false}
              changePeriodFn={() => false}
              tempPeriod={36}
              period={36}
              setEditMOd={() => false}
              setPmPercent={() => false}
              pmPrice={1500}
              readonly={true}
            />
          </>
        )}
      </Modal>
    </>
  )
}

export default memo(ModalOnboarding)
