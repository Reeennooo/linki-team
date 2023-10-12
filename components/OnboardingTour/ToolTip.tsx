import styles from "./OnboardingTour.module.scss"
const Tooltip = ({ continuous, index, step, backProps, closeProps, primaryProps, tooltipProps, size, skipProps }) => (
  <div className={`${styles["tour-tooltip"]}`} {...tooltipProps}>
    <div className={`${styles["tour-tooltip__content"]}`}>{step.content}</div>
    <div className={styles["tour-tooltip__footer"]}>
      {(index || index === 0) && size && (
        <div className={`${styles["tour-tooltip__count"]}`}>
          <span className={`${styles["tour-tooltip__cout-index"]}`}>{index + 1}</span>
          {`/${size}`}
        </div>
      )}
      {continuous && (
        <div className={`${styles["tour-tooltip__btns"]}`}>
          <button
            {...skipProps}
            className={`${styles["tour-tooltip__skip"]} default-btn default-btn--transparent-grey-grey`}
            id="skip"
          >
            Skip intro{" "}
          </button>
          <button {...primaryProps} className={` default-btn `} id="next">
            Next{" "}
          </button>
        </div>
      )}
    </div>
  </div>
)

export default Tooltip
