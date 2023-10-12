import styles from "./PassRecovery.module.scss"
import InputGroup from "components/ui/InputGroup/InputGroup"
import { useFormik } from "formik"

const PassRecovery: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      defaulExpertType: "experts",
      expertType: "experts",
      role: "",
      name: "",
      email: "",
      password: "",
      agree: false,
      ideaType: "",
      remember: false,
    },
    validate() {
      let errors = {}
      if (!formik.values.email) {
        errors = { ...errors, email: "The email field is required" }
      } else if (
        formik.values.email !== "" &&
        !/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
          formik.values.email
        )
      ) {
        errors = {
          ...errors,
          email: `Enter the correct registered mail`,
        }
      }
      return errors
    },
    onSubmit(values) {
      console.log("FORMIKKK SUBMIT", values)
    },
  })
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <h4>Forgot password?</h4>
        <p>Enter your email address below and we will send you a link where you can enter a new password.</p>
        <InputGroup
          placeholder={"Email"}
          type={"email"}
          fieldProps={formik.getFieldProps("email")}
          error={formik.touched.email && formik.errors && formik.errors.email ? formik.errors.email : ""}
        />

        <div>
          <button className={` btn`} type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  )
}

export default PassRecovery
