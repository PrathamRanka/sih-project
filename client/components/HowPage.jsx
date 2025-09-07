"use client"
import React, { useRef, useState, useEffect } from "react"
import { motion, useScroll, AnimatePresence, useMotionValueEvent } from "framer-motion"
import { Camera, Layers, BrainCircuit, BarChartBig, LayoutDashboard } from "lucide-react"
import { clsx } from "clsx"

// --- Visual Components (No changes needed here) ---
const visuals = [
    () => (
        <div className="w-full h-full relative flex items-center justify-center">
            <motion.div 
                className="absolute w-48 h-48 rounded-full border-2 border-cyan-400/50"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="w-32 h-32 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Camera className="w-12 h-12 text-cyan-300"/>
            </div>
        </div>
    ),
    () => (
        <div className="w-full h-full relative flex items-center justify-center p-8">
            <motion.div 
                className="text-indigo-300 text-lg font-mono"
                initial={{ opacity: 0.5, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
            >
                [RAW_FRAME_01.JPEG]
            </motion.div>
            <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
        </div>
    ),
    () => (
        <div className="w-full h-full relative flex justify-around items-center">
            <motion.div 
                className="w-12 h-12 rounded-full border-2 border-cyan-400 bg-cyan-500/20"
                animate={{ x: [0, 80, 0, -80, 0], y: [-20, 20, -20, 20, -20] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="w-16 h-16 rounded-lg border-2 border-indigo-400 bg-indigo-500/20"
                animate={{ x: [0, -60, 0, 60, 0], y: [30, -30, 30, -30, 30] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    ),
    () => (
        <div className="w-full h-full flex items-end justify-center gap-4 p-8">
          <motion.div className="w-full bg-cyan-400 rounded-t-md" initial={{ height: "20%" }} animate={{ height: ["20%", "70%", "30%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="w-full bg-indigo-400 rounded-t-md" initial={{ height: "40%" }} animate={{ height: ["40%", "20%", "80%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
          <motion.div className="w-full bg-purple-400 rounded-t-md" initial={{ height: "30%" }} animate={{ height: ["30%", "60%", "20%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        </div>
    ),
];

// --- Data for steps ---
const steps = [
  { title: "1. Capture", desc: "High-resolution optical capture ensures that nothing is missed.", icon: Camera },
  { title: "2. Preprocess", desc: "Raw frames are instantly cleaned and normalized into research-ready data.", icon: Layers },
  { title: "3. Classify", desc: "AI models identify and sort species with real-time confidence scores.", icon: BrainCircuit },
  { title: "4. Visualize", desc: "Insights are transformed into clear, interactive dashboards.", icon: BarChartBig },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);

  // Set up the scroll listener on the main container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // Measure from the top of the container to the bottom
  });

  // Listen to changes in scroll progress and update the active step
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalSteps = steps.length;
    // Calculate the current step index based on scroll position
    const stepIndex = Math.min(Math.floor(latest * totalSteps), totalSteps - 1);
    setActiveStep(stepIndex);
  });

  const ActiveVisual = visuals[activeStep];

  return (
    <main className="relative bg-slate-900 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Header */}
      <div className="h-screen flex flex-col items-center justify-center">
        <Header />
      </div>

      {/* Main Timeline Section */}
      <div ref={containerRef} className="relative w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Text steps */}
          <div className="lg:col-start-1 flex flex-col">
            {steps.map((step, i) => (
              // Each step container takes up the full screen height for better spacing
              <div key={step.title} className="flex min-h-screen items-center">
                <StepItem step={step} index={i} activeStep={activeStep} />
              </div>
            ))}
          </div>

          {/* Right Column: Sticky Visual */}
          <div className="lg:col-start-2 sticky top-0 h-screen flex items-center">
            <div className="relative w-full aspect-square rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <ActiveVisual />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conclusion */}
      <div className="h-screen flex flex-col items-center justify-center">
        <Conclusion />
      </div>

      {/* Scroll Progress Bar (no changes needed) */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </main>
  );
}

// --- Header Component (no changes needed) ---
const Header = () => (
  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="text-center">
    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">From Ocean to Insight</h1>
    <p className="text-indigo-200 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">Our process transforms samples into actionable data with speed and precision.</p>
  </motion.div>
);

// --- REFACTORED StepItem Component ---
const StepItem = ({ step, index, activeStep }) => {
  // No longer needs its own observer or ref. Logic is now handled by the parent.
  const isActive = index === activeStep;

  return (
    <motion.div
        className="w-full"
        // Animate opacity and position based on whether this step is active
        animate={{ 
            opacity: isActive ? 1 : 0.4,
            y: isActive ? 0 : 10,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="inline-flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
          <step.icon className="w-6 h-6 text-white"/>
        </div>
        <h3 className="text-3xl font-semibold text-white">{step.title}</h3>
      </div>
      <p className="text-slate-300 text-lg leading-relaxed ml-16">{step.desc}</p>
    </motion.div>
  );
};

// --- Conclusion Component (no changes needed) ---
const Conclusion = () => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="text-center"
    >
        <div className="inline-block p-4 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 mb-6">
            <LayoutDashboard className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">The Final Insight</h2>
        <p className="text-indigo-200 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
            The result is a clear, interactive dashboard that turns complex data into immediate, actionable intelligence.
        </p>
    </motion.div>
);