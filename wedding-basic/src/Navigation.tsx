'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => setIsMenuOpen(false);

  const navItems = [
    { label: 'Trang chủ', href: '#hero' },
    { label: 'Ngày cưới', href: '#wedding-day' },
    { label: 'Thông tin', href: '#event-details' },
    { label: 'Album', href: '#album' },
    { label: 'RSVP', href: '#rsvp' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={
        scrolled
          ? {
              background: 'rgba(255,250,252,0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,180,200,0.25)',
              boxShadow: '0 4px 24px rgba(255,100,140,0.08)',
            }
          : {}
      }
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Names */}
          <a href="#hero" className="group flex items-center gap-2">
            <span className="font-script text-2xl text-petal-600 group-hover:text-petal-700 transition-colors">
              ♡
            </span>
            <span className="font-display text-xl text-petal-800 tracking-wide">
              Wedding
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-petal-700 hover:text-petal-900 font-sans text-sm font-medium transition-colors group"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-petal-400 rounded-full group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Mobile button */}
          <button
            className="md:hidden text-petal-700 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(255,250,252,0.92)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,180,200,0.2)',
            }}
          >
            <div className="px-6 py-5 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="block text-petal-700 hover:text-petal-900 font-sans text-base font-medium py-1.5 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
