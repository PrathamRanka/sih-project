"use client"
import React from "react"
import { motion } from "framer-motion"

export default function ProblemPage() {
  const highlightWords = ["slow", "inconsistent", "inaccessible", "expensive"]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#071033] to-[#0b1226] text-white flex items-center">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-24">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left editorial column */}
          <div className="md:col-span-7 space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="font-serif text-6xl md:text-7xl leading-tight tracking-tight"
              style={{ fontVariantLigatures: "common-ligatures" }}
            >
              Problem
              <br />
              <span className="text-indigo-400">we're solving</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-200 max-w-xl"
            >
              Marine biodiversity studies and environmental monitoring are held
              back by legacy workflows: microscopes tethered to labs, manual
              annotation, and analysis pipelines that take days or weeks.
              Results are often{" "}
              <em className="not-italic text-gray-100">variable</em> and
              inaccessible to smaller research teams.
            </motion.p>

            {/* Animated keywords row */}
            <div className="flex flex-wrap gap-4 mt-6">
              {highlightWords.map((w, i) => (
                <motion.span
                  key={w}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 140 }}
                  className="px-4 py-2 rounded-full bg-white/6 backdrop-blur-sm border border-white/6 text-sm md:text-base"
                >
                  {w}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <p className="text-gray-300 max-w-2xl leading-relaxed">
                That friction prevents continuous monitoring at scale, delays
                critical environmental decisions, and keeps advanced analysis
                tools out of reach for field teams and smaller institutions.
              </p>
            </motion.div>
          </div>

          {/* Right visual column */}
          <div className="md:col-span-5 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-[360px] h-[360px] rounded-3xl overflow-hidden shadow-2xl border border-white/6"
            >
              {/* Abstract layered visuals — replace with real image or Lottie later */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#07203c_0,#021021_60%)]" />
              <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <g transform="translate(0,0)">
                  <path d="M10,200 C80,40 320,40 390,200 C320,360 80,360 10,200Z" fill="url(#g1)"/>
                </g>
              </svg>

              <div className="absolute bottom-6 left-6 text-left">
                <div className="bg-white/8 text-white/90 px-4 py-2 rounded-xl border border-white/6">
                  <div className="text-xs uppercase tracking-widest text-gray-200">Impact</div>
                  <div className="text-2xl font-semibold mt-1">Scale down lab workflows</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  )
}
