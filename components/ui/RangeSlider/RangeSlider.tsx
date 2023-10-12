import { useEffect, useState } from "react"
import Slider from "rc-slider"

interface Props {
  values: number | number[]
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  onChange?(val: number): void
  handlerColor?: string
}

const RangeSlider: React.FC<Props> = ({
  values,
  min = 1,
  max = 100,
  step = 1,
  prefix,
  suffix,
  onChange,
  handlerColor,
}) => {
  const [state, setState] = useState(values)

  useEffect(() => {
    setState(values)
  }, [values])

  return (
    <Slider
      marks={{
        [min]: (
          <>
            {(7 * (max - min)) / 100 + min < (state[0] || state) && state < min ? (
              <>
                {prefix}
                {min} {suffix}
              </>
            ) : (
              ""
            )}
          </>
        ),
        [max]: (
          <>
            {(93 * (max - min)) / 100 + min > (state[1] || state) && state < max ? (
              <>
                {prefix}
                {max} {suffix}
              </>
            ) : (
              ""
            )}
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
      handleRender={(origin, props) => {
        return (
          <div className={`rc-slider-handle`} {...origin.props}>
            <span>
              {prefix}
              {props.value} {suffix}
            </span>
          </div>
        )
      }}
      className={handlerColor}
    />
  )
}

export default RangeSlider
