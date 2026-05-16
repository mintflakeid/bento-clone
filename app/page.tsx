'use client'

import { useRef } from "react"
import BentoGrid from "@/components/BentoGrid"
import { useLocalStorageState } from "@/hooks/useLocalStorageState"

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Page() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [name, setName] = useLocalStorageState("bento:name", "Your name")
  const [bio, setBio] = useLocalStorageState("bento:bio", "Your bio...")
  const [avatarBase64, setAvatarBase64] = useLocalStorageState<string | null>(
    "bento:avatar",
    null
  )

  const handlePickAvatar = () => {
    inputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const base64 = await fileToBase64(file)
    setAvatarBase64(base64)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Bento.me style width system */}
      <div
        className="
          w-full
          max-w-[min(100vw,1728px)]
          mx-auto
          p-6
          pt-12
          pb-0
          xl:p-16
        "
      >
        <div className="flex flex-col xl:flex-row items-center xl:items-stretch justify-center xl:justify-start gap-10">
          {/* LEFT PROFILE */}
          <div className="w-full max-w-[428px] xl:sticky xl:top-0 self-start">
            <div className="flex flex-col items-start">
              {/* Avatar */}
              <button
                onClick={handlePickAvatar}
                className="
                  w-[180px] h-[180px]
                  rounded-full
                  border-2 border-dashed border-gray-300
                  flex items-center justify-center
                  bg-white
                  hover:bg-gray-50
                  transition
                  overflow-hidden
                "
              >
                {avatarBase64 ? (
                  <img
                    src={avatarBase64}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="text-2xl mb-2">⬆️</div>
                    <div className="text-sm font-medium">Add Avatar</div>
                  </div>
                )}
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              {/* Name */}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  mt-10
                  text-[56px] leading-[1.05]
                  font-extrabold
                  text-gray-800
                  outline-none
                  w-full
                  placeholder:text-gray-300
                "
              />

              {/* Bio */}
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="
                  mt-4
                  text-lg
                  text-gray-400
                  outline-none
                  w-full
                  resize-none
                  placeholder:text-gray-300
                "
              />

              {/* Reset button */}
              <button
                onClick={() => {
                  localStorage.removeItem("bento:name")
                  localStorage.removeItem("bento:bio")
                  localStorage.removeItem("bento:avatar")
                  localStorage.removeItem("bento:cards")
                  localStorage.removeItem("bento:gridLayout")
                  window.location.reload()
                }}
                className="
                  mt-6
                  px-4 py-2
                  text-sm font-semibold
                  rounded-lg
                  border border-gray-200
                  hover:bg-gray-50
                  transition
                "
              >
                Reset All
              </button>
            </div>
          </div>

          {/* RIGHT GRID */}
          <div className="w-full min-w-0 flex justify-end">
            <div className="w-full max-w-[1100px]">
              <BentoGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
