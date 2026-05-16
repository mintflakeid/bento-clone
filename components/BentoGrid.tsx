'use client'

import GridLayout, { Layout } from "react-grid-layout"
import { useEffect, useMemo, useState, useCallback } from "react"
import SocialCard from "@/components/cards/SocialCard"
import { useLocalStorageState } from "@/hooks/useLocalStorageState"

/* ================= TYPES ================= */
type Variant = "twitter" | "youtube" | "figma" | "dribbble" | "instagram"
type CardMode = "small" | "thinWide" | "wide" | "tall" | "large"

type CardItem = {
  id: string
  variant: Variant
  mode: CardMode
}

/* ✅ Bento feel: banyak kolom */
const COLS = 16

/* ================== VERSIONING RESET ==================
   Kalau kamu ubah preset size, naikkin VERSION biar layout reset otomatis
======================================================== */
const VERSION = 2
const LS_KEY_LAYOUT = `bento:gridLayout:v${VERSION}`
const LS_KEY_CARDS = `bento:cards:v${VERSION}`

/* ================= SIZE PRESETS ================= */
const SIZE_PRESETS: {
  w: number
  h: number
  label: string
  mode: CardMode
}[] = [
  // ✅ lebih kecil biar ga “gede banget”
  { w: 4, h: 4, label: "Small", mode: "small" },

  // ✅ bar tipis panjang
  { w: 8, h: 2, label: "Thin", mode: "thinWide" },

  { w: 8, h: 4, label: "Wide", mode: "wide" },
  { w: 4, h: 8, label: "Tall", mode: "tall" },
  { w: 8, h: 8, label: "Large", mode: "large" },
]

/* ================= DATA ================= */
const CARD_DATA: Record<Variant, any> = {
  twitter: {
    icon: "🐦",
    name: "Twitter",
    handle: "@mintflake",
    followers: "1.2K Followers",
    buttonText: "Follow",
    color: "from-blue-400 to-blue-600",
  },
  youtube: {
    icon: "▶️",
    name: "YouTube",
    handle: "Mintflake Studio",
    subscribers: "12.5K Subscribers",
    buttonText: "Subscribe",
    color: "from-red-500 to-red-700",
  },
  figma: {
    icon: "🎨",
    name: "Figma",
    handle: "@mintflake",
    projects: "24 Projects",
    buttonText: "Follow",
    color: "from-purple-500 to-pink-600",
  },
  dribbble: {
    icon: "🏀",
    name: "Dribbble",
    handle: "mintflake.id",
    shots: "48 Shots",
    buttonText: "Follow",
    color: "from-pink-500 to-rose-600",
  },
  instagram: {
    icon: "📸",
    name: "Instagram",
    handle: "mintflake.id",
    posts: "476 Posts",
    buttonText: "Follow",
    color: "from-purple-600 to-pink-500",
  },
}

/* ================= IMAGES ================= */
const designImages = [
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1561070791-4c9b95a9e2a9?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=400&h=300&fit=crop&auto=format",
]

const tshirtImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=400&h=300&fit=crop&auto=format",
]

const artImages = [
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=400&h=300&fit=crop&auto=format",
]

const getImagesForVariant = (variant: Variant) => {
  switch (variant) {
    case "twitter":
      return designImages
    case "youtube":
      return tshirtImages
    case "figma":
      return designImages
    case "dribbble":
      return artImages
    case "instagram":
      return designImages
    default:
      return []
  }
}

/* ================= DOCK ICON ================= */
function SizeIcon({ w, h, active }: { w: number; h: number; active: boolean }) {
  const base = `block rounded-[6px] border ${active ? "border-black" : "border-white/90"}`
  const scale = 2

  const ww = Math.max(3, Math.round(w / scale))
  const hh = Math.max(3, Math.round(h / scale))

  return <span className={`${base}`} style={{ width: ww * 4, height: hh * 4 }} />
}

export default function BentoGrid() {
  const [width, setWidth] = useState(1200)
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  /* ✅ SAVED CARD CONTENT */
  const [cards, setCards] = useLocalStorageState<CardItem[]>(LS_KEY_CARDS, [
    { id: "card1", variant: "twitter", mode: "small" },
    { id: "card2", variant: "youtube", mode: "large" },
    { id: "card3", variant: "figma", mode: "tall" },
    { id: "card4", variant: "dribbble", mode: "wide" },
    { id: "card5", variant: "instagram", mode: "large" },
  ])

  /* ✅ SAVED GRID LAYOUT */
  const [gridLayout, setGridLayout] = useLocalStorageState<Layout[]>(LS_KEY_LAYOUT, [
    { i: "card4", x: 0, y: 0, w: 7, h: 4 },
    { i: "card1", x: 8, y: 0, w: 3, h: 3 },   // ✅ small jadi lebih kecil
    { i: "card2", x: 11, y: 0, w: 8, h: 8 },
    { i: "card3", x: 0, y: 4, w: 4, h: 7 },
    { i: "card5", x: 8, y: 4, w: 8, h: 8 },
  ])

  /* ================= RESPONSIVE WIDTH ================= */
  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById("bento-grid-container")
      if (container) setWidth(container.clientWidth)
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  /* ✅ Bento spacing (lebih renggang) */
  const marginX = 36
  const marginY = 36
  const paddingX = 36
  const paddingY = 36

  /* ✅ Square cells */
  const colWidth = useMemo(() => {
    return Math.floor((width - marginX * (COLS - 1) - paddingX * 2) / COLS)
  }, [width])

  const rowHeight = colWidth

  /* ================= CHANGE SIZE + MODE ================= */
  const handleSizeChange = useCallback(
    (cardId: string, preset: typeof SIZE_PRESETS[number]) => {
      setCards(prev =>
        prev.map(c => (c.id === cardId ? { ...c, mode: preset.mode } : c))
      )

      setGridLayout(prev =>
        prev.map(l => {
          if (l.i !== cardId) return l
          return {
            ...l,
            w: preset.w,
            h: preset.h,
            x: Math.min(COLS - preset.w, l.x),
            y: Math.max(0, l.y),
          }
        })
      )
    },
    [setCards, setGridLayout]
  )

  /* ================= LAYOUT CHANGE ================= */
  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      setGridLayout(
        newLayout.map(l => ({
          ...l,
          x: Math.round(l.x),
          y: Math.round(l.y),
          w: Math.round(l.w),
          h: Math.round(l.h),
        }))
      )
    },
    [setGridLayout]
  )

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
    setHoveredCardId(null)
  }, [])

  const handleDragStop = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handlePresetClick = useCallback(
    (e: React.MouseEvent, cardId: string, preset: typeof SIZE_PRESETS[number]) => {
      e.preventDefault()
      e.stopPropagation()
      handleSizeChange(cardId, preset)
    },
    [handleSizeChange]
  )

  return (
    <div id="bento-grid-container" className="w-full">
      <div className="relative">
        <GridLayout
          className="layout-grid"
          layout={gridLayout}
          width={width}
          cols={COLS}
          rowHeight={rowHeight}
          margin={[marginX, marginY]}
          containerPadding={[paddingX, paddingY]}
          maxRows={80}
          isResizable={false}
          isDraggable={true}
          isBounded={false}
          compactType="vertical"
          preventCollision={false}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          onLayoutChange={handleLayoutChange}
          draggableCancel=".preset-button, .preset-container"
        >
          {gridLayout.map(l => {
            const card = cards.find(c => c.id === l.i)
            if (!card) return null

            const data = CARD_DATA[card.variant]
            const images = getImagesForVariant(card.variant)

            return (
              <div
                key={card.id}
                className="relative group"
                onMouseEnter={() => !isDragging && setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <div className="h-full">
                  <SocialCard
                    variant={card.variant}
                    mode={card.mode}
                    data={data}
                    images={images}
                  />
                </div>

                {/* Dock */}
                {hoveredCardId === card.id && !isDragging && (
                  <div
                    className="
                      absolute -bottom-7 left-1/2
                      -translate-x-1/2
                      z-50
                      preset-container
                    "
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="
                        flex items-center gap-2
                        rounded-2xl bg-black/90
                        px-2 py-2
                        shadow-2xl
                        border border-white/10
                        backdrop-blur-md
                      "
                    >
                      {SIZE_PRESETS.map(preset => {
                        const active = l.w === preset.w && l.h === preset.h
                        return (
                          <button
                            key={preset.label}
                            onClick={(e) => handlePresetClick(e, card.id, preset)}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                            className={`
                              preset-button
                              relative
                              w-9 h-9
                              rounded-xl
                              flex items-center justify-center
                              transition-all duration-200
                              ${active ? "bg-white" : "bg-transparent hover:bg-white/10"}
                            `}
                            title={preset.label}
                          >
                            <SizeIcon w={preset.w} h={preset.h} active={active} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </GridLayout>
      </div>
    </div>
  )
}
