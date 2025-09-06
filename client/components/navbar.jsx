"use client"
import React, { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Capture", path: "/capture" },
    { name: "Contact", path: "/contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-lg bg-black/10 h-14"
          : "backdrop-blur-0 bg-transparent h-20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link
            to="/"
            className={`font-serif font-bold tracking-wide transition-all duration-500 ${
              scrolled ? "text-xl text-white" : "text-2xl text-white"
            }`}
          >
            Aqua<span className="text-indigo-400">Nexus</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative"
              >
                <Link
                  to={link.path}
                  className={`font-medium transition-colors duration-300 ${
                    scrolled
                      ? "text-gray-100 hover:text-indigo-600"
                      : "text-gray-100 hover:text-indigo-300"
                  }`}
                >
                  {link.name}
                </Link>
                {/* Underline animation */}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full font-medium shadow-md transition-all duration-500 ${
                scrolled
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-white/10 text-white border border-white/30 hover:bg-indigo-600 hover:border-transparent"
              }`}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <X className={`h-7 w-7 ${scrolled ? "text-gray-900" : "text-white"}`} />
              ) : (
                <Menu className={`h-7 w-7 ${scrolled ? "text-gray-900" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-200/50 px-6 py-4 space-y-4"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={i}
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={link.path}
                  className="block text-lg font-medium text-gray-800 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-5 py-2 rounded-full bg-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
