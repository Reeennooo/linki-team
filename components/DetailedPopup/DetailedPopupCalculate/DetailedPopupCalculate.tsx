import styles from "./DetailedPopupCalculate.module.scss"
import { Dispatch, SetStateAction, useEffect, useMemo, useReducer, useState } from "react"
import InputSearch from "components/ui/InputSearch/InputSearch"
import { useGetSpecksQuery, useGetStacksQuery } from "redux/api/content"
import SelectDropBlock from "components/ui/SelectDropBlock/SelectDropBlock"
import IconCaretLeft from "public/icons/caret-left-icon.svg"
import ExpertCard from "components/ExpertCard/ExpertCard"

import { numberFormat } from "utils/formatters"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"

import { PERCENT_PM, PERCENT_VAT } from "utils/constants"
import { PERCENT_SERVICE } from "utils/constants"
import RichText from "components/RichText/RichText"
import DetailedPopupTotal from "../DetailedPopupTotal/DetailedPopupTotal"
import AddUserButton from "components/ui/btns/AddUserButton/AddUserButton"

export interface OfferMember {
  hours: number
  id: number
  job_role: string
  salary_per_hour: number
  user: string | null
}
interface Props {
  initialExperts?: OfferMember[] | string[]
  days?: number
  addClass?: string
  setOfferData: Dispatch<SetStateAction<any>>
  description?: string
  pmPrice: number
  initialStep?: number
}

const ADD_EXPERT = "add"
const SET_INITIAL_EXPERTS = "set_initial"
const DELL_EXPERT = "dell"
const CHANGE_PRICE = "chPrise"
const CHANGE_HOURS = "chHours"

const reducer = (state, action) => {
  switch (action.type) {
    case SET_INITIAL_EXPERTS:
      return [...action.payload]
    case ADD_EXPERT:
      return [
        ...state,
        {
          ...action.payload,

          salary_per_hour: action.payload.salary_per_hour,
          hours: action.payload.hours,
        },
      ]
    case DELL_EXPERT:
      return state.filter((expert) => expert.id !== action.id)
    case CHANGE_PRICE:
      return state.map((expert) => {
        if (expert.id !== action.id) {
          return expert
        } else {
          return { ...expert, salary_per_hour: action.salary_per_hour }
        }
      })
    case CHANGE_HOURS:
      return state.map((expert) => {
        if (expert.id !== action.id) {
          return expert
        } else {
          return { ...expert, hours: action.hours }
        }
      })
    default:
      return state
  }
}

const DetailedPopupCalculate: React.FC<Props> = ({
  setOfferData,
  initialExperts,
  addClass,
  days,
  description,
  pmPrice,
  initialStep,
}) => {
  //Данные для компонента
  const { data: directionsAll } = useGetSpecksQuery()
  const { data: stacks } = useGetStacksQuery()

  //Шаги компонента
  const [step, setStep] = useState(initialStep ? initialStep : 0)

  //Изначальный массив специалистов
  const [expertsList, dispatchEcpert] = useReducer(reducer, initialExperts ? initialExperts : [])

  useEffect(() => {
    if (initialExperts?.length) {
      dispatchEcpert({ type: SET_INITIAL_EXPERTS, payload: initialExperts })
    } else {
      dispatchEcpert({ type: SET_INITIAL_EXPERTS, payload: [] })
    }
  }, [initialExperts])

  useEffect(() => {
    if (days) {
      setPeriod(days)
      setTempPeriod(days)
    }
  }, [days])

  //ф-ция добавления эксперта в массив
  const addExpert = (val) => {
    let add = true
    //если такого эксперта нет, то добавляем его
    expertsList.forEach((expert) => {
      if (expert.id === val.id) {
        add = false
      }
    })
    if (add)
      dispatchEcpert({
        type: ADD_EXPERT,
        payload: { ...val, job_role: val.name, job_role_id: val.id, salary_per_hour: 50, hours: 1 },
      })
  }
  //ф-ция удаления эксперта
  const dellExpert = (id) => {
    dispatchEcpert({ type: DELL_EXPERT, id: id })
  }

  const chPrice = (id, salary_per_hour) => {
    dispatchEcpert({ type: CHANGE_PRICE, id: id, salary_per_hour: salary_per_hour })
  }

  const chHours = (id, hours) => {
    dispatchEcpert({ type: CHANGE_HOURS, id: id, hours: hours })
  }

  const [searchedExpert, setSelectedExpert] = useState("")

  const [isSelectOpen, setSelectOpen] = useState(false)

  //массив экспертов в селекте
  const [selecedDirection, setSelecedDirection] = useState("")
  const [selecExpertstList, setSelecExpertstList] = useState([])

  const selectDirection = (id, name) => {
    setSelecedDirection(name)
    if (stacks) {
      setSelecExpertstList(stacks.filter((expert) => expert.area_expertise_id === id))
    }
  }

  const clearDirection = () => {
    setSelecedDirection("")
    setSelecExpertstList([])
  }
  const RenderSelectDropdown = useMemo(() => {
    return (
      <>
        {selecedDirection.length ? (
          <div className={`${styles["calc-select-dropdown2"]} `}>
            <div onClick={clearDirection} className={`${styles["calc-select-dropdown2__name"]}`}>
              <IconCaretLeft />
              {selecedDirection}
            </div>
            <div>
              {selecExpertstList.map((expert) => {
                return (
                  <p
                    onClick={() => {
                      addExpert(expert)
                      setStep(0)
                      setSelecedDirection("")
                    }}
                    className={`${styles["calc-select-dropdown2__list-item"]}`}
                    key={expert.id}
                  >
                    {expert.name}
                  </p>
                )
              })}
            </div>
          </div>
        ) : (
          <div className={`${styles["calc-select-dropdown"]}`}>
            {directionsAll &&
              directionsAll.map((direction) => {
                return (
                  <p
                    onClick={() => selectDirection(direction.id, direction.name)}
                    key={direction.id}
                    className={`${styles["calc-select-dropdown__direction"]}`}
                  >
                    {direction.name}
                  </p>
                )
              })}
          </div>
        )}
      </>
    )
  }, [directionsAll, stacks, selecedDirection, selecExpertstList])

  //TOTAL
  const [editMod, setEditMOd] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const [period, setPeriod] = useState(1)
  const [tempPeriod, setTempPeriod] = useState(1)

  const applyFn = () => {
    if (tempPeriod < 1) {
      setTempPeriod(1)
      setPeriod(1)
    } else {
      setPeriod(tempPeriod)
    }
    setShowBtn(false)
    setEditMOd(false)
  }

  const changePeriodFn = (val) => {
    setShowBtn(true)
    if (val < 999) {
      setTempPeriod(val)
    }
  }

  const [totalTeamSum, setTotalTeamSumm] = useState(0)

  const [pmTotal, setPmTotal] = useState(0)
  const [vat, setVat] = useState(0)
  const [pmPercent, setPmPercent] = useState(pmPrice ? pmPrice : PERCENT_PM)
  const [comission, setComission] = useState(0)
  const [totalSum, setTotalSum] = useState(0)

  useEffect(() => {
    let newSumm = 0
    expertsList.forEach((el) => {
      newSumm = newSumm + el.hours * el.salary_per_hour
    })
    setTotalTeamSumm(Math.round(newSumm))
    setPmTotal(Math.round(pmPercent === PERCENT_PM ? newSumm * pmPercent : pmPercent ? pmPercent : 0))
    setComission(
      Math.round(
        (newSumm + Math.round(pmPercent === PERCENT_PM ? newSumm * pmPercent : pmPercent ? pmPercent : 0)) *
          PERCENT_SERVICE
      )
    )
    setVat(
      Math.round(
        (Math.round(newSumm) +
          Math.round(pmPercent === PERCENT_PM ? newSumm * pmPercent : pmPercent ? pmPercent : 0) +
          Math.round(
            (newSumm + Math.round(pmPercent === PERCENT_PM ? newSumm * pmPercent : pmPercent ? pmPercent : 0)) *
              PERCENT_SERVICE
          )) *
          PERCENT_VAT
      )
    )
    setTotalSum(
      Math.round(newSumm) +
        Math.round(pmPercent === PERCENT_PM ? newSumm * pmPercent : pmPercent ? pmPercent : 0) +
        Math.round(
          (newSumm + Math.round(pmPercent === PERCENT_PM ? newSumm * pmPercent : pmPercent ? pmPercent : 0)) *
            PERCENT_SERVICE
        ) +
        Math.round(
          (Math.round(newSumm) +
            Math.round(pmPercent === PERCENT_PM ? newSumm * pmPercent : pmPercent ? pmPercent : 0) +
            Math.round(
              (newSumm + Math.round(pmPercent === PERCENT_PM ? newSumm * pmPercent : pmPercent ? pmPercent : 0)) *
                PERCENT_SERVICE
            )) *
            PERCENT_VAT
        )
    )
  }, [expertsList, pmPercent])

  const [newDescr, setNewDescr] = useState(description)
  useEffect(() => {
    setOfferData((prev) => {
      return {
        ...prev,
        days: period,
        description: newDescr,
        team: expertsList,
        price: totalSum,
        manager_price: pmPercent && pmPercent !== PERCENT_PM ? pmPercent : null,
      }
    })
  }, [totalSum, period, newDescr])

  return (
    <>
      <div className={`${styles["calculate-editor-wrp"]}`}>
        <h3 className={`${styles["calculate-editor-wrp__title"]}`}>Description of the end result</h3>
        <p className={`${styles["calculate-editor-wrp__subtitle"]}`}>
          Describe below what needs to be done for each performer in this project
        </p>
        <RichText
          mod={"sm"}
          addClass={`${styles["calculate-editor"]}`}
          initText={description ? description : null}
          setDescriptionValue={setNewDescr}
        />
      </div>
      <div className={`${styles["calculate"]} ${addClass ? addClass : ""}`}>
        <h3 className={`${styles["calculate__title"]}`}>Calculate the average project cost</h3>
        {step === 1 ? (
          <div className={`${styles["calculate-search"]}`}>
            <InputSearch
              isDrop
              value={searchedExpert}
              dropData={stacks}
              onClick={(val) => {
                const name = val.name
                setSelectedExpert(name)
                addExpert(val)
                setStep(0)
                setSelectedExpert("")
              }}
            />
            <SelectDropBlock
              placeholder={`Categories`}
              child={RenderSelectDropdown}
              isSelectOpen={isSelectOpen}
              setSelectBlockOpen={setSelectOpen}
            />
          </div>
        ) : (
          <div>
            {expertsList.map((expert) => {
              return (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  dellExpert={dellExpert}
                  changePrice={chPrice}
                  changeHours={chHours}
                />
              )
            })}
            <AddUserButton txt={"Add Specialist"} onClick={() => setStep(1)} />
            {expertsList.length > 0 && (
              <DetailedPopupTotal
                totalTeamSum={totalTeamSum}
                pmTotal={pmTotal}
                vat={vat}
                comission={comission}
                totalSum={totalSum}
                applyFn={applyFn}
                editMod={editMod}
                showBtn={showBtn}
                changePeriodFn={changePeriodFn}
                tempPeriod={tempPeriod}
                period={period}
                setEditMOd={setEditMOd}
                setPmPercent={setPmPercent}
                pmPrice={pmPrice}
              />
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default DetailedPopupCalculate
