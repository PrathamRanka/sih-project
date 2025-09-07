"use client"
import React from "react"
import { motion } from "framer-motion"
import { Backpack, BrainCircuit, BarChart3, Scaling, ArrowRight } from "lucide-react"
import { clsx } from "clsx"

// --- Enhanced Feature Configuration ---
// Now includes specific icons and layout hints for the Bento Grid.
const features = [
  {
    icon: Backpack,
    title: "Portable Field Unit",
    subtitle: "Lab-grade optics in a rugged, compact enclosure. Deploy anywhere, from research vessels to remote field sites, in minutes.",
    layout: "wide",
  },
  {
    icon: BrainCircuit,
    title: "Continuous Learning AI",
    subtitle: "Our models refine over time with verified user data, ensuring the system grows smarter and more accurate with every sample analyzed.",
    layout: "default",
  },
  {
    icon: BarChart3,
    title: "Real-time Dashboard",
    subtitle: "Instantly visualize live counts, species diversity charts, and environmental trends. One-click export for reports and collaboration.",
    layout: "default",
  },
  {
    icon: Scaling,
    title: "Low-cost Scalability",
    subtitle: "An affordable and sustainable design allows for mass deployment, creating dense sensor networks for unprecedented data coverage.",
    layout: "wide",
  },
]

// --- Main Page Component ---
export default function InnovationPage() {
  return (
    <main className="relative min-h-screen bg-slate-900 py-24 md:py-32 text-white overflow-hidden">
      {/* Starry background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{ x: ["-20%", "20%", "-20%"], y: ["-20%", "20%", "-20%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -top-48 -left-48 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: ["20%", "-20%", "20%"], y: ["20%", "-20%", "20%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <Header />
        <FeaturesGrid />
        <PhilosophySection />
      </div>
    </main>
  )
}

// --- Header Section ---
const Header = () => (
  <motion.header
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="mb-16 text-center"
  >
    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
      What Sets Our Solution Apart
    </h1>
    <p className="text-indigo-200 mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
      A compact, learning-enabled system that brings lab precision to any environment. Each feature is designed to remove friction and scale effortlessly.
    </p>
  </motion.header>
)

// --- Features Bento Grid ---
const FeaturesGrid = () => (
  <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {features.map((feature, i) => (
      <FeatureCard key={feature.title} feature={feature} i={i} />
    ))}
  </section>
)

// --- Individual Feature Card ---
function FeatureCard({ feature, i }) {
  const { icon: Icon, title, subtitle, layout } = feature
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
      className={clsx(
        "group relative p-8 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-lg overflow-hidden",
        "hover:border-indigo-500/80 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300",
        layout === "wide" ? "lg:col-span-2" : "lg:col-span-1"
      )}
    >
      {/* Animated spotlight effect on hover */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
        <Icon className="w-12 h-12 mb-4 text-indigo-400" strokeWidth={1.5} />
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <p className="text-slate-300 mt-3 leading-relaxed flex-grow">{subtitle}</p>
        <div className="mt-6 flex items-center text-sm text-indigo-300 font-medium group-hover:text-white transition-colors">
          Learn more
          <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  )
}

// --- Design Philosophy Section ---
const PhilosophySection = () => (
  <section className="mt-20">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="rounded-3xl p-10 bg-gradient-to-tr from-slate-800/80 to-slate-900/50 border border-slate-700 shadow-xl relative"
    >
      <h3 className="text-3xl font-semibold text-center">Our Design Philosophy</h3>
      <p className="mt-4 max-w-3xl mx-auto text-indigo-200 leading-relaxed text-center">
        We combine robustness with minimalism. Each component choice reduces setup time, increases reliability, or improves data quality. Our software embraces continuous learning, ensuring the system grows smarter with every use.
      </p>
    </motion.div>
  </section>
)
