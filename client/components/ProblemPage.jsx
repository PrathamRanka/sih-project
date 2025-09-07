"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion, useSpring, useMotionValue } from "framer-motion"
import { Microscope, ArrowRight } from "lucide-react"
import { clsx } from "clsx"

// ✨ NEW: Centralized data for specimens makes the component cleaner and easier to update.
const SPECIMEN_DATA = [
  { id: "a", label: "Copepod", bbox: [15, 20, 30, 35] },
  { id: "b", label: "Diatom", bbox: [70, 75, 25, 30] },
  { id: "c", label: "Algae", bbox: [60, 15, 20, 25] },
  { id: "d", label: "Larva", bbox: [25, 70, 28, 32] },
];

// --- Main Page Component ---
export default function ProblemPage() {
  const containerRef = useRef(null)
  const scrollTargetRef = useRef(null) 

  return (
    <main ref={containerRef} className="relative bg-slate-900 text-white">
      <div className="h-[200vh]" ref={scrollTargetRef}>
        <div className="sticky top-0 flex min-h-screen items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <TextContent />
              <MicroscopeVisual scrollTargetRef={scrollTargetRef} />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

// --- 1. Left Column: Text Content (No changes needed) ---
const TextContent = () => {
  return (
    <div className="space-y-6 md:space-y-8 max-w-xl">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="font-sans text-4xl md:text-5xl font-bold tracking-tight"
      >
        The Friction in Marine Analysis
        <br />
        <span className="text-indigo-400">Why Discovery is Slowing Down</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-lg text-slate-300 leading-relaxed"
      >
        Critical marine biodiversity studies are bottlenecked by legacy workflows. Lab-bound microscopes and tedious manual annotation create a massive drag on research.
      </motion.p>
      
      <CallToAction />
    </div>
  )
}

// --- 2. Right Column: The Interactive Visual (Refactored) ---
const MicroscopeVisual = ({ scrollTargetRef }) => {
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start start", "end end"],
  })
  
  // --- Animation Values ---
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1.2, 1.2, 1])
  const blur = useTransform(scrollYProgress, [0, 0.3], ["blur(8px)", "blur(0px)"])
  const annotationsOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1])
  const annotationsScale = useTransform(scrollYProgress, [0.4, 0.6], [0.8, 1])
  
  // ✨ IMPROVED: Scanner animation now includes opacity for a fade in/out effect.
  const scannerPosition = useTransform(scrollYProgress, [0.1, 0.4], ["-110%", "110%"])
  const scannerOpacity = useTransform(scrollYProgress, [0.1, 0.15, 0.35, 0.4], [0, 1, 1, 0])

  // --- Mouse Parallax Effect ---
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left - width / 2)
    mouseY.set(e.clientY - top - height / 2)
  }
  
  const handleMouseLeave = () => {
     mouseX.set(0)
     mouseY.set(0)
  }

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const parallaxX = useTransform(springX, [-200, 200], ["-15px", "15px"])
  const parallaxY = useTransform(springY, [-200, 200], ["-15px", "15px"])
  const revParallaxX = useTransform(springX, [-200, 200], ["15px", "-15px"])
  const revParallaxY = useTransform(springY, [-200, 200], ["15px", "-15px"])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ scale: shouldReduceMotion ? 1 : scale }}
      className="relative w-full aspect-square max-w-[400px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />

      <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute inset-0 flex items-center justify-center">
        <Microscope className="w-16 h-16 text-slate-500/60" strokeWidth={1.5} />
      </motion.div>
      
      <motion.div style={{ filter: shouldReduceMotion ? "blur(0px)" : blur }} className="absolute inset-0">
        <motion.div style={{ x: revParallaxX, y: revParallaxY }}>
          {/* ✨ REFACTORED: Map over data instead of hardcoding components. */}
          {SPECIMEN_DATA.map((specimen, index) => (
            <Particle key={specimen.id} index={index} bbox={specimen.bbox} />
          ))}
        </motion.div>

        <motion.div style={{ opacity: annotationsOpacity, scale: annotationsScale }}>
          {/* ✨ REFACTORED: Map over data for annotations as well. */}
          {SPECIMEN_DATA.map((specimen) => (
             <Annotation key={specimen.id} bbox={specimen.bbox} label={specimen.label} />
          ))}
        </motion.div>
      </motion.div>
      
      {/* ✨ NEW: Scanner line visualizes the "manual annotation" process. */}
      <motion.div
        style={{ y: scannerPosition, opacity: scannerOpacity }}
        className="absolute inset-x-0 h-1.5 bg-cyan-300/50 shadow-[0_0_12px_theme(colors.cyan.300)]"
      />
    </motion.div>
  )
}

// --- 3. Sub-components (No logical changes needed) ---
const Particle = ({ index, bbox }) => {
  const shouldReduceMotion = useReducedMotion()
  const initialPosition = { left: `${bbox[0]}%`, top: `${bbox[1]}%` }

  return (
    <motion.div
      style={initialPosition}
      animate={ shouldReduceMotion ? {} : {
        x: [`0%`, `${index % 2 === 0 ? 50 : -50}%`, `0%`],
        y: [`0%`, `${index % 3 === 0 ? -50 : 50}%`, `0%`],
      }}
      transition={{ duration: 5 + index * 2, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_8px_theme(colors.cyan.400)]"
    />
  )
}

const Annotation = ({ bbox, label }) => {
  const style = {
    top: `${bbox[1]}%`,
    left: `${bbox[0]}%`,
    width: `${bbox[2]}%`,
    height: `${bbox[3]}%`,
  }
  return (
    <div style={style} className="absolute border-2 border-cyan-400 rounded-md">
      <span className="absolute -top-6 left-0 text-xs text-cyan-300 bg-slate-900/50 px-1 rounded">
        {label}
      </span>
    </div>
  )
}

// --- 4. Call to Action Button (No changes needed) ---
const CallToAction = () => {
    return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          className="pt-4"
        >
          <button className={clsx(
            "group relative inline-flex items-center gap-2 px-6 py-3 overflow-hidden",
            "font-semibold text-white tracking-wide",
            "border-2 border-indigo-500/60 rounded-xl",
            "transition-all duration-300 ease-out",
            "hover:border-indigo-500/90 hover:shadow-[0_0_20px_theme(colors.indigo.500/50%)]"
          )}>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative">See the Solution</span>
            <ArrowRight className="w-5 h-5 relative transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
    )
}