"use client"
import React from "react"
import { motion } from "framer-motion"

const features = [
  {
    title: "Portable Field Unit",
    subtitle: "Lab-grade optics in a rugged, compact enclosure that fits into a backpack.",
    accent: "Portability",
  },
  {
    title: "Continuous Learning",
    subtitle: "Models refine over time with verified user data and expert feedback.",
    accent: "Adaptive AI",
  },
  {
    title: "Real-time Dashboard",
    subtitle: "Live counts, species diversity charts, and one-click exportable reports.",
    accent: "Operational Insights",
  },
  {
    title: "Low-cost Scalability",
    subtitle: "Affordable design for mass deployment, built for long-term sustainability.",
    accent: "Economical",
  },
]

function FeatureCard({ f, i }) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.04 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: i * 0.1 }}
      className="relative rounded-2xl p-8 bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-indigo-500/30 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-indigo-400">{f.accent}</div>
          <h3 className="mt-2 text-2xl font-semibold text-white">{f.title}</h3>
          <p className="text-indigo-100 mt-3 leading-relaxed">{f.subtitle}</p>
        </div>
        <div className="ml-4 flex items-center">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-inner group-hover:scale-110 transition-transform duration-300">
            {f.title.split(" ").map(t => t[0]).slice(0, 2)}
          </div>
        </div>
      </div>
      <motion.div
        whileHover={{ x: 6 }}
        className="mt-6 text-sm text-indigo-300 cursor-pointer"
      >
        Read more →
      </motion.div>

      {/* Glow effect */}
      <div className="absolute -z-10 inset-0 flex justify-center">
        <div className="w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  )
}

export default function InnovationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#071033] to-[#0b1226] py-24 text-white relative overflow-hidden">
      {/* Floating gradient orbs in background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-1/2 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-white bg-clip-text text-transparent">
            What Sets Our Innovation Apart
          </h1>
          <p className="text-indigo-200 mt-6 max-w-3xl mx-auto leading-relaxed">
            A compact, learning-enabled system that brings lab precision to field deployments.  
            Every feature is designed to remove friction, empower researchers, and scale effortlessly across environments.
          </p>
        </motion.header>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </section>

        {/* Philosophy Section */}
        <section className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-10 bg-gradient-to-tr from-indigo-900 to-purple-900 text-white shadow-xl relative overflow-hidden"
          >
            <h3 className="text-3xl font-semibold">Our Design Philosophy</h3>
            <p className="mt-4 max-w-3xl text-indigo-200 leading-relaxed">
              We combine robustness with minimalism. Each hardware choice follows a simple rule: it must reduce setup time, increase reliability, or improve the quality of collected data.  
              On the software side, our models embrace continuous learning, evolving with every new dataset, ensuring the system grows smarter with use.
            </p>

            {/* subtle glowing stripe */}
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60"
            />
          </motion.div>
        </section>
      </div>
    </main>
  )
}
