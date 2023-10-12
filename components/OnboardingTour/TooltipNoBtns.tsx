import styles from "./OnboardingTour.module.scss"
const TooltipNoBtns = ({ step, tooltipProps }) => (
  <div className={`${styles["tour-tooltip"]}`} {...tooltipProps}>
    {step.title && <div className={`${styles["tour-tooltip__title"]}`}>{step.title}</div>}
    <div className={`${styles["tour-tooltip__content"]}`} dangerouslySetInnerHTML={{ __html: `${step.content}` }}></div>
  </div>
)

export default TooltipNoBtns
