'use client';
import { useState, useEffect, useRef } from 'react';

type NavItem = {
  id: number;
  label: string;
  index: number;
};

interface GlassNavbarProps {
  items: NavItem[];
  activeIndex: number;
  onItemClick: (index: number, item: NavItem) => void;
}

const GlassNavbar = ({ items, activeIndex, onItemClick }: GlassNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check scroll position from the main container - optimized with throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const container = document.querySelector('[data-scroll-container]') as HTMLElement;
          if (container) {
            setIsScrolled(container.scrollTop > 50);
          } else {
            setIsScrolled(window.scrollY > 50);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Listen to both container and window scroll
    const container = document.querySelector('[data-scroll-container]') as HTMLElement;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);


  return (
    <nav 
      ref={navRef}
      className={`fixed top-4 left-1/2 z-[120] w-[97%] max-w-[97%] -translate-x-1/2 px-3 transition-all duration-300 ${
        isScrolled ? 'top-2' : 'top-4'
      }`}
      aria-label="Main navigation"
    >
      {/* Main Navbar Container */}
      <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Animated Background Gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.4),transparent_70%)] blur-3xl animate-pulse" />
          <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_bottom_right,rgba(107,114,128,0.35),transparent_70%)] blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.25),transparent_70%)] blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Navigation Items */}
        <div 
          className="relative px-3 py-2 transition-all duration-300"
          role="navigation"
          aria-label="Slide navigation"
        >
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-all duration-300 hover:bg-white/20 active:scale-95 sm:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className={`h-5 w-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Navigation Items */}
          <div className={`flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide justify-center items-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth ${
            isMobileMenuOpen ? 'flex-col sm:flex-row' : 'flex-row hidden sm:flex'
          }`}>
            {items.map((item) => {
              const isActive = item.index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onItemClick(item.index, item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`group relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[9px] font-medium leading-tight transition-all duration-300 active:scale-95 sm:px-3 sm:py-1.5 sm:text-[10px] ${
                    isActive
                      ? 'border-transparent text-white scale-105'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/15 hover:text-white hover:scale-105'
                  }`}
                  aria-label={`Go to ${item.label}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Active Gradient Background with Glow */}
                  {isActive && (
                    <>
                      {/* Outer Glow Layer - Royal Blue (largest blur) - smooth pulse */}
                      <span 
                        className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600/40 via-gray-400/30 to-blue-700/40 blur-xl transition-opacity duration-1000 ease-in-out" 
                        style={{ 
                          animation: 'glow-pulse 3s ease-in-out infinite',
                          opacity: 0.5
                        }} 
                      />
                      {/* Middle Glow Layer - Grey */}
                      <span 
                        className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-gray-400/35 via-blue-600/30 to-blue-700/35 blur-lg transition-opacity duration-1000 ease-in-out"
                        style={{ opacity: 0.6 }}
                      />
                      {/* Inner Glow Layer - Blue */}
                      <span 
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/30 via-gray-400/25 to-blue-700/30 blur-md transition-opacity duration-1000 ease-in-out"
                        style={{ opacity: 0.7 }}
                      />
                      {/* Main Gradient Background */}
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/35 via-gray-400/30 to-blue-700/35 border border-white/30 transition-all duration-500 ease-in-out" />
                      {/* Shine Effect - smoother */}
                      <span 
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-1000 ease-in-out"
                        style={{ 
                          animation: 'shimmer 4s ease-in-out infinite',
                          opacity: 0.4
                        }} 
                      />
                    </>
                  )}
                  
                  {/* Active Indicator Dot */}
                  <span
                    className={`relative z-10 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full transition-all duration-500 ease-in-out shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-400 via-gray-300 to-blue-500'
                        : 'bg-white/40 group-hover:bg-gray-300'
                    }`}
                    style={isActive ? {
                      boxShadow: '0 0 12px rgba(59,130,246,0.8), 0 0 20px rgba(107,114,128,0.6)',
                      animation: 'glow-pulse 2.5s ease-in-out infinite'
                    } : {}}
                  />
                  <span className={`relative z-10 truncate font-semibold transition-all duration-500 ease-in-out ${isActive ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]' : ''}`}>{item.label}</span>
                  
                  {/* Hover Glow Effect for Non-Active */}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-gray-400/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GlassNavbar;

