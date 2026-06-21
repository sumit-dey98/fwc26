import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import BracketExportTemplate from './BracketExportTemplate'

const ASPECT_RATIO = 16 / 10
const FIT_PADDING = 1 // leaves a little breathing room inside the frame

export { ASPECT_RATIO }

const BracketCanvasFrame = forwardRef(function BracketCanvasFrame(
  {
    width,
    rawFixtures,
    predictedFixtures,
    teamByName,
    bgColor = '#08121f',
    bgImage = '',
    bgOpacity = 1,
  },
  ref
) {
  const height = Math.round(width / ASPECT_RATIO)
  const templateRef = useRef(null)
  const [fit, setFit] = useState({ scale: 1, left: 0, top: 0 })

  useLayoutEffect(() => {
    const node = templateRef.current
    if (!node) return
    const naturalW = node.offsetWidth
    const naturalH = node.offsetHeight
    if (!naturalW || !naturalH) return
    const scale = Math.min(width / naturalW, height / naturalH) * FIT_PADDING
    setFit({
      scale,
      left: (width - naturalW * scale) / 2,
      top: (height - naturalH * scale) / 2,
    })
  }, [width, height, rawFixtures, predictedFixtures, teamByName])

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ width, height, backgroundColor: bgColor }}>
      {bgImage && (
        <img
          src={bgImage}
          crossOrigin="anonymous"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: bgOpacity }}
        />
      )}
      <div
        className="absolute"
        style={{ left: fit.left, top: fit.top, transform: `scale(${fit.scale})`, transformOrigin: 'top left' }}
      >
        <BracketExportTemplate
          ref={templateRef}
          rawFixtures={rawFixtures}
          predictedFixtures={predictedFixtures}
          teamByName={teamByName}
        />
      </div>
    </div>
  )
})

export default BracketCanvasFrame