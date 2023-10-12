import { useEffect, useState } from "react"
import Slider from "rc-slider"
import styles from "./RangeSliderBlock.module.scss"

interface Props {
  values: number | number[]
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  onChange?(val: number): void
  onAfterChange?(val: number): void
}

const RangeSliderBlock: React.FC<Props> = ({
  values,
  min = 1,
  max = 100,
  step = 1,
  prefix,
  suffix,
  onChange,
  onAfterChange,
}) => {
  const [state, setState] = useState(values)

  useEffect(() => {
    setState(values)
  }, [values])

  return (
    <div className={styles.block}>
      <Slider
        marks={{
          [min]: (
            <>
              {prefix}
              {min} {suffix}
            </>
          ),
          [max]: (
            <>
              {prefix}
              {max} {suffix}
            </>
          ),
        }}
        min={min}
        max={max}
        step={step}
        range={typeof state !== "number"}
        value={state}
        onChange={(value) => {
          const val = value as number
          setState(val)
          if (onChange) onChange(val)
        }}
        onAfterChange={(value) => {
          const val = value as number
          setState(val)
          if (onAfterChange) onAfterChange(val)
        }}
        handleRender={(origin, props) => {
          return (
            <div className={`rc-slider-handle`} {...origin.props}>
              <span>
                {props.value}{" "}
                <svg width="10" height="4" viewBox="0 0 10 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0L4.37531 3.50024C4.74052 3.79242 5.25948 3.79242 5.6247 3.50024L10 0H0Z" fill="white" />
                </svg>
              </span>
            </div>
          )
        }}
      />
    </div>
  )
}

export default RangeSliderBlock
