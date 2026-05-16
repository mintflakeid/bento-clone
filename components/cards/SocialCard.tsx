'use client'

import { useSocialData } from '@/hooks/useSocialData'
import { useEffect, useState } from 'react'

type Variant = "twitter" | "youtube" | "figma" | "dribbble" | "instagram"
type CardMode = "small" | "thinWide" | "wide" | "tall" | "large"

type CardData = {
  icon: string
  name: string
  handle: string
  followers?: string
  subscribers?: string
  projects?: string
  shots?: string
  posts?: string
  buttonText: string
  color: string
}

type Props = {
  variant: Variant
  mode: CardMode
  data: CardData
  images?: string[]
}

export default function SocialCard({ variant, mode, data, images = [] }: Props) {
  const [displayImages, setDisplayImages] = useState<string[]>(images)
  const [displayData, setDisplayData] = useState(data)
  
  // Fetch real social data
  const { data: socialData, loading } = useSocialData(variant, data.handle, true)

  // Update display data when social data loads
  useEffect(() => {
    if (!socialData) return

    let newImages: string[] = []
    let newMetaText = ''

    if (variant === 'github' && socialData.repos) {
      // Get GitHub repo images - fallback to placeholder if no repos
      newImages = socialData.repos
        .slice(0, 6)
        .map((r: any) => `https://github-readme-stats.vercel.app/api?username=${data.handle}&theme=default&show_icons=true`)
      newMetaText = `${socialData.repos.length} repos`
    } else if (variant === 'instagram' && socialData.posts) {
      // Get Instagram post thumbnails
      newImages = socialData.posts
        .filter((p: any) => p.media_url)
        .map((p: any) => p.media_url)
        .slice(0, 6)
      newMetaText = `${socialData.posts.length} posts`
    } else if (variant === 'youtube' && socialData.videos) {
      // Get YouTube video thumbnails
      newImages = socialData.videos
        .filter((v: any) => v.snippet?.thumbnails?.medium?.url)
        .map((v: any) => v.snippet.thumbnails.medium.url)
        .slice(0, 6)
      newMetaText = socialData.channel?.statistics?.subscriberCount
        ? `${parseInt(socialData.channel.statistics.subscriberCount).toLocaleString()} subscribers`
        : ''
    } else if (variant === 'dribbble' && socialData.shots) {
      // Get Dribbble shot images
      newImages = socialData.shots
        .filter((s: any) => s.images?.normal)
        .map((s: any) => s.images.normal)
        .slice(0, 6)
      newMetaText = `${socialData.shots.length} shots`
    }

    if (newImages.length > 0) {
      setDisplayImages(newImages)
    }
    
    if (newMetaText) {
      setDisplayData(prev => ({
        ...prev,
        followers: newMetaText,
        posts: newMetaText,
        subscribers: newMetaText,
        shots: newMetaText,
      }))
    }
  }, [socialData, variant, data.handle])
  const isSmall = mode === "small"
  const isLarge = mode === "large"
  const isWide = mode === "wide"
  const isTall = mode === "tall"
  const isThinWide = mode === "thinWide"

  const metaText = (() => {
    if (variant === "twitter") return displayData.followers ?? ""
    if (variant === "youtube") return displayData.subscribers ?? ""
    if (variant === "figma") return displayData.projects ?? ""
    if (variant === "dribbble") return displayData.shots ?? ""
    if (variant === "instagram") return displayData.posts ?? ""
    return ""
  })()

  const bgGradient = (() => {
    if (variant === "twitter") return "from-blue-50 to-cyan-50"
    if (variant === "youtube") return "from-red-50 to-orange-50"
    if (variant === "figma") return "from-purple-50 to-pink-50"
    if (variant === "dribbble") return "from-pink-50 to-rose-50"
    if (variant === "instagram") return "from-purple-50 to-pink-50"
    return "from-gray-50 to-white"
  })()

  const buttonStyle = (() => {
    if (variant === "twitter") return "from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600"
    if (variant === "youtube") return "from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
    if (variant === "figma") return "from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
    if (variant === "dribbble") return "from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
    if (variant === "instagram") return "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    return "from-gray-700 to-black hover:opacity-90"
  })()

  const imagesToShow = displayImages.length > 0 ? displayImages : images

  /* =========================================================
   * ✅ SMALL MODE
   * icon -> handle -> button
   * ========================================================= */
  if (isSmall) {
    return (
      <div
        className={`
          h-full w-full rounded-2xl bg-white
          shadow-md hover:shadow-lg
          p-4 border border-gray-100
          transition-all duration-300 overflow-hidden
          bg-gradient-to-br ${bgGradient}
          flex flex-col gap-3
        `}
      >
        <div
          className={`
            w-11 h-11 rounded-2xl
            bg-gradient-to-r ${buttonStyle}
            flex items-center justify-center
            text-lg text-white shadow-md
          `}
        >
          {data.icon}
        </div>

        <div className="text-sm font-semibold text-gray-900 truncate">
          {displayData.handle}
        </div>

        <button
          className={`
            mt-auto w-fit
            px-4 py-2 text-xs font-bold
            rounded-full bg-gradient-to-r ${buttonStyle}
            text-white shadow active:scale-95
          `}
        >
          {displayData.buttonText}
        </button>
      </div>
    )
  }

  /* =========================================================
   * ✅ THIN WIDE MODE
   * ========================================================= */
  if (isThinWide) {
    return (
      <div
        className={`
          h-full w-full rounded-2xl bg-white
          shadow-md hover:shadow-lg
          px-4 py-3 border border-gray-100
          transition-all duration-300 overflow-hidden
          bg-gradient-to-br ${bgGradient}
          flex items-center justify-between gap-3
        `}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`
              w-10 h-10 rounded-2xl
              bg-gradient-to-r ${buttonStyle}
              flex items-center justify-center
              text-lg text-white shadow-md shrink-0
            `}
          >
            {data.icon}
          </div>

          <div className="min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">{displayData.name}</div>
            <div className="text-xs text-gray-600 truncate">{displayData.handle}</div>
          </div>
        </div>

        <button
          className={`
            px-4 py-2 text-xs font-bold
            rounded-full bg-gradient-to-r ${buttonStyle}
            text-white shadow active:scale-95
            whitespace-nowrap
          `}
        >
          {displayData.buttonText}
        </button>
      </div>
    )
  }

  /* =========================================================
   * ✅ WIDE MODE (NORMAL) → Bento.me style
   * Kiri: icon + name + meta + button
   * Kanan: 2×2 preview grid
   * ========================================================= */
  if (isWide) {
    return (
      <div
        className={`
          h-full w-full rounded-2xl bg-white
          shadow-md hover:shadow-lg
          p-5 border border-gray-100
          transition-all duration-300 overflow-hidden
          bg-gradient-to-br ${bgGradient}
          flex items-center justify-between gap-5
        `}
      >
        {/* LEFT */}
        <div className="flex flex-col justify-between h-full min-w-[160px]">
          <div className="flex items-start gap-3">
            <div
              className={`
                w-11 h-11 rounded-2xl
                bg-gradient-to-r ${buttonStyle}
                flex items-center justify-center
                text-lg text-white shadow-md shrink-0
              `}
            >
              {data.icon}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">
                {displayData.name}
              </div>
              <div className="text-xs text-gray-600 truncate">{displayData.handle}</div>
              {metaText && (
                <div className="text-[11px] text-gray-500 truncate mt-1">{metaText}</div>
              )}
            </div>
          </div>

          <button
            className={`
              mt-4 w-fit
              px-4 py-2 text-xs font-bold
              rounded-full
              bg-white/80 text-gray-900
              border border-black/10
              shadow-sm
              hover:bg-white
              active:scale-95
            `}
          >
            {displayData.buttonText}
          </button>
        </div>

        {/* RIGHT 2×2 GRID */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          {(imagesToShow.length > 0 ? imagesToShow.slice(0, 4) : Array.from({ length: 4 })).map((src: any, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-xl bg-black/5 border border-black/5 overflow-hidden"
            >
              {src && (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${src})` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* =========================================================
   * ✅ TALL MODE (YouTube style)
   * Header top
   * 2×2 image grid (besar)
   * CTA full width bottom
   * ========================================================= */
  if (isTall) {
    return (
      <div
        className={`
          h-full w-full rounded-2xl bg-white
          shadow-md hover:shadow-lg
          p-5 border border-gray-100
          transition-all duration-300 overflow-hidden
          bg-gradient-to-br ${bgGradient}
          flex flex-col
        `}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div
            className={`
              w-12 h-12 rounded-2xl
              bg-gradient-to-r ${buttonStyle}
              flex items-center justify-center
              text-xl text-white shadow-md shrink-0
            `}
          >
            {data.icon}
          </div>

          <div className="min-w-0">
            <div className="text-base font-bold text-gray-900 truncate">
              {data.name}
            </div>
            <div className="text-sm text-gray-600 truncate">
              {data.handle}
            </div>
          </div>
        </div>

        {/* IMAGE GRID */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(imagesToShow.length ? imagesToShow.slice(0, 4) : Array.from({ length: 4 })).map(
            (src: any, i) => (
              <div
                key={i}
                className="rounded-2xl bg-black/5 overflow-hidden aspect-square"
              >
                {src && (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                )}
              </div>
            )
          )}
        </div>

        {/* CTA */}
        <button
          className={`
            mt-auto
            w-full
            px-4 py-3
            text-sm font-bold
            rounded-full
            bg-gradient-to-r ${buttonStyle}
            text-white
            shadow
            active:scale-95
          `}
        >
          {displayData.buttonText} {variant === "youtube" ? "202" : ""}
        </button>
      </div>
    )
  }

  /* =========================================================
   * ✅ DEFAULT (LARGE MODE)
   * ========================================================= */
  const imageCount = (() => {
    if (isLarge) return 6
    return 2
  })()

  const gridCols = (() => {
    if (isLarge) return "grid-cols-3"
    return "grid-cols-2"
  })()

  return (
    <div
      className={`
        h-full w-full rounded-2xl bg-white
        shadow-md hover:shadow-lg
        p-5 border border-gray-100
        transition-all duration-300 overflow-hidden
        bg-gradient-to-br ${bgGradient}
        flex flex-col
      `}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`
              w-12 h-12 rounded-2xl
              bg-gradient-to-r ${buttonStyle}
              flex items-center justify-center
              text-xl text-white shadow-md shrink-0
            `}
          >
            {displayData.icon}
          </div>

          <div className="min-w-0">
            <div className="text-lg font-bold text-gray-900 truncate">{displayData.name}</div>
            <div className="text-sm text-gray-600 truncate">{displayData.handle}</div>
            <div className="text-xs text-gray-500 truncate">{metaText}</div>
          </div>
        </div>

        <button
          className={`
            px-3 py-2 text-xs font-bold
            rounded-lg bg-gradient-to-r ${buttonStyle}
            text-white shadow whitespace-nowrap
            active:scale-95
          `}
        >
          {displayData.buttonText}
        </button>
      </div>

      {/* IMAGES */}
      <div className="flex-1 mt-4 flex flex-col justify-end">
        <div className={`grid ${gridCols} gap-2`}>
          {imagesToShow.slice(0, imageCount).map((src, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-gray-200 shadow-sm">
              <div
                className="w-full aspect-square bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
