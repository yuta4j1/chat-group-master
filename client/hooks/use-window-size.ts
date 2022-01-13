import { useState, useEffect } from 'react'

// 現在の画面サイズの幅、高さを返すフック
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number
    height: number
  }>({ width: window.innerWidth, height: window.innerHeight })
  const handleResize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}
