import { useState, useRef, useEffect } from 'react'
import { Search, Settings, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '@context/AppContext'
import { cn } from '@utils/cn'
import SettingsDrawer from '@components/settings/SettingsDrawer'
import SearchModal from '@components/search/SearchModal'

const TABS = [
  { id: 'group', label: 'Group Stage' },
  { id: 'r32', label: 'Round of 32' },
  { id: 'r16', label: 'Round of 16' },
  { id: 'finals', label: 'The Finals' },
  { id: 'predictor', label: 'Predictor' },
  { id: 'stats', label: 'Stats' },
  { id: 'stadiums', label: 'Stadiums' },
  { id: 'teams', label: 'Teams' },
]

export default function NavBar() {
  const {
    activeTab, setTab,
    searchOpen, toggleSearch,
    settingsOpen, toggleSettings,
  } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)
  const searchInputRef = useRef(null)
  const tabsRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = () => {
    const el = tabsRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  const scrollTabs = dir => tabsRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' })

  useEffect(() => {
    const el = tabsRef.current
    if (!el) return
    updateScrollState()
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const anyOpen = searchOpen || settingsOpen || mobileOpen

  const openOnly = (panel) => {
    if (panel !== 'search' && searchOpen) toggleSearch()
    if (panel !== 'settings' && settingsOpen) toggleSettings()
    if (panel !== 'menu' && mobileOpen) setMobileOpen(false)
  }

  const handleSearchClick = () => { openOnly('search'); toggleSearch() }
  const handleSettingsClick = () => { openOnly('settings'); toggleSettings() }
  const handleMenuClick = () => { openOnly('menu'); setMobileOpen(v => !v) }

  const handleTab = (id) => {
    setTab(id)
    setMobileOpen(false)
    if (searchOpen) toggleSearch()
    if (settingsOpen) toggleSettings()
  }

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (!(settingsOpen || mobileOpen)) return
    const onKey = e => {
      if (e.key !== 'Escape') return
      // if (searchOpen) toggleSearch()
      if (settingsOpen) toggleSettings()
      if (mobileOpen) setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [settingsOpen, mobileOpen, toggleSettings])

  useEffect(() => {
    if (!anyOpen) return
    function onPointerDown(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        if (searchOpen) toggleSearch()
        if (settingsOpen) toggleSettings()
        if (mobileOpen) setMobileOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [anyOpen, searchOpen, settingsOpen, mobileOpen, toggleSearch, toggleSettings])

  return (
    <header ref={navRef} className="flex-shrink-0 bg-navy-800 border-b border-navy-700 relative z-30">
      <div className="flex items-stretch h-navbar">
        <div className="flex items-center gap-2 border-r border-b border-b-navy-950/50 border-navy-700 flex-shrink-0">
          <img src="/logo.webp" className='h-full aspect-square overflow-hidden' alt="FIFA World Cup 2026" />
        </div>

        <div className="hidden lg:flex flex-1 relative min-w-0">
          {canScrollLeft && (
            <button
              onClick={() => scrollTabs(-1)}
              aria-label="Scroll tabs left"
              className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-7 backdrop-blur-[2px] bg-navy-900/40 border-b border-navy-950/50 text-gold-500 hover:text-gold-400 transition-colors"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          )}
          <nav
            ref={tabsRef}
            onScroll={updateScrollState}
            className="flex flex-1 items-stretch scroll-x border-b border-navy-950/50 overflow-x-auto"
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTab(tab.id)}
                className={cn(
                  'flex items-center px-4 h-full flex-shrink-0 gloss',
                  'font-label text-base font-semibold uppercase tracking-widest',
                  'transition-colors duration-150 border-b-2',
                  activeTab === tab.id
                    ? 'text-gold-500 border-gold-500'
                    : 'text-content-muted border-transparent hover:text-gold-400 hover:border-gold-600/50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          {canScrollRight && (
            <button
              onClick={() => scrollTabs(1)}
              aria-label="Scroll tabs right"
              className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-7 backdrop-blur-[2px] bg-navy-900/40 border-b border-navy-950/50 text-gold-500 hover:text-gold-400 transition-colors"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <div className="flex-1 flex items-center px-3 lg:hidden border-b border-navy-950/50">
          <span className="font-label text-base font-semibold uppercase tracking-widest text-gold-500">
            {TABS.find(t => t.id === activeTab)?.label}
          </span>
        </div>

        <div className="flex items-stretch border-l border-navy-900/50 flex-shrink-0">
          <button
            onClick={handleSearchClick}
            aria-label={searchOpen ? 'Close search' : 'Search'}
            className={`flex items-center justify-center aspect-square text-content-muted hover:text-gold-400 hover:bg-navy-700 transition-colors border-navy-900/50 ${searchOpen ? '' : 'border-b'}`}
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          <button
            onClick={handleSettingsClick}
            aria-label={settingsOpen ? 'Close settings' : 'Settings'}
            className={`flex items-center justify-center aspect-square text-content-muted hover:text-gold-400 hover:bg-navy-700 transition-colors border-l border-navy-900/50 ${settingsOpen ? '' : 'border-b'}`}
          >
            {settingsOpen ? <X size={18} /> : <Settings size={18} />}
          </button>
          <button
            onClick={handleMenuClick}
            aria-label="Menu"
            className={`flex items-center justify-center aspect-square text-content-muted hover:text-gold-400 hover:bg-navy-700 transition-colors border-l border-navy-900/50 lg:hidden ${mobileOpen ? 'border-b-none' : 'border-b'}`}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-navy-800 border-b border-navy-700 z-40 lg:hidden animate-slide-down">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className={cn(
                'w-full flex items-center px-5 py-5 border-b border-navy-900 last:border-0',
                'font-label text-base font-semibold uppercase tracking-widest transition-colors text-left',
                activeTab === tab.id
                  ? 'text-gold-500 bg-navy-700 border-l-2 border-l-gold-500 pl-[18px]'
                  : 'text-content-muted hover:text-gold-400 hover:bg-navy-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {searchOpen && <SearchModal />}

      <SettingsDrawer isOpen={settingsOpen} onClose={toggleSettings} />
    </header>
  )
}