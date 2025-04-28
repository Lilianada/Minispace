"use client"

import { useEffect, useState } from "react"

interface TypewriterEffectProps {
  phrases: string[]
}

export function TypewriterEffect({ phrases }: TypewriterEffectProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const typeSpeed = 100
    const deleteSpeed = 50
    const delayBetweenPhrases = 2000

    const handleTyping = () => {
      const currentPhrase = phrases[currentPhraseIndex]

      if (isDeleting) {
        setCurrentText(currentPhrase.substring(0, currentText.length - 1))

        if (currentText.length === 0) {
          setIsDeleting(false)
          setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
        }
      } else {
        setCurrentText(currentPhrase.substring(0, currentText.length + 1))

        if (currentText.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), delayBetweenPhrases)
          return
        }
      }
    }

    const timer = setTimeout(handleTyping, isDeleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(timer)
  }, [currentText, currentPhraseIndex, isDeleting, phrases])

  return (
    <div className="text-center text-base text-muted-foreground">
      <span>{currentText}</span>
      <span className="animate-blink">|</span>
    </div>
  )
}
