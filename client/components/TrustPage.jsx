"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Blocks,
  Database,
  Brain,
  Monitor,
  Cpu,
  Palette,
  Github 
} from "lucide-react";

// ---------------------------------
// -- DATA
// ---------------------------------

const teamData = [
  { name: "Pratham Ranka", role: "WEB3 Engineer", domain: "Blockchain & Smart Contracts", icon: Blocks },
  { name: "Sanchita Jain", role: "Backend", domain: "APIs & Databases", icon: Database },
  { name: "Kumar Abhinandan", role: "ML & AI", domain: "Computer Vision & Deep Learning", icon: Brain },
  { name: "Avneet Bhatia", role: "Frontend", domain: "React & UI Development", icon: Monitor },
  { name: "Rushil Kapoor", role: "IoT", domain: "Embedded Systems & Sensors", icon: Cpu },
  { name: "Srishti Juneja", role: "Designer", domain: "UI/UX & Visual Design", icon: Palette },
];

const statsData = [
  { id: 1, value: 120, label: "Organisms analyzed", duration: 1500 },
  { id: 2, value: 47, label: "Data Points Collected", duration: 1200 },
  { id: 3, value: 6, label: "Core Technologies Used", duration: 900 },
];

const partnersData = ["UNESCO", "MarineLab", "OceanWatch", "BlueData"];


// ---------------------------------
// -- CUSTOM HOOK
// ---------------------------------

/**
 * A custom hook to animate a number counting up to a target value.
 * @param {number} target - The final number to count up to.
 * @param {number} [duration=1200] - The total duration of the animation in milliseconds.
 * @returns {number} The current value of the counter.
 */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return count;
}


// ---------------------------------
// -- REUSABLE UI COMPONENTS
// ---------------------------------

// A generic, styled card for consistent UI
function ContentCard({ children, className, ...motionProps }) {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

// A card for displaying an animated statistic
function StatCard({ value, label, duration }) {
  const count = useCountUp(value, duration);
  return (
    <ContentCard
      className="text-center p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-5xl font-extrabold text-indigo-400">{count.toLocaleString()}</div>
      <div className="mt-2 text-gray-300">{label}</div>
    </ContentCard>
  );
}

// A card for displaying a team member's profile
function TeamCard({ member, index }) {
  const Icon = member.icon;
  return (
    <ContentCard
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="hover:scale-105 transition-transform duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-500/20">
          <Icon className="text-indigo-400 w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-white text-lg">{member.name}</h4>
          <p className="text-sm text-indigo-300">{member.role}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-300 leading-snug">{member.domain}</p>
    </ContentCard>
  );
}


// ---------------------------------
// -- MAIN PAGE COMPONENT
// ---------------------------------

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-[#071033] to-slate-950 py-20 text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-24">
        
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Why Trust Our Vision
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We’re an interdisciplinary team with proven expertise in embedded systems, machine learning, and marine research. Transparency and reproducibility are the core of our mission.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map(stat => (
            <StatCard key={stat.id} value={stat.value} label={stat.label} duration={stat.duration} />
          ))}
        </section>
        
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Meet the Innovators</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamData.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 items-center">
          <ContentCard>
            <h3 className="text-lg font-semibold">Research Inspired By</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {partnersData.map(p => (
                <div key={p} className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
                  {p}
                </div>
              ))}
            </div>
          </ContentCard>
          <div className="text-center">
            <a
              href="https://github.com/PrathamRanka/sih-project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
            >
              <Github className="w-5 h-5" />
              <span>Explore the Codebase</span>
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}