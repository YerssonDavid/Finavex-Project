"use client"

import { useEffect, useState } from "react"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float-orb"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float-orb"
        style={{ animationDelay: "5s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float-orb"
        style={{ animationDelay: "10s" }}
      />

      <TwinklingStars />

      <ShootingStar />

      <Comets />
    </div>
  )
}

function TwinklingStars() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([])

  useEffect(() => {
    // Generate 50 random stars across the screen
    const generatedStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      delay: Math.random() * 5, // random delay between 0-5s
      size: Math.random() * 2 + 1, // size between 1-3px
    }))
    setStars(generatedStars)
  }, [])

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-foreground rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
        />
      ))}
    </>
  )
}

function ShootingStar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(true)
      setTimeout(() => setShow(false), 2000)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  if (!show) return null

  return (
    <div className="absolute top-0 right-0 w-1 h-1">
      <div className="animate-shooting-star">
        <div className="w-2 h-2 bg-foreground rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
        <div className="absolute top-0 left-0 w-20 h-0.5 bg-gradient-to-r from-foreground to-transparent -rotate-45 origin-left" />
      </div>
    </div>
  )
}

function Comets() {
  return (
    <>
      {/* Comet 1 - White - Top left to bottom right */}
      <div className="absolute top-0 left-0 w-1 h-1 animate-comet-1">
        <div className="w-1.5 h-1.5 bg-white/60 rounded-full shadow-[0_0_8px_1px_rgba(255,255,255,0.4)]" />
        <div className="absolute top-0 left-0 w-16 h-0.5 bg-gradient-to-r from-white/50 to-transparent rotate-45 origin-left" />
      </div>

      {/* Comet 2 - White - Right middle to bottom left */}
      <div className="absolute top-0 right-0 w-1 h-1 animate-comet-2">
        <div className="w-1.5 h-1.5 bg-white/60 rounded-full shadow-[0_0_8px_1px_rgba(255,255,255,0.4)]" />
        <div className="absolute top-0 left-0 w-16 h-0.5 bg-gradient-to-r from-white/50 to-transparent -rotate-[30deg] origin-left" />
      </div>

      {/* Comet 3 - Blue - Top center to bottom right */}
      <div className="absolute top-0 left-1/2 w-1 h-1 animate-comet-3">
        <div className="w-1.5 h-1.5 bg-blue-400/50 rounded-full shadow-[0_0_8px_1px_rgba(96,165,255,0.3)]" />
        <div className="absolute top-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-400/40 to-transparent rotate-[35deg] origin-left" />
      </div>
    </>
  )
}
