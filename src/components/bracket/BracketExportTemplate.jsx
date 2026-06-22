import { forwardRef, useMemo, Fragment } from 'react'

const STAGE_ORDER = ['round-of-32', 'round-of-16', 'quarter-finals', 'semi-finals']
const STAGE_LABELS = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi-Finals']

const SIZES = {
  boxW: 186,
  boxH: 48, //44
  boxGap: 8,
  matchGap: 44,
  roundGap: 55,
  centerGap: 244,
  marginX: 24,
  marginY: 24,
  titleHeight: 72,
  roundLabelHeight: 28,
  logoSize: 64,
  flagW: 22,
  flagH: 15,
  boxesTopGap: 110,
  connectorOffset: 6,
}

function parseMatchRef(label) {
  if (!label) return null
  const m = label.match(/^Winner Match (\d+)$/) || label.match(/^Loser Match (\d+)$/)
  return m ? parseInt(m[1], 10) : null
}

function getChildren(matchNumber, byNumber) {
  const f = byNumber[matchNumber]
  if (!f) return null
  const home = parseMatchRef(f.homeTeam)
  const away = parseMatchRef(f.awayTeam)
  if (home == null || away == null) return null
  return [home, away]
}

function layoutSide(rootMatchNumber, byNumber, startY) {
  const positions = {}
  let leafCount = 0
  const slotH = SIZES.boxH * 2 + SIZES.boxGap

  function recurse(matchNumber) {
    const children = getChildren(matchNumber, byNumber)
    if (!children) {
      const i = leafCount++
      const topY = startY + i * (slotH + SIZES.matchGap)
      const centerY = topY + slotH / 2
      positions[matchNumber] = { centerY }
      return centerY
    }
    const cy0 = recurse(children[0])
    const cy1 = recurse(children[1])
    const centerY = (cy0 + cy1) / 2
    positions[matchNumber] = { centerY }
    return centerY
  }

  recurse(rootMatchNumber)
  return positions
}

function useBracketLayout(rawFixtures, predictedFixtures, teamByName) {
  return useMemo(() => {
    if (!rawFixtures?.length) return null

    const byRawNumber = Object.fromEntries(rawFixtures.map(f => [f.matchNumber, f]))
    const byPredNumber = Object.fromEntries((predictedFixtures || []).map(f => [f.matchNumber, f]))

    const finalRaw = rawFixtures.find(f => f.stage === 'final')
    const thirdRaw = rawFixtures.find(f => f.stage === 'third-place')
    if (!finalRaw) return null

    const [leftRoot, rightRoot] = getChildren(finalRaw.matchNumber, byRawNumber) ?? [null, null]
    if (leftRoot == null || rightRoot == null) return null

    const startY = SIZES.marginY + SIZES.titleHeight + SIZES.roundLabelHeight + SIZES.boxesTopGap
    const leftPositions = layoutSide(leftRoot, byRawNumber, startY)
    const rightPositions = layoutSide(rightRoot, byRawNumber, startY)

    const numLeaves = 8
    const slotH = SIZES.boxH * 2 + SIZES.boxGap
    const width = SIZES.marginX * 2 + STAGE_ORDER.length * (SIZES.boxW + SIZES.roundGap) * 2 + SIZES.centerGap
    const height = startY + numLeaves * (slotH + SIZES.matchGap) + SIZES.marginY

    const leftColX = i => SIZES.marginX + i * (SIZES.boxW + SIZES.roundGap)
    const rightColX = i => width - SIZES.marginX - SIZES.boxW - i * (SIZES.boxW + SIZES.roundGap)
    const flagFor = name => teamByName?.[name]?.flag || null

    const boxes = []
    const connectors = []
    const matches = []

    function renderSide(positions, colX, isRight) {
      STAGE_ORDER.forEach((stage, depth) => {
        rawFixtures.filter(f => f.stage === stage).forEach(rawF => {
          const pos = positions[rawF.matchNumber]
          if (!pos) return

          const predF = byPredNumber[rawF.matchNumber]
          const x = colX(depth)
          const homeY = pos.centerY - SIZES.boxH - SIZES.boxGap / 2
          const awayY = pos.centerY + SIZES.boxGap / 2
          const homeName = predF?.homeTeam ?? rawF.homeTeam
          const awayName = predF?.awayTeam ?? rawF.awayTeam

          boxes.push({ key: `${rawF.matchNumber}-home`, x, y: homeY, label: homeName, flag: flagFor(homeName) })
          boxes.push({ key: `${rawF.matchNumber}-away`, x, y: awayY, label: awayName, flag: flagFor(awayName) })

          matches.push({
            key: `match-${rawF.matchNumber}`,
            x,
            y: homeY,
            width: SIZES.boxW,
            height: SIZES.boxH * 2 + SIZES.boxGap,
          })

          if (depth < STAGE_ORDER.length - 1) {
            const parentRaw = rawFixtures.find(f => {
              const ch = getChildren(f.matchNumber, byRawNumber)
              return ch && ch.includes(rawF.matchNumber)
            })
            if (parentRaw) {
              const parentPos = positions[parentRaw.matchNumber]
              if (parentPos) {
                const fromX = isRight ? x - SIZES.connectorOffset : x + SIZES.boxW + SIZES.connectorOffset
                const toX = isRight ? colX(depth + 1) + SIZES.boxW + SIZES.connectorOffset : colX(depth + 1) - SIZES.connectorOffset
                const midX = isRight ? fromX - SIZES.roundGap / 2 + SIZES.connectorOffset : fromX + SIZES.roundGap / 2 - SIZES.connectorOffset
                connectors.push({
                  key: `${rawF.matchNumber}-conn`,
                  x1: fromX, y1: pos.centerY, x2: toX, y2: parentPos.centerY, midX,
                })
              }
            }
          }
        })
      })
    }

    renderSide(leftPositions, leftColX, false)
    renderSide(rightPositions, rightColX, true)

    const finalPred = byPredNumber[finalRaw.matchNumber]
    const finalX = (width - SIZES.boxW) / 2
    const finalY = leftPositions[leftRoot]?.centerY ?? height / 2
    const finalHomeName = finalPred?.homeTeam ?? finalRaw.homeTeam
    const finalAwayName = finalPred?.awayTeam ?? finalRaw.awayTeam
    boxes.push({ key: 'final-home', x: finalX, y: finalY - SIZES.boxH - SIZES.boxGap / 2, label: finalHomeName, flag: flagFor(finalHomeName) })
    boxes.push({ key: 'final-away', x: finalX, y: finalY + SIZES.boxGap / 2, label: finalAwayName, flag: flagFor(finalAwayName) })

    matches.push({
      key: 'match-final',
      x: finalX,
      y: finalY - SIZES.boxH - SIZES.boxGap / 2,
      width: SIZES.boxW,
      height: SIZES.boxH * 2 + SIZES.boxGap,
    })

    if (leftPositions[leftRoot]) {
      const fromX = leftColX(STAGE_ORDER.length - 1) + SIZES.boxW + SIZES.connectorOffset
      connectors.push({
        key: 'final-conn-left',
        x1: fromX, y1: leftPositions[leftRoot].centerY,
        x2: finalX - SIZES.connectorOffset, y2: finalY,
        midX: fromX + SIZES.centerGap / 4 - SIZES.connectorOffset,
      })
    }
    if (rightPositions[rightRoot]) {
      const fromX = rightColX(STAGE_ORDER.length - 1) - SIZES.connectorOffset
      connectors.push({
        key: 'final-conn-right',
        x1: fromX, y1: rightPositions[rightRoot].centerY,
        x2: finalX + SIZES.boxW + SIZES.connectorOffset, y2: finalY,
        midX: fromX - SIZES.centerGap / 4 + SIZES.connectorOffset,
      })
    }

    let thirdPlace = null
    if (thirdRaw) {
      const thirdPred = byPredNumber[thirdRaw.matchNumber]
      const thirdY = finalY + slotH * 2
      const homeName = thirdPred?.homeTeam ?? thirdRaw.homeTeam
      const awayName = thirdPred?.awayTeam ?? thirdRaw.awayTeam
      thirdPlace = { x: finalX, labelY: thirdY - 12 }
      boxes.push({ key: 'third-home', x: finalX, y: thirdY, label: homeName, flag: flagFor(homeName) })
      boxes.push({ key: 'third-away', x: finalX, y: thirdY + SIZES.boxH + SIZES.boxGap, label: awayName, flag: flagFor(awayName) })

      matches.push({
        key: 'match-third',
        x: finalX,
        y: thirdY,
        width: SIZES.boxW,
        height: SIZES.boxH * 2 + SIZES.boxGap,
      })

      const thirdCenterY = thirdY + SIZES.boxH + SIZES.boxGap / 2
      const [srcA, srcB] = getChildren(thirdRaw.matchNumber, byRawNumber) ?? []
        ;[srcA, srcB].forEach((matchNumber, i) => {
          const pos = leftPositions[matchNumber] ?? rightPositions[matchNumber]
          if (!pos) return
          const isRightSrc = rightPositions[matchNumber] != null
          const fromX = isRightSrc ? rightColX(STAGE_ORDER.length - 1) - SIZES.connectorOffset : leftColX(STAGE_ORDER.length - 1) + SIZES.boxW + SIZES.connectorOffset
          const toX = isRightSrc ? finalX + SIZES.boxW + SIZES.connectorOffset : finalX - SIZES.connectorOffset
          connectors.push({
            key: `third-conn-${i}`,
            x1: fromX, y1: pos.centerY,
            x2: toX, y2: thirdCenterY,
            midX: isRightSrc ? fromX - SIZES.centerGap / 4 - SIZES.connectorOffset + 32 : fromX + SIZES.centerGap / 4 - 32 + SIZES.connectorOffset,
          })
        })
    }

    const stageLabelPositions = STAGE_LABELS.map((label, i) => ({
      label,
      leftX: leftColX(i) + SIZES.boxW / 2,
      rightX: rightColX(i) + SIZES.boxW / 2,
    }))

    return {
      width,
      height,
      matches,
      boxes,
      connectors,
      stageLabelPositions,
      titleY: SIZES.marginY + SIZES.titleHeight / 2,
      labelBarY: SIZES.marginY + SIZES.titleHeight,
      thirdPlace,
      finalLabelX: width / 2,
    }
  }, [rawFixtures, predictedFixtures, teamByName])
}

const BracketExportTemplate = forwardRef(function BracketExportTemplate(
  { rawFixtures, predictedFixtures, teamByName, logoSrc = '/logo.webp' },
  ref
) {
  const layout = useBracketLayout(rawFixtures, predictedFixtures, teamByName)

  if (!layout) return <div ref={ref} />

  const { width, height, boxes, matches, connectors, stageLabelPositions, titleY, labelBarY, thirdPlace, finalLabelX } = layout

  return (
    <div ref={ref} className="relative w-full " style={{ width, height }}>
      <div
        className="absolute left-1/2 flex flex-col -translate-x-1/2 items-center justify-center w-full"
        style={{ top: titleY + 20 - SIZES.logoSize / 2 }}
      >
        <div className='flex items-center justify-center gap-4'>
          {logoSrc && (
            <img
              src={logoSrc}
              crossOrigin="anonymous"
              alt=""
              className="block"
              style={{ width: SIZES.logoSize, height: SIZES.logoSize }}
            />
          )}
          <span className="font-posterHeading text-[76px] tracking-wide text-gold-500 !leading-none mt-1">FIFA WORLD CUP 2026</span>
        </div>
        <span className="font-posterMatch text-3xl tracking-wide text-gold-500 !leading-none">KNOCKOUT PREDICTIONS</span>

      </div>


      <div className="absolute left-0 right-0" style={{ top: labelBarY + 80, height: SIZES.roundLabelHeight }} />
      {stageLabelPositions.map(({ label, leftX, rightX }) => (
        <Fragment key={label}>
          <span
            className="absolute -translate-x-1/2 whitespace-nowrap text-lg font-posterMatch font-bold tracking-widest text-gold-500 border-b-2 border-gold-500"
            style={{ top: labelBarY + 80, left: leftX, lineHeight: `${SIZES.roundLabelHeight}px` }}
          >
            {label}
          </span>
          <span
            className="absolute -translate-x-1/2 whitespace-nowrap text-lg font-posterMatch font-bold tracking-widest text-gold-500 border-b-2 border-gold-500"
            style={{ top: labelBarY + 80, left: rightX, lineHeight: `${SIZES.roundLabelHeight}px` }}
          >
            {label}
          </span>
        </Fragment>
      ))}
      <span
        className="absolute -translate-x-1/2 whitespace-nowrap text-lg font-posterMatch font-bold tracking-widest text-gold-500 border-b-2 border-gold-500"
        style={{ top: labelBarY + 80, left: finalLabelX, lineHeight: `${SIZES.roundLabelHeight}px` }}
      >
        FINAL
      </span>

      <svg
        className="pointer-events-none absolute left-0 top-0"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {connectors.map(({ key, x1, y1, x2, y2, midX }) => (
          <path
            key={key}
            d={`M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`}
            fill="none"
            strokeWidth={5}
            style={{ stroke: 'rgb(var(--c-gold-500))' }}
          />
        ))}
      </svg>

      {matches.map(({ key, x, y, width, height }) => (
        <div
          key={key}
          className="absolute bg-gold-500/40 border-2 border-gold-500 shadow-2xl"
          style={{ left: x - SIZES.connectorOffset, top: y - SIZES.connectorOffset, width: width + SIZES.connectorOffset * 2, height: height + SIZES.connectorOffset * 2 }}
        />
      ))}

      {thirdPlace && (
        <span
          className="absolute text-lg font-label font-bold tracking-widest text-gold-500 border-b-2 border-gold-500"
          style={{ top: thirdPlace.labelY - 32, left: thirdPlace.x }}
        >
          3RD PLACE
        </span>
      )}

      {boxes.map(({ key, x, y, label, flag }) => (
        <div
          key={key}
          className="absolute flex items-center gap-2 border border-navy-500 bg-navy-800/50 px-2 backdrop-blur-2xl"
          style={{ left: x, top: y, width: SIZES.boxW, height: SIZES.boxH }}
        >
          {flag && (
            <img
              src={flag}
              crossOrigin="anonymous"
              alt=""
              className="block flex-none object-cover h-4 w-6 mb-0.5"
              // style={{ width: SIZES.flagW, height: SIZES.flagH }}
            />
          )}
          <span className="truncate text-lg font-posterMatch font-medium tracking-widest text-white !leading-none">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
})

export default BracketExportTemplate