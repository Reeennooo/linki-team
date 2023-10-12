import styles from "./SearchBlock.module.scss"
import InputSearch from "components/ui/InputSearch/InputSearch"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import { useEffect, useMemo, useRef, useState } from "react"
import { throttle } from "utils/schedulers"
import { useLazySearchProjectsQuery, useLazySearchUsersQuery } from "redux/api/content"
import IconClose from "public/assets/svg/close.svg"
import { useOnClickOutside } from "hooks/useOnClickOutside"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import ModalProject from "components/Modals/ModalProject/ModalProject"
import { updateApiParams } from "redux/slices/apiParams"
import ModalUser from "components/Modals/ModalUser/ModalUser"
import IconBtn from "components/ui/btns/IconBtn/IconBtn"

interface SearchBlockProps {
  modalName?: string
  onClickItem?: () => void
}

const searchRunThrottled = throttle((cb) => cb(), 500, false)

const SearchBlockItem = ({ isExist, title, isFetching, listItems }) => {
  return (
    <div className={`${styles.search__group} ${isFetching ? styles["search__group--loading"] : ""}`}>
      {title && <div className={styles["search__group-title"]}>{title}</div>}
      {isFetching ? (
        <div className={styles.search__loading} />
      ) : isExist ? (
        <ul className={styles.search__list}>{listItems}</ul>
      ) : (
        <div className={styles.search__empty}>
          <IconClose />
          No search results
        </div>
      )}
    </div>
  )
}

const SearchBlock: React.FC<SearchBlockProps> = ({ modalName = "search", onClickItem }) => {
  const [searchProjects, { data: projects, isFetching: isFetchingProjects }] = useLazySearchProjectsQuery()
  const [searchUsers, { data: users, isFetching: isFetchingUsers }] = useLazySearchUsersQuery()

  const dispatch = useAppDispatch()
  const { modalsList } = useAppSelector(selectModals)

  const searchBlockRef = useRef()

  const [isDrop, setDrop] = useState(false)
  const [activeTabID, setActiveTabID] = useState(1)
  const [isFocus, setFocus] = useState(false)

  const handleClickItem = (name, id) => {
    if (onClickItem) onClickItem()
    if (name === "project") {
      dispatch(updateApiParams({ field: "projectID", data: id }))
      dispatch(openModal(`modal-project-${modalName}`))
    } else if (name === "user") {
      dispatch(updateApiParams({ field: "currentUserID", data: id }))
      dispatch(openModal(`modal-user-${modalName}`))
    }
    setDrop(false)
    setFocus(false)
  }

  const projectsList = useMemo(() => {
    return projects?.map((project) => {
      return (
        <li key={project.id} className={styles.search__item}>
          <button
            type={"button"}
            className={styles.search__btn}
            onClick={() => {
              handleClickItem("project", project.id)
            }}
          >
            {
              <img
                className={styles.search__check}
                src={`/assets/icons/check-circle${project.status === 5 ? "-green" : ""}.svg`}
                alt={project.name}
              />
            }
            <span>{project.name}</span>
          </button>
        </li>
      )
    })
  }, [projects])

  const userList = useMemo(() => {
    return users?.map((user) => {
      return (
        <li key={user.id} className={styles.search__item}>
          <button
            type={"button"}
            className={styles.search__btn}
            onClick={() => {
              handleClickItem("user", user.id)
            }}
          >
            {user.avatar ? (
              <img className={styles.search__avatar} src={user.avatar} alt={""} />
            ) : (
              <img className={styles.search__avatar} src={"/assets/icons/user-circle.svg"} alt={user.name} />
            )}
            <span>
              {user.name} {user.surname}
            </span>
          </button>
        </li>
      )
    })
  }, [users])

  useOnClickOutside(searchBlockRef, () => {
    setDrop(false)
    setFocus(false)
  })

  const handleBack = () => {
    setDrop(false)
    setFocus(false)
  }

  return (
    <>
      <div
        ref={searchBlockRef}
        className={`search-block ${styles.search} ${
          isDrop ? "search-block--is-active " + styles["search--is-active"] : ""
        } ${isFocus ? "search-block--is-focus" : ""}`}
      >
        <IconBtn icon={"back"} addClass={`search-block__back ${styles.search__back}`} onClick={handleBack} />
        <InputSearch
          onFocus={(value) => {
            setFocus(true)
            if (!isDrop && value.length > 2) {
              setTimeout(() => {
                setDrop(true)
              }, 200)
            }
          }}
          onClickBtnClose={() => {
            setFocus(false)
          }}
          onChange={(value) => {
            if (value.length < 1) {
              setDrop(false)
              return
            }
            if (value.length < 3) return
            searchRunThrottled(() => {
              searchProjects({ search: value })
              searchUsers({ search: value })
              setTimeout(() => {
                setDrop(true)
              }, 200)
            })
          }}
        />
        <div className={styles.search__drop}>
          <TabsLinear
            list={[
              { id: 1, txt: "All" },
              { id: 2, txt: "Projects" },
              { id: 3, txt: "People" },
            ]}
            activeId={activeTabID}
            mod={"toggle"}
            addClass={styles.tabs}
            onClick={(id) => {
              setActiveTabID(id)
            }}
          />
          {activeTabID === 1 ? (
            <>
              {userList?.length > 0 || projectsList?.length > 0 ? (
                <div>
                  <SearchBlockItem
                    title={"People"}
                    listItems={userList}
                    isFetching={isFetchingUsers}
                    isExist={Boolean(users?.length)}
                  />
                  <SearchBlockItem
                    title={"Projects"}
                    listItems={projectsList}
                    isFetching={isFetchingProjects}
                    isExist={Boolean(projects?.length)}
                  />
                </div>
              ) : (
                <div className={styles.search__empty}>
                  <IconClose />
                  No search results
                </div>
              )}
            </>
          ) : activeTabID === 2 ? (
            <SearchBlockItem
              title={""}
              listItems={projectsList}
              isFetching={isFetchingProjects}
              isExist={Boolean(projects?.length)}
            />
          ) : activeTabID === 3 ? (
            <SearchBlockItem
              title={""}
              listItems={userList}
              isFetching={isFetchingUsers}
              isExist={Boolean(users?.length)}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <ModalProject
        modalType={`modal-project-${modalName}`}
        isOpen={modalsList.includes(`modal-project-${modalName}`)}
        onClose={() => {
          dispatch(closeModal(`modal-project-${modalName}`))
        }}
        isFooterExist={false}
      />
      <ModalUser
        modalType={`modal-user-${modalName}`}
        isOpen={modalsList.includes(`modal-user-${modalName}`)}
        onClose={() => {
          dispatch(closeModal(`modal-user-${modalName}`))
        }}
        isFooterExist={false}
        headerUserClickable={false}
      />
    </>
  )
}

export default SearchBlock
