import { useEffect, useRef, useState } from 'react'
import { X, SlidersHorizontal, Download, Plus, Minus, Maximize } from 'lucide-react'
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch'
import BracketCanvasFrame, { ASPECT_RATIO } from './BracketCanvasFrame'
import Drawer from '@components/ui/Drawer'
import { exportBracketPNG } from '@utils/exportBracket'

const TOOLBAR_H = 56
const PAGE_PADDING = 32

function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls()
  return (
    <div className="absolute bottom-4 right-4 z-10 flex items-center border border-navy-600 bg-navy-900/30 backdrop-blur-xl">
      <button onClick={() => zoomOut()} className="p-2 text-content-muted transition-colors hover:text-gold-400" title="Zoom out">
        <Minus size={14} />
      </button>
      <button onClick={() => resetTransform()} className="border-l border-r border-navy-600 p-2 text-content-muted transition-colors hover:text-gold-400" title="Fit to screen">
        <Maximize size={14} />
      </button>
      <button onClick={() => zoomIn()} className="p-2 text-content-muted transition-colors hover:text-gold-400" title="Zoom in">
        <Plus size={14} />
      </button>
    </div>
  )
}

export default function BracketPreviewModal({
  open,
  onClose,
  rawFixtures,
  predictedFixtures,
  teamByName,
  bg,
  onBgChange,
}) {
  const canvasRef = useRef(null)
  const [canvasWidth, setCanvasWidth] = useState(() => window.innerWidth - PAGE_PADDING)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const compute = () => {
      const availW = window.innerWidth - PAGE_PADDING
      const availH = window.innerHeight - TOOLBAR_H - PAGE_PADDING
      setCanvasWidth(Math.round(Math.min(availW, availH * ASPECT_RATIO)))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleExport = (label, width) => {
    exportBracketPNG(canvasRef.current, width, `wc26-bracket-${label}.png`)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-navy-950">
      <div className="absolute left-0 right-0 top-0 z-10 flex flex-row-reverse items-center justify-between px-4 py-3">
        {/* <span className="text-xs font-bold font-label uppercase tracking-widest text-content-muted">
          Bracket Preview
        </span> */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 p-1.5 font-bold uppercase tracking-widest text-content-muted transition-colors hover:text-gold-400 bg-navy-800/50 backdrop-blur-xl border border-navy-600"
          >
            <SlidersHorizontal size='1em' /> <span className='hidden md:inline text-xs'>Customize</span>
          </button>
          <button onClick={onClose} className="p-1.5 text-content-muted transition-colors hover:text-gold-400 bg-navy-800/50 backdrop-blur-xl border border-navy-600">
            <X size='1em' />
          </button>
        </div>
       
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('1080p', 1920)}
            className="flex items-center gap-1.5 bg-gold-500 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-navy-950 transition-colors hover:bg-gold-400"
          >
            <Download size='1em' /> <span className='hidden md:inline'>Export HD</span> <span className='inline md:hidden'>HD</span> 
          </button>
          <button
            onClick={() => handleExport('2k', 2560)}
            className="flex items-center gap-1.5 bg-gold-500 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-navy-950 transition-colors hover:bg-gold-400"
          >
            <Download size='1em' /> <span className='hidden md:inline'>Export 2K</span> <span className='inline md:hidden'>2K</span>
          </button>
          <button
            onClick={() => handleExport('4k', 3840)}
            className="flex items-center gap-1.5 bg-gold-500 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-navy-950 transition-colors hover:bg-gold-400"
          >
            <Download size='1em' /> <span className='hidden md:inline'>Export 4K</span> <span className='inline md:hidden'>4K</span> 
          </button>
         
        </div>
      </div>

      <div className="absolute inset-0 flex-1 overflow-hidden cursor-grab">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit
          limitToBounds={true}
          wheel={{ step: 0.005}}
          doubleClick={{ disabled: true }}
        >
          <ZoomControls />
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <BracketCanvasFrame
              ref={canvasRef}
              width={canvasWidth}
              rawFixtures={rawFixtures}
              predictedFixtures={predictedFixtures}
              teamByName={teamByName}
              bgColor={bg.color}
              bgImage={bg.image}
              bgOpacity={bg.opacity}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Customize Background">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold font-label uppercase tracking-wider text-content-muted mb-1">
              Background color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bg.color}
                onChange={e => onBgChange({ ...bg, color: e.target.value })}
                className="h-8 w-10 border border-navy-600 bg-navy-800"
              />
              <input
                type="text"
                value={bg.color}
                onChange={e => onBgChange({ ...bg, color: e.target.value })}
                className="flex-1 border border-navy-600 bg-navy-800 px-2 py-1.5 text-xs text-content-secondary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold font-label uppercase tracking-wider text-content-muted mb-1">
              Background image
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer truncate border border-navy-600 bg-navy-800 px-2 py-1.5 text-xs text-content-secondary transition-colors hover:border-gold-500 hover:text-gold-400">
                Choose file…
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => onBgChange({ ...bg, image: reader.result })
                    reader.readAsDataURL(file)
                  }}
                />
              </label>
              {bg.image && (
                <button onClick={() => onBgChange({ ...bg, image: '' })} title="Remove" className="text-content-muted hover:text-gold-400">
                  <X size='1em' />
                </button>
              )}
            </div>
            {bg.image && <img src={bg.image} alt="" className="mt-2 h-16 w-auto border border-navy-600 object-cover" />}
          </div>

          <div>
            <label className="text-xs font-bold font-label uppercase tracking-wider text-content-muted mb-1">
              Image opacity - {Math.round(bg.opacity * 100)}%
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={bg.opacity}
              onChange={e => onBgChange({ ...bg, opacity: parseFloat(e.target.value) })}
              className="w-full accent-gold-500"
            />
          </div>
        </div>
      </Drawer>
    </div>
  )
}