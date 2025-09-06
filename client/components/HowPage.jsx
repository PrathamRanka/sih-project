"use client"
import React from "react"
import { motion } from "framer-motion"

const steps = [
  {
    title: "Capture",
    desc: "Our system begins with high-resolution optical capture. The microscope, built with field-grade lenses and a compact camera module, collects crisp frames even in challenging marine environments. This ensures that nothing—from tiny plankton to fragile organisms—gets missed.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor">
        <path d="M3 7h4l3-4h4l3 4h4v11a 1 1 0 0 1-1 1H4a 1 1 0 0 1-1-1V7z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: "Preprocess",
    desc: "Raw frames are instantly cleaned and enhanced on-device. Noise is removed, lighting variations are normalized, and contrast is boosted—turning raw snapshots into research-ready data. This happens in milliseconds, right where the data is collected.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor">
        <path d="M12 2v20M2 12h20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: "Classify",
    desc: "Our AI models step in next. Trained on diverse plankton datasets, the models identify species with real-time confidence scores. The system adapts over time too, improving accuracy as more samples are collected—almost like it keeps learning from the ocean itself.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8v8M8 12h8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: "Count & Visualize",
    desc: "The insights don’t stay buried in code. Everything—counts, patterns, species diversity—is transformed into clear dashboards and exportable reports. Researchers can see trends over time, compare sites, and even share live updates with their teams.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor">
        <path d="M3 3v18h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 12h3v5H7zM12 7h3v10h-3zM17 4h3v13h-3z" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
]

export default function HowPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#071033] to-[#0b1226] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-serif font-bold mb-20 text-center leading-tight"
        >
          From Ocean to Insight: Our Process
        </motion.h1>

        {/* Horizontal timeline */}
        <div className="relative">
          {/* connecting line */}
          <div className="absolute top-16 left-0 right-0 h-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 rounded-full" />

          <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-8 relative">
            {steps.map((s, idx) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative flex-1 text-center md:text-left group"
              >
                {/* Marker */}
                <div className="w-20 h-20 mx-auto md:mx-0 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                  {s.icon}
                </div>

                <h3 className="mt-8 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-gray-300 leading-relaxed max-w-sm mx-auto md:mx-0">
                  {s.desc}
                </p>

                {/* Glow effect */}
                <div className="absolute -z-10 inset-0 flex justify-center md:justify-start">
                  <div className="w-40 h-40 rounded-full bg-purple-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
