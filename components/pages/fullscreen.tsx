import { useState, useEffect } from 'react'
import Image from 'next/image'

interface FullScreenImageProps {
  src: string
  alt: string
  onClose: () => void
}

export function FullScreenImage({ src, alt, onClose }: FullScreenImageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for fade-out animation
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div className="relative w-full h-full max-w-4xl max-h-4xl">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={handleClose}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

