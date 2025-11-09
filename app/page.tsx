'use client';
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import PillNav from "@/components/PillNav";

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

      {/* PillNav Navigation Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <PillNav
          logo={null}
          items={navItems}
          activeIndex={currentSlide}
          onItemClick={handleNavClick}
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
          onMobileMenuClick={() => {}}
          className=""
        />
      </div>

      {/* Slide Content - Single Page Scroll */}
      <div 
        ref={containerRef}
        className="relative overflow-y-auto overflow-x-hidden h-screen snap-y snap-mandatory scroll-smooth"
        style={{ scrollBehavior: 'smooth', zIndex: 10, position: 'relative' }}
      >
        {/* Slide 0 - Title */}
        <div 
          ref={(el) => { slideRefs.current[0] = el; }}
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
          style={{ paddingTop: '80px' }}
        >
          <div className="text-center max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">
              Pakistan Bug Bounty Platform (PBBP)
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-purple-300 mb-6 sm:mb-8 backdrop-blur-lg bg-black/30 p-4 rounded-lg border border-white/10">
              A Secure Bridge Between Organizations and Ethical Hackers
            </h2>
            {/* Table for presenter information with glass blur effect */}
            <div className="backdrop-blur-lg bg-black/30 border border-white/10 rounded-xl p-6 mx-auto max-w-2xl">
              <table className="w-full text-left">
                <tbody className="space-y-2">
                  <tr>
                    <td className="font-semibold text-white py-2 pr-4">Presented by:</td>
                    <td className="text-gray-300 py-2">Muhammad Qasim Riaz, Shahzaib Ahmad, Shahzaib, Tauseef Ahmad</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-white py-2 pr-4">Supervisor:</td>
                    <td className="text-gray-300 py-2">Ma'am Sumbal Fatima</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-white py-2 pr-4">Department:</td>
                    <td className="text-gray-300 py-2">Department of Computer Science – GIFT University, Gujranwala</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Slide 1 - Table of Contents */}
        <div 
          ref={(el) => { slideRefs.current[1] = el; }}
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-10 text-center backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">Table of Contents</h1>
            {/* Table format for table of contents with glass blur effect */}
            <div className="backdrop-blur-lg bg-black/30 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/20 bg-black/20">
                    <th className="p-4 text-white font-semibold text-left">No.</th>
                    <th className="p-4 text-white font-semibold text-left">Title</th>
                    <th className="p-4 text-white font-semibold text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {slides.slice(2).map((slide, index) => (
                    <tr 
                      key={slide.id}
                      onClick={() => scrollToSlide(index + 2)}
                      className="border-b border-white/10 hover:bg-purple-900/20 cursor-pointer transition-all duration-300"
                    >
                      <td className="p-4 text-purple-400 font-bold">{slide.id}.</td>
                      <td className="p-4 text-white font-medium">{slide.title}</td>
                      <td className="p-4 text-gray-300">{slide.name}</td>
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
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">What are Cyber Attacks?</h1>
            <div className="text-base sm:text-lg text-gray-300 space-y-3 sm:space-y-4 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">
              <p>In today's digital world, cyber attacks are one of the biggest threats faced by individuals, organizations, and governments. A cyber attack refers to any unauthorized attempt to access, steal, alter, or destroy digital information.</p>
              <p>These attacks come in many forms: phishing emails that trick users into sharing credentials, ransomware that locks files for ransom, DDoS attacks that overwhelm servers, and website defacements that damage credibility.</p>
              <p>Even a single unpatched vulnerability can lead to massive data loss, financial damage, and reputational harm. With every new device or service going online, our exposure to cyber threats increases exponentially.</p>
            </div>
          </div>
        </div>

        {/* Slide 3 - Global Impact */}
        <div 
          ref={(el) => { slideRefs.current[3] = el; }}
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">Global Impact of Cybercrime</h1>
            <div className="text-base sm:text-lg text-gray-300 space-y-3 sm:space-y-4 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">
              <p>Cybercrime is now one of the world's fastest-growing industries — projected to cause damages of over <span className="text-purple-400 font-bold">$10.5 trillion per year by 2025</span>.</p>
              <p>According to IBM's 2024 Security Report, <span className="text-purple-400 font-bold">64% of organizations worldwide</span> have experienced some form of cyber attack, with the average cost of a data breach reaching <span className="text-purple-400 font-bold">$4.45 million</span>.</p>
              <p>Major incidents such as the WannaCry ransomware attack, Equifax data breach, and Yahoo leak demonstrate how a single vulnerability can disrupt millions of users and destroy company reputation.</p>
              <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">These statistics reveal a harsh truth — <span className="text-purple-400 font-bold">cybersecurity is not a luxury; it is an absolute necessity</span>.</p>
            </div>
          </div>
        </div>

        {/* Slide 4 - Pakistan Digital */}
        <div 
          ref={(el) => { slideRefs.current[4] = el; }}
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">Pakistan Going Digital – But At What Cost?</h1>
            <div className="text-base sm:text-lg text-gray-300 space-y-3 sm:space-y-4 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">
              <p>Pakistan is experiencing a rapid digital transformation, with over <span className="text-purple-400 font-bold">110 million internet users</span> and more than <span className="text-purple-400 font-bold">64% of businesses</span> moving their operations online. However, cybersecurity awareness has not evolved at the same pace.</p>
              
              {/* Digital Growth Bar Chart */}
              <div className="my-6 backdrop-blur-lg bg-black/30 p-4 rounded-xl border border-white/10">
                <h2 className="text-lg font-bold text-white mb-3 text-center">Digital Adoption Growth (2020-2025)</h2>
                
                {/* Simple bar chart with capped widths */}
                <div className="space-y-2">
                  {/* 2020 */}
                  <div className="flex items-center">
                    <span className="text-gray-300 text-xs w-8">2020</span>
                    <div className="flex-1 ml-2">
                      <div className="h-6 bg-purple-500 rounded" 
                           style={{ width: '40%' }}>
                        <span className="text-white text-xs pl-2">100</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 2021 */}
                  <div className="flex items-center">
                    <span className="text-gray-300 text-xs w-8">2021</span>
                    <div className="flex-1 ml-2">
                      <div className="h-6 bg-blue-500 rounded" 
                           style={{ width: '52%' }}>
                        <span className="text-white text-xs pl-2">130</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 2022 */}
                  <div className="flex items-center">
                    <span className="text-gray-300 text-xs w-8">2022</span>
                    <div className="flex-1 ml-2">
                      <div className="h-6 bg-green-500 rounded" 
                           style={{ width: '66%' }}>
                        <span className="text-white text-xs pl-2">165</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 2023 */}
                  <div className="flex items-center">
                    <span className="text-gray-300 text-xs w-8">2023</span>
                    <div className="flex-1 ml-2">
                      <div className="h-6 bg-yellow-500 rounded" 
                           style={{ width: '86%' }}>
                        <span className="text-white text-xs pl-2">215</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 2024 */}
                  <div className="flex items-center">
                    <span className="text-gray-300 text-xs w-8">2024</span>
                    <div className="flex-1 ml-2">
                      <div className="h-6 bg-orange-500 rounded" 
                           style={{ width: '98%' }}>
                        <span className="text-white text-xs pl-2">245</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 2025 */}
                  <div className="flex items-center">
                    <span className="text-gray-300 text-xs w-8">2025</span>
                    <div className="flex-1 ml-2">
                      <div className="h-6 bg-red-500 rounded" 
                           style={{ width: '100%' }}>
                        <span className="text-white text-xs pl-2">275</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-400 text-xs text-center mt-3 italic">
                  Digital Adoption Index (2020 = 100)
                </p>
              </div>
              
              <p>Recent incidents such as the BankIslami cyber heist (loss of Rs 2.6 crore), the FBR website hack in 2021, and the defacement of 22+ government websites in 2023, reveal how unprepared we are against modern threats.</p>
              <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">A deeper issue lies within our legal framework. Under the <span className="text-purple-400 font-bold">PECA Act</span>, conducting any security testing on an organization without permission is considered illegal. This means even well-intentioned researchers cannot legally report vulnerabilities they discover.</p>
              <p>The absence of an official vulnerability disclosure channel has created a dangerous gap — companies remain vulnerable, and ethical hackers remain silent.</p>
            </div>
          </div>
        </div>

        {/* Slide 5 - Server Takeover */}
        <div 
          ref={(el) => { slideRefs.current[5] = el; }}
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">Server Takeover – Live Demo Preview</h1>
            <div className="text-base sm:text-lg text-gray-300 space-y-3 sm:space-y-4 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">
              <p>This short demo video demonstrates how easily an unsecured server can be compromised. Using nothing more than misconfigured SSH credentials or an exposed port, an attacker can gain full control of a company's data within seconds.</p>
              <p>The purpose of this demo is not to glorify hacking but to highlight the real and immediate risk faced by Pakistani organizations that ignore cybersecurity practices.</p>
              <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">By visualizing this attack, we aim to show our panel that the danger is not theoretical — <span className="text-purple-400 font-bold">it is happening every day in our local digital space</span>.</p>
            </div>
          </div>
        </div>

        {/* Slide 6 - Comparative Analysis */}
        <div 
          ref={(el) => { slideRefs.current[6] = el; }}
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-5xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">Comparative Analysis – Global Bug Bounty Platforms</h1>
            <div className="overflow-x-auto backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-500/50">
                    <th className="p-2 sm:p-4 text-white font-semibold text-sm sm:text-base">Platform</th>
                    <th className="p-2 sm:p-4 text-white font-semibold text-sm sm:text-base">Country</th>
                    <th className="p-2 sm:p-4 text-white font-semibold text-sm sm:text-base">Challenges for Pakistani Users</th>
                    <th className="p-2 sm:p-4 text-white font-semibold text-sm sm:text-base">Summary</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-700">
                    <td className="p-2 sm:p-4 font-semibold text-purple-400 text-sm sm:text-base">HackerOne</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">USA</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Requires international bank or PayPal; 30–40% reward loss due to dual taxation. High competition causes duplicate reports.</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Excellent global scope but inaccessible to Pakistani researchers.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-2 sm:p-4 font-semibold text-purple-400 text-sm sm:text-base">Bugcrowd</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">USA</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Demands legal agreements under US law; limited inclusion of Pakistan-based companies; foreign payouts only.</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Complex onboarding and unsuitable for local financial systems.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-2 sm:p-4 font-semibold text-purple-400 text-sm sm:text-base">Intigriti</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Belgium</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Euro-only payments; no Pakistani programs; not compliant with local laws.</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Great European platform, but geographically restrictive.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-2 sm:p-4 font-semibold text-purple-400 text-sm sm:text-base">Synack</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">USA</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Invite-only; focused on Western clients; requires background verification and NDAs.</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Designed for elite researchers, not local contributors.</td>
                  </tr>
                  <tr className="border-b border-gray-700 bg-purple-900/20">
                    <td className="p-2 sm:p-4 font-semibold text-purple-300 text-sm sm:text-base">PBBP (Proposed)</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Pakistan</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">Legally safe under PECA; direct local payouts via JazzCash, Easypaisa, or Bank; smaller community reduces duplicates.</td>
                    <td className="p-2 sm:p-4 font-semibold text-purple-300 text-sm sm:text-base">First legal, local, and secure bridge for Pakistani cybersecurity.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Slide 7 - Our Solution */}
        <div 
          ref={(el) => { slideRefs.current[7] = el; }}
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">Our Solution – Pakistan Bug Bounty Platform (PBBP)</h1>
            <div className="text-base sm:text-lg text-gray-300 space-y-3 sm:space-y-4 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">
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
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">Module Flow / System Workflow</h1>
            <div className="text-base sm:text-lg text-gray-300 space-y-4 sm:space-y-6 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">
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
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 text-center backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">System Architecture</h1>
            <p className="text-base sm:text-lg text-gray-300 text-center mb-6 sm:mb-8 backdrop-blur-lg bg-black/30 p-4 rounded-lg border border-white/10">
              The Pakistan Bug Bounty Platform is built with a modular and secure architecture:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="p-4 sm:p-6 rounded-lg border border-purple-500/30 bg-purple-900/20 backdrop-blur-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-purple-400 mb-2">Frontend</h3>
                <p className="text-gray-300 text-sm sm:text-base">React or Next.js for user dashboards</p>
              </div>
              <div className="p-4 sm:p-6 rounded-lg border border-green-500/30 bg-green-900/20 backdrop-blur-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-green-400 mb-2">Backend</h3>
                <p className="text-gray-300 text-sm sm:text-base">Node.js and Express for APIs and logic</p>
              </div>
              <div className="p-4 sm:p-6 rounded-lg border border-yellow-500/30 bg-yellow-900/20 backdrop-blur-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-yellow-400 mb-2">Database</h3>
                <p className="text-gray-300 text-sm sm:text-base">MongoDB or MySQL for secure data storage</p>
              </div>
              <div className="p-4 sm:p-6 rounded-lg border border-red-500/30 bg-red-900/20 backdrop-blur-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-red-400 mb-2">Security</h3>
                <p className="text-gray-300 text-sm sm:text-base">JWT tokens, password hashing, and two-factor authentication</p>
              </div>
              <div className="p-4 sm:p-6 rounded-lg border border-purple-500/30 bg-purple-900/20 backdrop-blur-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-purple-400 mb-2">Notifications</h3>
                <p className="text-gray-300 text-sm sm:text-base">Email and in-app alerts</p>
              </div>
              <div className="p-4 sm:p-6 rounded-lg border border-cyan-500/30 bg-cyan-900/20 backdrop-blur-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-2">Hosting</h3>
                <p className="text-gray-300 text-sm sm:text-base">AWS or local servers for scalability and uptime</p>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-white mt-6 sm:mt-8 text-center backdrop-blur-lg bg-black/30 p-4 rounded-lg border border-white/10">
              This layered structure ensures that the platform remains robust, scalable, and protected against modern threats.
            </p>
          </div>
        </div>

        {/* Slide 10 - Our Team */}
        <div 
          ref={(el) => { slideRefs.current[10] = el; }}
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">Why We Are the Right Team</h1>
            <div className="text-base sm:text-lg text-gray-300 space-y-3 sm:space-y-4 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">
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
          className="flex items-center justify-center min-h-screen px-4 sm:px-8 snap-start snap-always"
        >
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">Conclusion</h1>
            <div className="text-base sm:text-lg text-gray-300 space-y-4 sm:space-y-6 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10">
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