import React, { Dispatch, SetStateAction, useMemo, useState } from "react"
import styles from "./WaitListFrom.module.scss"
import stylesInputGroup from "./../../ui/InputGroup/InputGroup.module.scss"
import ProgressSteps from "components/ui/ProgressSteps/ProgressSteps"
import { useGetModerationQuestionsQuery, useSendModerationAnswersMutation } from "redux/api/auth"
import { useFormik } from "formik"
import InputGroup from "components/ui/InputGroup/InputGroup"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import SelectBlock from "components/ui/SelectBlock/SelectBlock"
import TagItem from "components/ui/TagItem/TagItem"
import Checkbox from "components/ui/Checkbox/Checkbox"
import { IModerationQuestion, IModerationQuestionsGroup } from "types/auth"

interface Props {
  setUserConfirmedType: Dispatch<SetStateAction<number>>
}
interface ISelectOptions {
  value: string | number
  label: string
  specialization_id?: string | number
}
const WaitListForm: React.FC<Props> = ({ setUserConfirmedType }) => {
  const { data: questionsGroups } = useGetModerationQuestionsQuery()
  const [sendModerationAnswers] = useSendModerationAnswersMutation()

  const [step, setStep] = useState<number>(1)

  const getFieldName = (field: string) => {
    return String(field).replace(/\.|\s/g, "_").toLowerCase()
  }

  const getIsFieldRequired = (
    questionItem: IModerationQuestion,
    group: IModerationQuestionsGroup,
    formikValues: { [p: string]: string | object | [] }
  ) => {
    const conditionalObj =
      questionItem.condition_group &&
      group.questions.filter((quest) => {
        return (
          quest.condition_group === questionItem.condition_group && quest.id !== questionItem.id && quest.control_values
        )
      })
    const conditionalName = conditionalObj && conditionalObj.length && getFieldName(conditionalObj[0].question)
    const conditionalControlValues = conditionalObj && conditionalObj.length && conditionalObj[0].control_values
    return conditionalName && formikValues[conditionalName] !== conditionalControlValues
  }

  const formikInitialValues = useMemo(() => {
    const output: { [key: string]: string | [] | object } = {}
    questionsGroups?.map((group) => {
      group.questions.map((question) => {
        const fieldName = getFieldName(question.question)
        output[fieldName] =
          question.answer_type === "select" || question.answer_type === "multi_select"
            ? []
            : question.answer_type === "checkbox" && question.answers.length > 1
            ? question.answers[1]
            : ""
      })
    })
    return output
  }, [questionsGroups])

  const formik = useFormik({
    initialValues: formikInitialValues,
    validate(values) {
      let errors = {}
      const emailRegExp =
        /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
      const urlRegExp = new RegExp(
        "^(https?:\\/\\/)?" + // validate protocol
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
          "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
          "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      ) // validate fragment locator
      if (questionsGroups) {
        questionsGroups.map((group) => {
          group.questions.map((questionItem) => {
            if (questionItem.is_optional) return

            const isRequired = getIsFieldRequired(questionItem, group, values)
            if (isRequired === false) return

            const fieldName = getFieldName(questionItem.question)
            switch (questionItem.answer_type) {
              case "text_phone":
                const telValue = (values[fieldName] as string).replace(/[^A-Za-zА-Яа-я0-9]/g, "")
                if (!telValue || telValue.length <= 10) {
                  errors = { ...errors, [fieldName]: "Wrong number" }
                }
                break
              case "text_email":
                if (!values[fieldName]) {
                  errors = { ...errors, [fieldName]: "The email field is required" }
                } else if (values[fieldName] !== "" && !emailRegExp.test(values[fieldName] as string)) {
                  errors = { ...errors, [fieldName]: "Enter the correct email" }
                }
                break
              case "text_url":
                if (!values[fieldName]) {
                  errors = { ...errors, [fieldName]: "The field is required" }
                } else if (values[fieldName] !== "" && !urlRegExp.test(values[fieldName] as string)) {
                  errors = { ...errors, [fieldName]: "Enter the correct url" }
                }
                break
              case "select":
                if (!(values[fieldName] as ISelectOptions)?.value) {
                  errors = { ...errors, [fieldName]: "The field is required" }
                }
                break
              case "multi_select":
                if (!(values[fieldName] as ISelectOptions[]).length) {
                  errors = { ...errors, [fieldName]: "The field is required" }
                }
                break
              default:
                if (!values[fieldName]) errors = { ...errors, [fieldName]: "The field is required" }
            }
          })
        })
      }
      return errors
    },
    enableReinitialize: true,
    onSubmit(values) {
      const output: { [key: number]: string } = {}

      questionsGroups?.map((group) => {
        group.questions.map((questionItem) => {
          const fieldName = getFieldName(questionItem.question)
          if (!values.hasOwnProperty(fieldName)) return
          let outputValues
          switch (questionItem.answer_type) {
            case "select":
              const selectValue = values[fieldName] as ISelectOptions
              outputValues = selectValue.value as string
              break
            case "multi_select":
              let str = ""
              const multiSelectValues = values[fieldName] as object[]
              multiSelectValues?.map((obj: any) => {
                if (str === "") {
                  str = obj.value
                } else {
                  str += "," + obj.value
                }
              })
              outputValues = str
              break
            default:
              outputValues = values[fieldName] as string
          }
          if (!outputValues) return
          output[questionItem.id] = outputValues
        })
      })

      sendModerationAnswers({ answers: output })
        .unwrap()
        .then((res) => {
          setUserConfirmedType(res.success ? 2 : 1)
        })
    },
  })

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }
  const handleNext = () => {
    if (!questionsGroups) return
    if (questionsGroups.length === step) {
      formik.submitForm()
    } else {
      setStep((prev) => prev + 1)
    }
  }

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      <div className={styles.form__main}>
        {questionsGroups && questionsGroups?.length > 1 && (
          <ProgressSteps steps={questionsGroups.length} step={step} className={styles.form__progress} />
        )}

        {questionsGroups?.map((group, index) => {
          if (index + 1 !== step) return
          const questionsList = group.questions?.map((questionItem) => {
            const inputName = getFieldName(questionItem.question)
            const errorTxt = formik.touched[inputName] && formik.errors && formik.errors[inputName]

            const isRequired = getIsFieldRequired(questionItem, group, formik.values)

            let inputField
            switch (questionItem.answer_type) {
              case "text_phone":
                inputField = (
                  <InputGroup
                    placeholder={questionItem?.placeholder || ""}
                    type="tel"
                    fieldProps={formik.getFieldProps("phone")}
                    error={errorTxt ? formik.errors[inputName] : ""}
                    allowEmptyFormatting={false}
                  />
                )
                break
              case "select":
              case "multi_select":
                const selectOptions: ISelectOptions[] = []
                questionItem?.answers?.map((answer, index) => {
                  selectOptions.push({
                    specialization_id: index + 1,
                    value: answer,
                    label: answer,
                  })
                })
                inputField = (
                  <div className={`${styles.form__field} ${errorTxt ? "error" : ""}`}>
                    <div
                      className={`${styles["form__select-wrap"]} ${
                        questionItem.answer_type === "multi_select" ? styles["form__select-wrap--multi"] : ""
                      }`}
                    >
                      {questionItem.answer_type === "multi_select" ? (
                        <p className={styles["form__multi-select-placeholder"]}>Choose option</p>
                      ) : (
                        ""
                      )}
                      <SelectBlock
                        options={selectOptions}
                        value={formik.values[inputName] as ISelectOptions[]}
                        isMulti={questionItem.answer_type === "multi_select"}
                        placeholder={(questionItem.answer_type === "select" && questionItem.placeholder) || undefined}
                        size={"lg"}
                        onBlur={() => {
                          setTimeout(() => {
                            formik.setFieldTouched(inputName, true)
                          }, 0)
                        }}
                        onChange={(value: ISelectOptions[]) => {
                          formik.setFieldValue(inputName, value)
                        }}
                      />
                    </div>
                    {questionItem.answer_type === "multi_select" &&
                      (formik.values[inputName] as ISelectOptions[])?.length > 0 && (
                        <div>
                          {(formik.values[inputName] as ISelectOptions[]).map((item) => {
                            return (
                              <TagItem
                                addClass={styles["form__select-tag"]}
                                key={item.specialization_id}
                                txt={`${item.label}`}
                                onClose={() => {
                                  formik.setFieldValue(
                                    inputName,
                                    (formik.values[inputName] as ISelectOptions[]).filter(
                                      (stack) => stack.value !== item.value
                                    )
                                  )
                                }}
                                id={`${item.value}`}
                              />
                            )
                          })}
                        </div>
                      )}

                    {errorTxt && (
                      <label className={`input-group__error ${stylesInputGroup["input-group__error"]}`}>
                        {errorTxt}
                      </label>
                    )}
                  </div>
                )
                break
              case "checkbox":
                if (!questionItem.answers.length) break
                inputField = (
                  <Checkbox
                    name={inputName}
                    value={formik.values[inputName] as string}
                    checked={formik.values[inputName] === questionItem.answers[0]}
                    text={questionItem.question}
                    onChange={() => {
                      formik.setFieldValue(
                        inputName,
                        formik.values[inputName] === questionItem.answers[0]
                          ? questionItem.answers[1]
                          : questionItem.answers[0]
                      )
                      formik.setFieldTouched(inputName, true)
                    }}
                  />
                )
                break
              default:
                inputField = (
                  <div className={`${stylesInputGroup["input-group"]}`}>
                    <input
                      type={questionItem.answer_type === "text_url" ? "url" : "text"}
                      placeholder={questionItem?.placeholder || ""}
                      {...formik.getFieldProps(inputName)}
                      value={(formik.values[inputName] as string) || ""}
                      className={`${errorTxt ? stylesInputGroup.error : ""} ${
                        formik.values[inputName] ? styles["no-empty"] : ""
                      }`}
                      autoComplete={"off"}
                    />
                    {errorTxt && (
                      <label className={`input-group__error ${stylesInputGroup["input-group__error"]}`}>
                        {errorTxt}
                      </label>
                    )}
                  </div>
                )
            }

            return isRequired === true ? (
              <div key={questionItem.id} className={`${styles.form__field} ${styles["form__field--is-shown"]}`}>
                {inputField}
              </div>
            ) : isRequired === false ? null : (
              <div key={questionItem.id} className={`${styles.form__field}`}>
                {questionItem.answer_type === "checkbox" ? (
                  ""
                ) : (
                  <h3 className={styles["form__field-title"]}>
                    {questionItem.question} {questionItem.is_optional ? "(optional)" : ""}
                  </h3>
                )}
                {inputField}
              </div>
            )
          })

          return (
            <div key={index}>
              <h2 className={styles["form__group-title"]}>{group.name}</h2>
              {questionsList}
            </div>
          )
        })}
      </div>
      <div className={styles.form__footer}>
        <div className={styles["form__footer-wrap"]}>
          {step !== 1 && (
            <DefaultBtn
              txt={"Back"}
              minWidth={false}
              mod={"transparent-grey"}
              size={"lg"}
              onClick={handleBack}
              addClass={styles["form__btn-back"]}
            />
          )}
          {questionsGroups && (
            <DefaultBtn
              txt={questionsGroups && questionsGroups.length === step ? "Submit" : "Next"}
              size={"lg"}
              addClass={styles["form__btn-next"]}
              onClick={handleNext}
              disabled={
                questionsGroups &&
                questionsGroups[step - 1].questions.filter((questionItem) => {
                  const inputName = getFieldName(questionItem.question)
                  const isRequired = getIsFieldRequired(questionItem, questionsGroups[step - 1], formik.values)
                  if (questionItem.is_optional) return null
                  if (isRequired === false) return null
                  if (questionItem.answer_type === "checkbox") return null
                  return formik.errors[inputName] || !formik.touched[inputName]
                }).length > 0
                  ? true
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </form>
  )
}

export default WaitListForm
