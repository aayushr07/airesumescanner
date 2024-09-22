// components/Navbar.jsx

"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-4xl font-extrabold text-white tracking-wide">
              Resumelens
            </h1>
          </div>
          {/* Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/"
              className="text-white hover:bg-gray-700 hover:bg-opacity-70 px-3 py-2 rounded-md text-sm font-semibold transition duration-300"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="text-white hover:bg-gray-700 hover:bg-opacity-70 px-3 py-2 rounded-md text-sm font-semibold transition duration-300"
            >
              Features
            </Link>
            <Link
              href="/#cta"
              className="text-white hover:bg-gray-700 hover:bg-opacity-70 px-3 py-2 rounded-md text-sm font-semibold transition duration-300"
            >
              Upload Resume
            </Link>
            <Link
              href="/contacts"
              className="text-white hover:bg-gray-700 hover:bg-opacity-70 px-3 py-2 rounded-md text-sm font-semibold transition duration-300"
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 text-center py-4 transition-all duration-500">
          <Link
            href="/"
            className="block text-white hover:bg-gray-700 hover:bg-opacity-70 py-2 rounded-md text-lg font-semibold transition duration-300"
          >
            Home
          </Link>
          <Link
            href="#features"
            className="block text-white hover:bg-gray-700 hover:bg-opacity-70 py-2 rounded-md text-lg font-semibold transition duration-300"
          >
            Features
          </Link>
          <Link
            href="#cta"
            className="block text-white hover:bg-gray-700 hover:bg-opacity-70 py-2 rounded-md text-lg font-semibold transition duration-300"
          >
            Upload Resume
          </Link>
          <Link
            href="/contacts"
            className="block text-white hover:bg-gray-700 hover:bg-opacity-70 py-2 rounded-md text-lg font-semibold transition duration-300"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
