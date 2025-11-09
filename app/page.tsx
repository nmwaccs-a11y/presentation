'use client';
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import GlassNavbar from "@/components/GlassNavbar";

const ColorBends = dynamic(() => import("@/components/ColorBends"), {
  ssr: false,
});

const slides = [
  { id: 0, title: "Title", name: "Title Slide" },
  { id: 1, title: "Table of Contents", name: "Table of Contents" },
  { id: 2, title: "Introduction", name: "What are Cyber Attacks?" },
  { id: 3, title: "Global Impact", name: "Global Impact of Cybercrime" },
  { id: 4, title: "Pakistan Digital", name: "Pakistan Going Digital – But At What Cost?" },
  { id: 5, title: "Server Takeover", name: "Server Takeover: Live Demo Preview" },
  { id: 6, title: "Comparative Analysis", name: "Comparative Analysis of Global Platforms" },
  { id: 7, title: "Our Solution", name: "Our Solution – Pakistan Bug Bounty Platform" },
  { id: 8, title: "Module Flow", name: "Module Flow & Workflow" },
  { id: 9, title: "System Architecture", name: "System Architecture" },
  { id: 10, title: "Our Team", name: "Why We Are the Right Team" },
  { id: 11, title: "Conclusion", name: "Conclusion" },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  // Memoize nav items to prevent re-rendering
  const navItems = useMemo(() => {
    return slides.map((slide, index) => ({
      id: slide.id,
      label: `${index + 1}. ${slide.title}`,
      index: index
    }));
  }, []);

  // Smooth scroll to slide
  const scrollToSlide = useCallback((index: number) => {
    if (isScrolling.current) return;
    
    const slideElement = slideRefs.current[index];
    if (slideElement && containerRef.current) {
      isScrolling.current = true;
      const container = containerRef.current;
      const slideTop = slideElement.offsetTop;
      
      container.scrollTo({
        top: slideTop,
        behavior: 'smooth'
      });

      // Update current slide after scroll starts
      setCurrentSlide(index);

      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    }
  }, []);

  // Memoize click handler to prevent re-rendering
  const handleNavClick = useCallback((index: number, item: any) => {
    scrollToSlide(index);
  }, [scrollToSlide]);

  // Initial slide detection on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial slide based on scroll position
    const scrollTop = container.scrollTop;
    const windowHeight = window.innerHeight;

    for (let i = 0; i < slideRefs.current.length; i++) {
      const slide = slideRefs.current[i];
      if (slide) {
        const slideTop = slide.offsetTop;
        const slideBottom = slideTop + slide.offsetHeight;

        if (scrollTop + windowHeight / 2 >= slideTop && scrollTop + windowHeight / 2 < slideBottom) {
          setCurrentSlide(i);
          break;
        }
      }
    }
  }, []);

  // Update current slide based on scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling.current) return;

      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;

      // Find which slide is currently in view
      for (let i = 0; i < slideRefs.current.length; i++) {
        const slide = slideRefs.current[i];
        if (slide) {
          const slideTop = slide.offsetTop;
          const slideBottom = slideTop + slide.offsetHeight;

          if (scrollTop + windowHeight / 2 >= slideTop && scrollTop + windowHeight / 2 < slideBottom) {
            if (currentSlide !== i) {
              setCurrentSlide(i);
            }
            break;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextSlide = Math.min(currentSlide + 1, slides.length - 1);
        scrollToSlide(nextSlide);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevSlide = Math.max(currentSlide - 1, 0);
        scrollToSlide(prevSlide);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, scrollToSlide]);

  return (
    <div className="relative min-h-screen w-full" style={{ backgroundColor: '#000000' }}>
      {/* ColorBends Background */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 1
      }}>
        <div style={{ width: '100%', height: '100%' }}>
          <ColorBends
            className=""
            style={{}}
            colors={['#5227FF', '#FF27A7', '#27FFA7'] as any}
            speed={0.5}
            scale={1.2}
            frequency={1.5}
            warpStrength={1.2}
            mouseInfluence={0.8}
            parallax={0.3}
            noise={0.05}
            transparent={true}
          />
        </div>
      </div>

      {/* Glass Navigation Bar */}
      <GlassNavbar items={navItems} activeIndex={currentSlide} onItemClick={handleNavClick} />

      {/* Slide Content - Single Page Scroll */}
      <div 
        ref={containerRef}
        data-scroll-container
        className="relative overflow-y-auto overflow-x-hidden h-screen snap-y snap-mandatory scroll-smooth"
        style={{ scrollBehavior: 'smooth', zIndex: 10, position: 'relative' }}
      >
        {/* Slide 0 - Title */}
        <div 
          ref={(el) => { slideRefs.current[0] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(20px, 5vh, 40px)' }}
        >
          <div className="text-center max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">
              Pakistan Bug Bounty Platform (PBBP)
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-purple-300 mb-6 sm:mb-8 backdrop-blur-lg bg-black/30 p-3 sm:p-4 md:p-5 rounded-lg border border-white/10">
              A Secure Bridge Between Organizations and Ethical Hackers
            </h2>
            {/* Table for presenter information with glass blur effect */}
            <div className="backdrop-blur-lg bg-black/30 border border-white/10 rounded-xl p-4 sm:p-6 mx-auto max-w-2xl">
              <table className="w-full text-left">
                <tbody className="space-y-2">
                  <tr className="flex flex-col sm:table-row">
                    <td className="font-semibold text-white py-2 pr-0 sm:pr-4 text-sm sm:text-base">Presented by:</td>
                    <td className="text-gray-300 py-2 text-sm sm:text-base break-words">Muhammad Qasim Riaz, Shahzaib Ahmad, Shahzaib, Tauseef Ahmad</td>
                  </tr>
                  <tr className="flex flex-col sm:table-row">
                    <td className="font-semibold text-white py-2 pr-0 sm:pr-4 text-sm sm:text-base">Supervisor:</td>
                    <td className="text-gray-300 py-2 text-sm sm:text-base">Ma'am Sumbal Fatima</td>
                  </tr>
                  <tr className="flex flex-col sm:table-row">
                    <td className="font-semibold text-white py-2 pr-0 sm:pr-4 text-sm sm:text-base">Department:</td>
                    <td className="text-gray-300 py-2 text-sm sm:text-base break-words">Department of Computer Science – GIFT University, Gujranwala</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Slide 1 - Table of Contents */}
        <div 
          ref={(el) => { slideRefs.current[1] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(20px, 5vh, 40px)' }}
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">Table of Contents</h1>
            {/* Table format for table of contents with glass blur effect */}
            <div className="backdrop-blur-lg bg-black/30 border border-white/10 rounded-xl overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/20 bg-black/20">
                    <th className="p-2 sm:p-4 text-white font-semibold text-left text-xs sm:text-sm">No.</th>
                    <th className="p-2 sm:p-4 text-white font-semibold text-left text-xs sm:text-sm">Title</th>
                    <th className="p-2 sm:p-4 text-white font-semibold text-left text-xs sm:text-sm">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {slides.slice(2).map((slide, index) => (
                    <tr 
                      key={slide.id}
                      onClick={() => scrollToSlide(index + 2)}
                      className="border-b border-white/10 hover:bg-purple-900/20 cursor-pointer transition-all duration-300"
                    >
                      <td className="p-2 sm:p-4 text-purple-400 font-bold text-xs sm:text-base">{slide.id}.</td>
                      <td className="p-2 sm:p-4 text-white font-medium text-xs sm:text-base">{slide.title}</td>
                      <td className="p-2 sm:p-4 text-gray-300 text-xs sm:text-base">{slide.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Slide 2 - Introduction */}
        <div 
          ref={(el) => { slideRefs.current[2] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(20px, 5vh, 40px)' }}
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">What are Cyber Attacks?</h1>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 space-y-2 sm:space-y-3 md:space-y-4 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">
              <p>In today's digital world, cyber attacks are one of the biggest threats faced by individuals, organizations, and governments. A cyber attack refers to any unauthorized attempt to access, steal, alter, or destroy digital information.</p>
              <p>These attacks come in many forms: phishing emails that trick users into sharing credentials, ransomware that locks files for ransom, DDoS attacks that overwhelm servers, and website defacements that damage credibility.</p>
              <p>Even a single unpatched vulnerability can lead to massive data loss, financial damage, and reputational harm. With every new device or service going online, our exposure to cyber threats increases exponentially.</p>
            </div>
          </div>
        </div>

        {/* Slide 3 - Global Impact */}
        <div 
          ref={(el) => { slideRefs.current[3] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(80px, 12vh, 120px)', paddingBottom: 'clamp(20px, 5vh, 50px)' }}
        >
          <div className="max-w-5xl w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 backdrop-blur-lg bg-black/30 p-3 sm:p-4 md:p-5 rounded-xl border border-white/10">Global Impact of Cybercrime</h1>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 space-y-2 sm:space-y-3 backdrop-blur-lg bg-black/30 p-3 sm:p-4 md:p-5 rounded-xl border border-white/10">
              <p>Cybercrime is now one of the world's fastest-growing industries — projected to cause damages of over <span className="text-purple-400 font-bold">$10.5 trillion per year by 2025</span>.</p>
              
              {/* Global Cyber Risk Chart Image */}
              <div className="my-3 backdrop-blur-lg bg-black/30 p-2 sm:p-4 rounded-xl border border-white/10">
                <div className="flex justify-center items-center">
                  <div className="relative w-full max-w-4xl">
                    <Image 
                      src="/global.png" 
                      alt="Global Cyber Risk: Cost vs. Frequency Escalation (2020-2025)" 
                      width={1200}
                      height={800}
                      className="max-w-full h-auto rounded-lg shadow-xl"
                      style={{ maxHeight: '60vh', objectFit: 'contain' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              </div>
              
              <p>According to IBM's 2024 Security Report, <span className="text-purple-400 font-bold">64% of organizations worldwide</span> have experienced some form of cyber attack, with the average cost of a data breach reaching <span className="text-purple-400 font-bold">$4.45 million</span>.</p>
              <p>Major incidents such as the WannaCry ransomware attack, Equifax data breach, and Yahoo leak demonstrate how a single vulnerability can disrupt millions of users and destroy company reputation.</p>
              <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">These statistics reveal a harsh truth — <span className="text-purple-400 font-bold">cybersecurity is not a luxury; it is an absolute necessity</span>.</p>
            </div>
          </div>
        </div>

        {/* Slide 4 - Pakistan Digital */}
        <div 
          ref={(el) => { slideRefs.current[4] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(80px, 12vh, 120px)', paddingBottom: 'clamp(20px, 5vh, 50px)' }}
        >
          <div className="max-w-5xl w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-5 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">Pakistan Going Digital – But At What Cost?</h1>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 space-y-2 sm:space-y-3 md:space-y-4 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">
              <p className="text-sm sm:text-base md:text-lg">Pakistan has <span className="text-purple-400 font-bold">110M+ internet users</span> and <span className="text-purple-400 font-bold">64% of businesses</span> online, but cybersecurity awareness lags behind.</p>
              
              {/* Charts Container - Side by Side */}
              <div className="my-4 backdrop-blur-lg bg-black/30 p-2 sm:p-4 rounded-xl border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
                  {/* Growth Index Chart */}
                  <div className="w-full flex justify-center items-center">
                    <div className="relative w-full" style={{ height: 'clamp(250px, 40vh, 450px)', minHeight: '250px' }}>
                      <Image 
                        src="/growthindex.jpeg" 
                        alt="Pakistan Digital Adoption Growth Index (2020-2025)" 
                        fill
                        className="object-contain rounded-lg shadow-xl"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        unoptimized
                      />
                    </div>
                  </div>
                  
                  {/* Pakistan Cyber Risk Chart */}
                  <div className="w-full flex justify-center items-center">
                    <div className="relative w-full" style={{ height: 'clamp(250px, 40vh, 450px)', minHeight: '250px' }}>
                      <Image 
                        src="/pakistan.png" 
                        alt="Pakistan Estimated Annual Cyber Monetary Risk (2020-2025)" 
                        fill
                        className="object-contain rounded-lg shadow-xl"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm sm:text-base md:text-lg">Recent incidents: BankIslami cyber heist (Rs 2.6 crore loss), FBR hack (2021), 22+ government websites defaced (2023).</p>
              <p className="text-sm sm:text-base md:text-lg text-white font-semibold">Under the <span className="text-purple-400 font-bold">PECA Act</span>, security testing without permission is illegal, preventing ethical hackers from reporting vulnerabilities.</p>
              <p className="text-xs sm:text-sm md:text-base">No official vulnerability disclosure channel exists — companies remain vulnerable, researchers remain silent.</p>
            </div>
          </div>
        </div>

        {/* Slide 5 - Server Takeover */}
        <div 
          ref={(el) => { slideRefs.current[5] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(80px, 12vh, 120px)', paddingBottom: 'clamp(20px, 5vh, 50px)' }}
        >
          <div className="max-w-5xl w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">Server Takeover – Live Demo Preview</h1>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 space-y-2 sm:space-y-3 md:space-y-4 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">
              <p>This short demo video demonstrates how easily an unsecured server can be compromised. Using nothing more than misconfigured SSH credentials or an exposed port, an attacker can gain full control of a company's data within seconds.</p>
              
              {/* Video Container */}
              <div className="my-4 backdrop-blur-lg bg-black/30 p-2 sm:p-4 rounded-xl border border-white/10">
                <div className="flex justify-center items-center">
                  <div className="relative w-full max-w-4xl">
                    <video 
                      controls
                      className="w-full h-auto rounded-lg shadow-xl"
                      style={{ maxHeight: 'clamp(250px, 60vh, 600px)' }}
                      preload="metadata"
                      playsInline
                    >
                      <source src="/pakgov-server-takedown.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
              
              <p>The purpose of this demo is not to glorify hacking but to highlight the real and immediate risk faced by Pakistani organizations that ignore cybersecurity practices.</p>
              <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">By visualizing this attack, we aim to show our panel that the danger is not theoretical — <span className="text-purple-400 font-bold">it is happening every day in our local digital space</span>.</p>
            </div>
          </div>
        </div>

        {/* Slide 6 - Comparative Analysis */}
        <div 
          ref={(el) => { slideRefs.current[6] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(20px, 5vh, 40px)' }}
        >
          <div className="max-w-5xl w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">Comparative Analysis – Global Bug Bounty Platforms</h1>
            <div className="overflow-x-auto backdrop-blur-lg bg-black/30 p-3 sm:p-6 rounded-xl border border-white/10">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-purple-500/50">
                    <th className="p-2 sm:p-3 md:p-4 text-white font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">Platform</th>
                    <th className="p-2 sm:p-3 md:p-4 text-white font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">Country</th>
                    <th className="p-2 sm:p-3 md:p-4 text-white font-semibold text-xs sm:text-sm md:text-base">Challenges for Pakistani Users</th>
                    <th className="p-2 sm:p-3 md:p-4 text-white font-semibold text-xs sm:text-sm md:text-base">Summary</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-700">
                    <td className="p-2 sm:p-3 md:p-4 font-semibold text-purple-400 text-xs sm:text-sm md:text-base whitespace-nowrap">HackerOne</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base whitespace-nowrap">USA</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base break-words">Requires international bank or PayPal; 30–40% reward loss due to dual taxation. High competition causes duplicate reports.</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base break-words">Excellent global scope but inaccessible to Pakistani researchers.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-2 sm:p-3 md:p-4 font-semibold text-purple-400 text-xs sm:text-sm md:text-base whitespace-nowrap">Bugcrowd</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base whitespace-nowrap">USA</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base break-words">Demands legal agreements under US law; limited inclusion of Pakistan-based companies; foreign payouts only.</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base break-words">Complex onboarding and unsuitable for local financial systems.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-2 sm:p-3 md:p-4 font-semibold text-purple-400 text-xs sm:text-sm md:text-base whitespace-nowrap">Intigriti</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base whitespace-nowrap">Belgium</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base break-words">Euro-only payments; no Pakistani programs; not compliant with local laws.</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base break-words">Great European platform, but geographically restrictive.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-2 sm:p-3 md:p-4 font-semibold text-purple-400 text-xs sm:text-sm md:text-base whitespace-nowrap">Synack</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base whitespace-nowrap">USA</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base break-words">Invite-only; focused on Western clients; requires background verification and NDAs.</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base break-words">Designed for elite researchers, not local contributors.</td>
                  </tr>
                  <tr className="border-b border-gray-700 bg-purple-900/20">
                    <td className="p-2 sm:p-3 md:p-4 font-semibold text-purple-300 text-xs sm:text-sm md:text-base whitespace-nowrap">PBBP (Proposed)</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base whitespace-nowrap">Pakistan</td>
                    <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base break-words">Legally safe under PECA; direct local payouts via JazzCash, Easypaisa, or Bank; smaller community reduces duplicates.</td>
                    <td className="p-2 sm:p-3 md:p-4 font-semibold text-purple-300 text-xs sm:text-sm md:text-base break-words">First legal, local, and secure bridge for Pakistani cybersecurity.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Slide 7 - Our Solution */}
        <div 
          ref={(el) => { slideRefs.current[7] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(20px, 5vh, 40px)' }}
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">Our Solution – Pakistan Bug Bounty Platform (PBBP)</h1>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 space-y-2 sm:space-y-3 md:space-y-4 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">
              <p>Our proposed solution is Pakistan's first national-level bug bounty platform, designed specifically to meet the country's cybersecurity and legal needs.</p>
              <p>PBBP serves as a secure bridge between organizations and ethical hackers, allowing approved vulnerability testing, structured reporting, and legal payouts — all under the framework of the PECA Act.</p>
              <p>The platform will help companies create bounty programs, researchers submit vulnerabilities, and triagers verify and prioritize issues. It promotes cybersecurity awareness, builds trust, and ensures that researchers can contribute legally and safely.</p>
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <p className="text-white font-semibold mb-2">Core capabilities include:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm sm:text-base">
                  <li>Secure vulnerability submission portal</li>
                  <li>Company dashboard</li>
                  <li>Triage management system</li>
                  <li>Researcher leaderboard</li>
                  <li>Two-factor authentication</li>
                  <li>JWT-based security</li>
                  <li>Local reward management</li>
                </ul>
              </div>
              <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">In essence, this is not just a website — <span className="text-purple-400 font-bold">it is the foundation for a national cybersecurity ecosystem</span>.</p>
            </div>
          </div>
        </div>

        {/* Slide 8 - Module Flow */}
        <div 
          ref={(el) => { slideRefs.current[8] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(20px, 5vh, 40px)' }}
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">Module Flow / System Workflow</h1>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 space-y-3 sm:space-y-4 md:space-y-6 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">
              <p>The Pakistan Bug Bounty Platform operates through a streamlined process that ensures clarity, legality, and security for all participants:</p>
              <ol className="list-decimal list-inside space-y-3 sm:space-y-4 ml-4">
                <li className="text-base sm:text-lg">
                  <span className="font-semibold text-white">A company registers</span> on the platform and creates a bounty program outlining its security scope and rules.
                </li>
                <li className="text-base sm:text-lg">
                  <span className="font-semibold text-white">Ethical hackers identify vulnerabilities</span> and submit findings through a secure portal.
                </li>
                <li className="text-base sm:text-lg">
                  <span className="font-semibold text-white">The internal triage team verifies</span> validity and communicates with the company.
                </li>
                <li className="text-base sm:text-lg">
                  <span className="font-semibold text-white">The company fixes the issue</span> and releases a reward.
                </li>
                <li className="text-base sm:text-lg">
                  <span className="font-semibold text-white">The researcher's reputation score</span> is updated on the leaderboard.
                </li>
              </ol>
              <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">This workflow ensures accountability, transparency, and compliance with local laws.</p>
            </div>
          </div>
        </div>

        {/* Slide 9 - System Architecture */}
        <div 
          ref={(el) => { slideRefs.current[9] = el; }}
          className="flex items-center justify-center min-h-screen px-2 sm:px-4 md:px-6 lg:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(20px, 5vh, 40px)' }}
        >
          <div className="w-full max-w-7xl mx-auto py-4 sm:py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 text-center backdrop-blur-lg bg-black/30 p-3 sm:p-4 md:p-6 rounded-xl border border-white/10">System Architecture Diagram</h1>
            
            {/* Architecture Diagram Image */}
            <div className="flex justify-center items-center mt-4 sm:mt-6 md:mt-8">
              <div className="relative w-full max-w-6xl backdrop-blur-lg bg-black/30 border border-white/10 rounded-xl p-2 sm:p-4" style={{ minHeight: 'clamp(300px, 50vh, 500px)' }}>
                <Image 
                  src="/systemArch.jpeg" 
                  alt="System Architecture Diagram" 
                  width={1200}
                  height={800}
                  className="max-w-full h-auto rounded-xl shadow-2xl"
                  style={{ maxHeight: 'clamp(300px, 70vh, 800px)', objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1200px"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slide 10 - Our Team */}
        <div 
          ref={(el) => { slideRefs.current[10] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(20px, 5vh, 40px)' }}
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">Why We Are the Right Team</h1>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 space-y-2 sm:space-y-3 md:space-y-4 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">
              <p>Our team deeply understands both the technical challenges and the legal limitations surrounding cybersecurity in Pakistan.</p>
              <p>We bring together expertise in:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-sm sm:text-base">Web development (React, Next.js, Node.js)</li>
                <li className="text-sm sm:text-base">Cybersecurity tools (BurpSuite, Nmap, Wireshark)</li>
                <li className="text-sm sm:text-base">Solid understanding of the PECA law governing ethical hacking</li>
              </ul>
              <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">Beyond technical skills, we are driven by purpose. We aim to create awareness among Pakistani organizations about proactive security and responsible vulnerability disclosure.</p>
              <p className="text-lg sm:text-xl text-purple-300 font-semibold mt-4 sm:mt-6">This project is not just a final year requirement — it is a vision to create the country's first platform that protects both companies and researchers through cooperation and trust.</p>
            </div>
          </div>
        </div>

        {/* Slide 11 - Conclusion */}
        <div 
          ref={(el) => { slideRefs.current[11] = el; }}
          className="flex items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 snap-start snap-always"
          style={{ paddingTop: 'clamp(60px, 10vh, 100px)', paddingBottom: 'clamp(20px, 5vh, 40px)' }}
        >
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">Conclusion</h1>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 space-y-3 sm:space-y-4 md:space-y-6 backdrop-blur-lg bg-black/30 p-4 sm:p-5 md:p-6 rounded-xl border border-white/10">
              <p>Pakistan is rapidly digitizing, but its cybersecurity measures have not caught up. There is no legal or official system where ethical hackers can report vulnerabilities responsibly, and global platforms are inaccessible due to legal and financial barriers.</p>
              <p>Our proposed Pakistan Bug Bounty Platform provides a localized, secure, and legally compliant environment where organizations can collaborate with researchers to strengthen their defenses.</p>
              <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">This platform promotes security awareness, legal cooperation, and national resilience in cyberspace.</p>
              <div className="mt-6 sm:mt-12 p-4 sm:p-8 bg-purple-900/20 rounded-lg border border-purple-500/30 backdrop-blur-lg">
                <p className="text-lg sm:text-xl text-purple-300 font-semibold italic">
                  "Cybersecurity cannot be imported; it must be built locally — by our people, for our organizations, and for our future."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}