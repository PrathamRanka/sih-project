"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  Blocks,     // for Web3
  Database,   // for Backend
  Brain,      // for ML & AI
  Monitor,    // for Frontend
  Cpu,        // for IoT
  Palette,    // for Designer
  Github      // for repo link
} from "lucide-react"

/* Count-up hook */
function useCount(target, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    const initial = 0
    const diff = target - initial
    const step = (timestamp) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.floor(initial + diff * progress))
      if (progress < 1) window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step)
  }, [target, duration])
  return value
}

const partners = ["UNESCO", "MarineLab", "OceanWatch", "BlueData"]

const team = [
  { name: "Pratham Ranka", role: "WEB3 Engineer", domain: "Blockchain & Smart Contracts", icon: Blocks },
  { name: "Sanchita Jain", role: "Backend", domain: "APIs & Databases", icon: Database },
  { name: "Kumar Abhinandan", role: "ML & AI", domain: "Computer Vision & Deep Learning", icon: Brain },
  { name: "Avneet Bhatia", role: "Frontend", domain: "React & UI Development", icon: Monitor },
  { name: "Rushil Kapoor", role: "IoT", domain: "Embedded Systems & Sensors", icon: Cpu },
  { name: "Srsihti", role: "Designer", domain: "UI/UX & Visual Design", icon: Palette },
]

export default function TrustPage() {
  const counted1 = useCount(120, 1500)
  // const counted2 = useCount(47, 1200)
  // const counted3 = useCount(6, 900)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#071033] to-[#0b1226] py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-20">
        
        {/* Intro */}
        <section className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Why trust us
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We’re an interdisciplinary team with proven expertise in embedded systems, ML, and marine research. 
            Transparency, reproducibility, and trust are at the core of our mission.
          </p>
        </section>

        {/* Counters */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{opacity:0, y:8}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center border border-white/20">
            <div className="text-5xl font-extrabold text-indigo-400">{counted1.toLocaleString()}</div>
            <div className="mt-2 text-gray-300">Organisms analyzed</div>
          </motion.div>
        </section>

        {/* Team Section */}
        <section>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Meet our team</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {team.map((member, i) => {
              const Icon = member.icon
              return (
                <motion.div
                  key={i}
                  initial={{opacity:0, y:16}}
                  whileInView={{opacity:1, y:0}}
                  viewport={{once:true}}
                  transition={{duration:0.6, delay:i*0.1}}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500/20">
                      <Icon className="text-indigo-400 w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">{member.name}</div>
                      <div className="text-sm text-indigo-300">{member.role}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-300 leading-snug">{member.domain}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Codebase Link */}
        <section className="text-center">
          <a
            href="https://github.com/PrathamRanka/sih-project"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Github className="w-5 h-5" /> See the Codebase
          </a>
        </section>

        {/* Partners + Testimonials */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white">Research & Inspired by</h4>
            <div className="mt-4 flex flex-wrap gap-3">
              {partners.map(p => (
                <div key={p} className="px-3 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">{p}</div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h5 className="font-medium text-white">What researchers say</h5>
            <motion.blockquote
              initial={{opacity:0}}
              whileInView={{opacity:1}}
              viewport={{once:true}}
              className="mt-3 text-sm text-gray-300 italic"
            >
              “High fidelity in field conditions — the system saved our lab weeks of work.”
            </motion.blockquote>
          </div>
        </section>
      </div>
    </main>
  )
}
