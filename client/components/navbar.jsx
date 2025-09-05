"use client"
import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            AquaNexus
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/about" className="text-gray-700 hover:text-blue-600">About Us</Link>
            <Link to="/capture" className="text-gray-700 hover:text-blue-600">Capture</Link>
            
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-2">
          <Link to="/about" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
            About Us
          </Link>
          <Link to="/capture" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
            Capture
          </Link>
          
        </div>
      )}
    </nav>
  )
}
