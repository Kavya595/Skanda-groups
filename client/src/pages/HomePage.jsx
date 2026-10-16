import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Compass,
  CheckCircle2,
  MapPin,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  Building,
  Trees,
  Car,
  Droplets,
  Lightbulb,
  Sparkles,
  Calendar,
  ExternalLink,
  Quote,
  Maximize2,
  Navigation,
  Sun,
  Moon,
  Layers,
  Home,
  Download,
  PhoneCall,
  Mail,
  Send,
  Star,
  Play,
  Award,
  ChevronRight,
  MessageCircle,
  Clock,
  Share2
} from 'lucide-react';
import {
  fetchPublicSettings,
  fetchPlotStats,
  fetchGallery,
  trackActivityEvent
} from '../api/client';
import EnquiryModal from '../components/EnquiryModal';
import Lightbox from '../components/Lightbox';
import SpecialLandmarkView from '../components/SpecialLandmarkView';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import CountUp from '../components/CountUp';

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(2);

  // Villa Concepts State
  const [activeVillaConfig, setActiveVillaConfig] = useState('183');

  // Twilight Lighting Showcase State
  const [activeLightingIndex, setActiveLightingIndex] = useState(0);

  // Testimonials Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  useEffect(() => {
    trackActivityEvent('layout_opened', null, { source: 'homepage' });
    fetchPublicSettings().then(res => res.success && setSettings(res.settings)).catch(console.error);
    fetchPlotStats().then(res => res.success && setStats(res.stats)).catch(console.error);
    fetchGallery().then(res => res.success && setGallery(res.items.slice(0, 6))).catch(console.error);
  }, []);

  const dtcpNo = (settings && settings.dtcpNumber) || 'TLP NO. 87/2024/H';
  const reraNo = (settings && settings.reraNumber) || 'PO2400009081';
  const contactEmail = (settings && settings.contactEmail) || 'contact@skandhagroup.com';
  const officeAddress = (settings && settings.officeAddress) || '# 8-7-91/17/1, 4th Floor Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad, Telangana -500079';

  const marqueeItems = [
    'DTCP SANCTIONED TLP NO. 87/2024/H',
    'TS RERA REGISTERED PO2400009081',
    '100% VASTHU COMPLIANT ORIENTATION',
    '40 FT & 33 FT BLACKTOP ROADS',
    '1 MINUTE TO MAISIGANDI TEMPLE',
    '10.50 ACRES GATED COMMUNITY',
    'AC. 0.758 CENTS LANDSCAPED PARK',
    'SPOT REGISTRATION WITH CLEAR TITLE',
    'PRE-APPROVED BANK LOANS UP TO 75%',
    'UNDERGROUND SANITARY DRAINAGE',
    '2 YEARS COMPLIMENTARY MAINTENANCE',
    'MUCHERLA FUTURE CITY CORRIDOR'
  ];

  // Villa Concepts Data
  const villaConfigs = {
    '183': {
      sqYards: '183 Sq.Yards',
      dimension: "33' x 50'",
      builtUp: '2,450 Sq.Ft Built-Up Area',
      type: '3-BHK Contemporary Villa',
      highlights: [
        'East / West Facing Vasthu Alignment',
        'Double-height formal living & dining',
        'Private landscaped rear garden terrace',
        'Dedicated covered car parking portico'
      ],
      desc: 'The ideal balance of elegance and functional living, designed with abundant natural sunlight, cross-ventilation, and private green sanctuary spaces.'
    },
    '240': {
      sqYards: '240 Sq.Yards',
      dimension: "36' x 60'",
      builtUp: '3,200 Sq.Ft Built-Up Area',
      type: '4-BHK Executive Courtyard Villa',
      highlights: [
        'Central open-to-sky internal courtyard',
        'Expansive master suite with walk-in wardrobe',
        'Private rooftop lounge with slatted pergola',
        'Twin covered vehicle parking with electric charging'
      ],
      desc: 'An architectural statement featuring expansive glass facades, double-height volumes, and seamless integration between indoor living and manicured outdoor lawns.'
    },
    '350': {
      sqYards: '350+ Sq.Yards',
      dimension: "45' x 70' / Corner",
      builtUp: '4,500+ Sq.Ft Built-Up Area',
      type: '5-BHK Grand Signature Estate',
      highlights: [
        'Prime corner plot with dual road access',
        'Private infinity-edge garden plunge pool',
        'Family entertainment lounge & home theater',
        'Grand entrance foyer with travertine stone accents'
      ],
      desc: 'Uncompromising luxury on prime corner plots. Designed for generational prosperity, exceptional privacy, and grand entertaining in Kadthal.'
    }
  };

  // Twilight Ambiance & Lighting Showcase Data
  const lightingScenes = [
    {
      title: 'Villa Twilight Ambiance & Warm Glow',
      category: 'Architectural Lighting',
      tag: 'Warm Amber Accents',
      image: '/assets/villa_twilight_lighting.jpg',
      badge: 'Bespoke Residential Lighting',
      desc: 'Recessed warm orange ceiling coves, exterior travertine uplighting, and glowing floor-to-ceiling glass create a serene, welcoming dusk ambiance.'
    },
    {
      title: 'Illuminated 40ft Internal Avenues',
      category: 'Boulevard Lighting',
      tag: 'Solar-Assisted Warm LEDs',
      image: '/assets/avenue_lighting.jpg',
      badge: 'Designer Curved Street Lamps',
      desc: 'Wide 40-foot blacktop avenues lined with designer curved light posts casting a warm amber glow over smooth asphalt roads and uplighted palm trees.'
    },
    {
      title: 'Resort Pool Pavilion & Evening Waterscape',
      category: 'Amenities Illumination',
      tag: 'Underwater Golden Glow',
      image: '/assets/pool_lighting.jpg',
      badge: 'Lush Garden Lighting',
      desc: 'Submerged pool illumination paired with warm amber pergola lights and ash-grey stone sun deck create an enchanting evening retreat for families.'
    }
  ];

  // Authentic On-Site Photo Developments
  const onSiteDevelopments = [
    {
      title: 'Grand Entrance Arch & Security',
      category: 'Gated Security',
      desc: 'Architectural entry portal with 24/7 security cabin and boundary wall fencing.',
      image: '/assets/site_entrance_arch.jpg',
      tag: 'Completed Feature'
    },
    {
      title: 'Ac. 0.758 Landscaped Central Park',
      category: 'Green Reserve',
      desc: 'Lush open green park with manicured lawns, flowering trees, and recreational walkways.',
      image: '/assets/site_landscape_park.jpg',
      tag: 'Ac. 0.758 Cents'
    },
    {
      title: '40ft & 33ft Wide Blacktop B.T. Roads',
      category: 'Circulation Grid',
      desc: 'Heavy-duty asphalt avenues bordered with concrete curbs and pedestrian walkway avenues.',
      image: '/assets/site_bt_roads.jpg',
      tag: 'Wide Road Grid'
    },
    {
      title: 'Dedicated Overhead Water Tank',
      category: 'Water Utility',
      desc: 'High-capacity overhead reservoir providing reliable, uninterrupted potable water network.',
      image: '/assets/site_overhead_tank.jpg',
      tag: 'Water Infrastructure'
    },
    {
      title: 'Lush Avenue Tree Plantation',
      category: 'Avenue Planting',
      desc: 'Extensive flowering shade trees lining every internal avenue curb for ecological beauty.',
      image: '/assets/site_avenue_plantation.jpg',
      tag: 'Eco Landscaping'
    },
    {
      title: "Children's Recreation & Jogging Track",
      category: 'Lifestyle',
      desc: 'Dedicated safe play zone with modern equipment and paved morning fitness path.',
      image: '/assets/site_children_park.jpg',
      tag: 'Family Recreation'
    },
    {
      title: 'Modern Underground Drainage Network',
      category: 'Sanitary Grid',
      desc: 'Subsurface sanitary drainage system engineered to prevent waterlogging and maintain hygiene.',
      image: '/assets/site_drainage_system.jpg',
      tag: 'Underground Grid'
    },
    {
      title: 'Historic Maisigandi Temple Precinct',
      category: 'Sacred Proximity',
      desc: 'Just a 1-minute drive from the layout along the proposed 60ft master arterial avenue.',
      image: '/assets/maisigandi_temple.jpg',
      tag: '1 Min Proximity'
    }
  ];

  const amenities = [
    { title: 'DTCP Approved Layout', desc: 'TLP No. 87/2024/H legally approved residential layout.', icon: ShieldCheck },
    { title: '100% Vasthu Compliant', desc: 'Carefully engineered plot alignments with clear Vasthu titles.', icon: Compass },
    { title: "40' & 33' B.T Roads", desc: "Wide asphalt blacktop internal avenues with pedestrian curbs.", icon: Car },
    { title: 'Spot Registration', desc: 'Ready for immediate spot registration with clear title deed.', icon: CheckCircle2 },
    { title: '24 Hours Security', desc: 'Grand entrance arch with 24/7 security cabin and boundary fencing.', icon: Building },
    { title: 'Underground Drainage', desc: 'Modern sanitary underground drainage system throughout layout.', icon: Droplets },
    { title: 'Overhead Water Tank', desc: 'Dedicated water storage tank ensuring round-the-clock water supply.', icon: Droplets },
    { title: 'Landscaped Parks', desc: 'Ac. 0.758 cents reserved green space with lush plantings.', icon: Trees },
    { title: 'Jogging Track & Play Area', desc: 'Paved jogging trail and dedicated children activity zone.', icon: Sparkles },
    { title: 'Avenue Street Lighting', desc: 'Warm amber illuminated street fixtures across all internal avenues.', icon: Lightbulb },
    { title: 'Avenue Plantation', desc: 'Lush avenue trees and greenery bordering all road curbs.', icon: Trees },
    { title: '2 Years Maintenance', desc: 'Complimentary security & comprehensive site maintenance for 2 years.', icon: ShieldCheck }
  ];

  // Verified Client Testimonials with Smooth Carousel Animation
  const testimonials = [
    {
      name: 'Dr. K. Srinivas Rao',
      location: 'Hyderabad',
      rating: 5,
      comment: 'Investing with Skandha Group at Kadthal was one of the smoothest real estate decisions for my family. The 100% DTCP sanction and TS RERA documentation gave us complete peace of mind, and the location near Maisigandi Temple is spiritually serene and commercially prime.',
      highlight: '100% Transparent Documentation'
    },
    {
      name: 'Rameshwar Reddy',
      location: 'NRI Investor, USA',
      rating: 5,
      comment: 'The on-site development reality matches the promises completely: 40ft wide blacktop roads, overhead water tank, and beautiful avenue plantations. Being on Srisailam Highway and minutes from the Mucherla Future City corridor guarantees massive appreciation.',
      highlight: 'Exceptional Capital Growth Corridor'
    },
    {
      name: 'V. Lakshmi Prasanna',
      location: 'Secunderabad',
      rating: 5,
      comment: 'We purchased an East-facing 240 Sq.Yd plot for constructing our custom weekend villa. The Vasthu alignment is impeccable, the park space is lush and peaceful, and spot registration was handled with absolute clarity and professionalism.',
      highlight: 'Authentic Vasthu Precision'
    },
    {
      name: 'Chandra Shekar Varma',
      location: 'Gachibowli, Hyderabad',
      rating: 5,
      comment: 'Clear title and immediate spot registration were critical for us. Skandha Group delivered on every statutory milestone. The connectivity to ORR Exit 14 and Shamshabad Airport makes Kadthal the fastest appreciating sector in South Hyderabad.',
      highlight: 'Spot Registration Guaranteed'
    },
    {
      name: 'Anitha & Sridhar K.',
      location: 'Madhapur, Hyderabad',
      rating: 5,
      comment: 'We were blown away by the infrastructure layout: 40ft wide blacktop avenues, underground drainage, overhead tank, and 24/7 security. It is the premier plotted sanctuary near Maisigandi Temple.',
      highlight: 'World-Class Infrastructure'
    }
  ];

  // Auto-advance Testimonials Carousel
  useEffect(() => {
    if (isTestimonialHovered) return;
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isTestimonialHovered, testimonials.length]);

  const nextTestimonial = () => {
    setActiveTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50) {
      nextTestimonial();
    } else if (distance < -50) {
      prevTestimonial();
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  return (
    <div className="pb-20 overflow-hidden bg-[#000000] text-slate-100 relative">
      {/* ========================================================== */}
      {/* 1. CLEAN HERO BANNER WITH VIDEO & PDF IMAGE BACKDROP       */}
      {/* ========================================================== */}
      <section className="relative w-full overflow-hidden bg-black min-h-[420px] sm:min-h-[480px] lg:min-h-[560px] flex items-end">
        {/* Full-Width Background Video & High-Resolution PDF Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/hero_cover.jpg"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Gracefully fall back to image if video file is not yet uploaded
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/assets/hero_video.mp4" type="video/mp4" />
            <source src="/assets/hero_video.webm" type="video/webm" />
          </video>
          <img
            src="/assets/hero_cover.jpg"
            alt="Skandha Group Plotted Community Kadthal"
            className="w-full h-full object-cover object-center absolute inset-0 -z-10"
          />
          {/* Subtle bottom shadow gradient to anchor the 3-feature ribbon */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ========================================================== */}
      {/* 2. CONNECTED 3-FEATURE RIBBON (JB INFRA SIGNATURE)         */}
      {/* ========================================================== */}
      <section className="relative -mt-16 sm:-mt-20 lg:-mt-24 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Connected 3-Feature Ribbon With Chevron */}
        <div className="feature-ribbon-wrap">
          {/* Feature 1 (Left Box: White) */}
          <div className="feature-ribbon-item">
            <div className="feature-ribbon-icon shrink-0">
              <img
                src="/assets/feature_icon_handshake.png"
                alt="25 Years of Trusted Real Estate Excellence"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-white leading-tight">
                25 Years of Trusted Real Estate Excellence
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our expertise ensures every venture is planned and executed to perfection, offering secure investments and lasting value.
              </p>
            </div>
          </div>

          {/* Feature 2 (Middle Box: Brand Orange with Chevron Arrow) */}
          <div className="feature-ribbon-item">
            <div className="feature-ribbon-icon shrink-0">
              <img
                src="/assets/feature_icon_map.png"
                alt="Prime Locations for Future Growth"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="space-y-1.5 text-white">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-white leading-tight feature-ribbon-title">
                Prime Locations for Future Growth
              </h3>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed feature-ribbon-text">
                Invest in plots and villas designed for long-term appreciation and a premium lifestyle in high-growth corridors.
              </p>
            </div>
          </div>

          {/* Feature 3 (Right Box: White) */}
          <div className="feature-ribbon-item">
            <div className="feature-ribbon-icon shrink-0">
              <img
                src="/assets/feature_icon_tailored.png"
                alt="Tailored to Your Needs"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-white leading-tight">
                Tailored to Your Needs
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                At Skandha Group, we believe in creating homes that reflect your dreams. From customizable plots to modern villas, every project is designed with your lifestyle in mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections Wrapper */}
      <div className="space-y-16 mt-8 sm:mt-10">

      {/* ========================================================== */}
      {/* 3. PRIME PROJECTS CARDS (ALL 6 CARDS VISIBLE IN WINDOW)    */}
      {/* ========================================================== */}
      <section id="projects" className="bg-[#000000] text-white py-2 sm:py-4 scroll-mt-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading: Skandha Group */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
              <span className="w-3.5 h-3.5 bg-brand-orange rounded-sm inline-block shadow-sm" />
              <h2 className="font-bold tracking-widest uppercase">
                SKANDHA GROUP
              </h2>
            </div>
            {/* Orange horizontal accent rule matching Reference */}
            <div className="w-40 sm:w-52 h-[2px] bg-brand-orange mx-auto mt-2" />
          </div>

          {/* 6 Cards Grid: Exactly 6 cards, no titles under images, no play buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              {
                id: 1,
                name: 'Pristine Plotted Community',
                image: '/assets/site_bt_roads.jpg',
                link: '/plots'
              },
              {
                id: 2,
                name: 'Nature Valley Villas',
                image: '/assets/luxury_villa_day.jpg',
                link: '/#villas'
              },
              {
                id: 3,
                name: 'Serene Boulevard Enclave',
                image: '/assets/avenue_lighting.jpg',
                link: '/#lighting'
              },
              {
                id: 4,
                name: 'Resort Pool Pavilion',
                image: '/assets/pool_lighting.jpg',
                link: '/about'
              },
              {
                id: 5,
                name: 'Twilight Signature Estates',
                image: '/assets/villa_twilight_lighting.jpg',
                link: '/#lighting'
              },
              {
                id: 6,
                name: 'Grand Master Layout',
                image: '/assets/site_entrance_arch.jpg',
                link: '/plots'
              }
            ].map((proj) => {
              const isActive = activeProjectId === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProjectId(isActive ? null : proj.id)}
                  className={`transition-all duration-300 rounded-2xl p-2.5 cursor-pointer group relative ${
                    isActive
                      ? 'border-t-4 border-b-4 border-brand-orange bg-slate-900/60 shadow-2xl shadow-orange-500/20'
                      : 'border-t-4 border-b-4 border-transparent hover:border-t-brand-orange/60 hover:border-b-brand-orange/60'
                  }`}
                >
                  {/* Clean Image Container without play button or text */}
                  <div className="aspect-[16/10] sm:aspect-video w-full rounded-xl overflow-hidden relative bg-slate-950 border border-slate-800/80 shadow-lg">
                    <img
                      src={proj.image}
                      alt={proj.name}
                      className="w-full h-full object-cover transform group-hover:scale-106 transition-transform duration-700 ease-out"
                    />
                    {/* Subtle Ambient Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300 pointer-events-none" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 4. JB INFRA SIGNATURE: COMPANY STATISTICS COUNTER STRIP    */}
      {/* ========================================================== */}
      <section className="bg-[#0b0e14] py-16 border-y border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* Stat 1 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                <CountUp end={100} suffix="%" duration={1500} />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                100% Legal Compliance
              </h3>
              <p className="text-[11px] text-slate-400">
                DTCP Sanctioned &amp; TS RERA Registered
              </p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto mb-3">
                <Compass className="w-6 h-6" />
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                <CountUp end={10.5} decimals={1} suffix=" Ac" duration={1700} />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                10.50 Acres Developed
              </h3>
              <p className="text-[11px] text-slate-400">
                Gated Plotted Master Community
              </p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6" />
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                <CountUp end={96} duration={1600} />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                96 Surveyed Plots
              </h3>
              <p className="text-[11px] text-slate-400">
                183 to 672 Sq.Yards Ready for Spot Registration
              </p>
            </div>

            {/* Stat 4 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6" />
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                <CountUp end={40} suffix="' & 33'" duration={1500} />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Wide Asphalt Roads
              </h3>
              <p className="text-[11px] text-slate-400">
                Paired with Ac. 0.758 Green Central Park
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 5. JB INFRA SIGNATURE: ABOUT SKANDHA GROUPS (2-COL)        */}
      {/* ========================================================== */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Feature Visual with Play/Zoom Trigger */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-slate-900 group">
              <img
                src="/assets/site_entrance_arch.jpg"
                alt="Skandha Group Grand Entrance Arch & Security Portal"
                className="w-full h-[380px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 bg-[#0c0f17]/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700">
                Grand Entrance Arch &bull; 24/7 Security
              </div>

              {/* Center Play/Enlarge Button */}
              <button
                onClick={() => setSelectedPhotoModal({
                  title: 'Grand Entrance Arch & Security Portal',
                  category: 'Gated Security',
                  desc: 'Completed entrance portal with 24/7 security cabin, CCTV surveillance, and boundary wall fencing at Kadthal.',
                  image: '/assets/site_entrance_arch.jpg'
                })}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-brand-orange/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-brand-orange transition-all duration-300 group-hover:shadow-orange-500/50"
                aria-label="Inspect Entrance Arch"
              >
                <Maximize2 className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <span className="font-bold">Sanctioned Reality:</span> Authentic on-site gated entrance portal at Kadthal, Srisailam Highway.
              </div>
            </div>
          </div>

          {/* Right: Narrative & Legal Pedigree */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                <span className="h-px w-6 bg-brand-orange/40" />
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                ABOUT US
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                <span className="h-px w-6 bg-brand-orange/40" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                We Provide The Beauty of Your Home
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              <strong className="text-white">Skandha Group</strong> has been a trusted name in plotted real estate development, dedicated to creating affordable, high-growth, and legally pristine living spaces in and around Hyderabad.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              With a strong reputation for statutory compliance and architectural rigor, we specialize in DTCP and TS RERA sanctioned plotted layouts along Telangana's premier development corridors, including the high-speed Srisailam Highway (NH 765), Mucherla Future City, and Outer Ring Road (ORR) growth hubs.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-md hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>About More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg transition-all border border-slate-800"
              >
                <Calendar className="w-4 h-4 text-brand-orange" />
                <span>Schedule Visit</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 6. JB INFRA SIGNATURE: WHY CHOOSE SKANDHA GROUP            */}
      {/* ========================================================== */}
      <section className="bg-[#080d18] py-20 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Checklist */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                  <span className="h-px w-6 bg-brand-orange/40" />
                  <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                  WHY CHOOSE US
                  <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                  <span className="h-px w-6 bg-brand-orange/40" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  Why Choose Skandha Group?
                </h2>
              </div>

              {/* Caret Checklist Items */}
              <ul className="space-y-3.5 pt-2">
                {[
                  '100% Clear Titles & Instant Spot Registration',
                  'DTCP Sanctioned Layout (TLP NO. 87/2024/H)',
                  'TS RERA Registered Legal Protection (PO2400009081)',
                  'Prime Srisailam Highway (NH 765) & Future City Orbit',
                  '100% Vasthu Compliant East & West Alignments',
                  '40ft & 33ft Heavy-Duty Blacktop B.T Roads with Paver Curbs',
                  'Dedicated Overhead Potable Reservoir & Subsurface Drainage',
                  'Ac. 0.758 Cents Landscaped Central Green Park with Jogging Trail',
                  '2 Years Complimentary Maintenance & 24/7 Gated Security Cabin',
                  'Pre-Approved Bank Loans up to 75% with Leading Banks (SBI, HDFC, ICICI)'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                    <span className="w-5 h-5 rounded-full bg-orange-950/80 border border-brand-orange/40 text-brand-orange flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="w-3.5 h-3.5 text-brand-orange stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <a
                  href="/assets/skandha_brochure.pdf"
                  download="Skandha_Group_Kadthal_Brochure.pdf"
                  className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sanctioned Brochure</span>
                </a>
              </div>
            </div>

            {/* Right: Feature Landscape Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-slate-800 bg-slate-900 group">
                <img
                  src="/assets/site_landscape_park.jpg"
                  alt="Ac. 0.758 Landscaped Central Park Reserve"
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-[#0c0f17]/90 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700">
                  Ac. 0.758 Central Park Reserve
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-800">
                  <div className="font-bold text-white text-xs">
                    Sanctioned Green Lung Zone
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Lush lawn turf, flowering shade trees, children play fixtures, and paved jogging trail.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 7. BESPOKE VILLA CONCEPTS & ARCHITECTURAL SPLENDOR         */}
      {/* ========================================================== */}
      <section id="villas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <ScrollReveal direction="up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                <span className="h-px w-6 bg-brand-orange/40" />
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                VILLA ARCHITECTURE
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                <span className="h-px w-6 bg-brand-orange/40" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Craft Your Signature Villa Sanctuary
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Our gated venture offers surveyed residential villa plots engineered for bespoke contemporary homes with crisp white architecture, warm teakwood pergolas, light ash-grey travertine stone terraces, and lush private gardens.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#0e121b] p-1.5 rounded-xl border border-slate-800 shrink-0">
              {Object.keys(villaConfigs).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveVillaConfig(key)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeVillaConfig === key
                      ? 'bg-brand-orange text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {villaConfigs[key].sqYards}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Villa Showcase Card */}
        <ScrollReveal direction="up" delay={150}>
          <TiltCard
            maxTilt={4}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0b0e17] rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl transition-all duration-300"
          >
            {/* Left: High-End Villa Daylight Photography */}
            <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden shadow-md border border-slate-800 bg-black">
              <img
                src="/assets/luxury_villa_day.jpg"
                alt="Bespoke Contemporary Luxury Villa at Skandha Group Kadthal"
                className="w-full h-[360px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-[#0c0f17]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Daylight Villa Concept</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow border border-slate-800">
                <span>{villaConfigs[activeVillaConfig].builtUp}</span>
              </div>
            </div>

            {/* Right: Villa Specifications & Architectural Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-orange bg-orange-950/70 border border-orange-500/30 px-3 py-1 rounded-md">
                  {villaConfigs[activeVillaConfig].dimension} Dimension
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {villaConfigs[activeVillaConfig].type}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {villaConfigs[activeVillaConfig].desc}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Architectural Highlights:
                </div>
                <ul className="space-y-2.5">
                  {villaConfigs[activeVillaConfig].highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-md hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5"
                >
                  Request Villa Floorplans
                </button>
                <Link
                  to="/project"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg transition-all"
                >
                  View Plot Grid Matrix
                </Link>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>
      </section>

      {/* ========================================================== */}
      {/* 8. TWILIGHT AMBIANCE & CURATED LIGHTING SHOWCASE           */}
      {/* ========================================================== */}
      <section id="lighting" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                <span className="h-px w-6 bg-brand-orange/40" />
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                TWILIGHT ILLUMINATION
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                <span className="h-px w-6 bg-brand-orange/40" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Atmospheric Evening Ambiance
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Experience the tranquility of dusk across our landscaped avenues. Designed with energy-efficient warm amber lighting fixtures, illuminated tree avenues, and glowing private outdoor terraces that elevate evening living.
              </p>
            </div>

            {/* Scene Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shrink-0">
              {lightingScenes.map((scene, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLightingIndex(idx)}
                  className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeLightingIndex === idx
                      ? 'bg-brand-orange text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Scene {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Big Spotlight Card */}
        <ScrollReveal direction="up" delay={120}>
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900 group">
            <div className="relative h-[380px] sm:h-[500px] overflow-hidden">
              <img
                src={lightingScenes[activeLightingIndex].image}
                alt={lightingScenes[activeLightingIndex].title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
                <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-lg shadow-xs">
                  {lightingScenes[activeLightingIndex].badge}
                </span>
                <span className="bg-[#0c0f17]/80 backdrop-blur-md text-slate-200 text-xs font-medium px-3 py-1 rounded-lg border border-white/20">
                  {lightingScenes[activeLightingIndex].tag}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
                <div className="max-w-2xl space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-widest text-orange-400">
                    {lightingScenes[activeLightingIndex].category}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold">
                    {lightingScenes[activeLightingIndex].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {lightingScenes[activeLightingIndex].desc}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPhotoModal(lightingScenes[activeLightingIndex])}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all hover:scale-105 shrink-0 flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge View</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================================== */}
      {/* 9. ON-SITE INFRASTRUCTURE & REAL PHOTO GALLERY SHOWCASE    */}
      {/* ========================================================== */}
      <section id="developments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                <span className="h-px w-6 bg-brand-orange/40" />
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                ON-SITE REALITY
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                <span className="h-px w-6 bg-brand-orange/40" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Project Amenities &amp; Infrastructure
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light leading-relaxed">
                Authentic on-site development photography highlighting genuine completed avenues, landscaped park reserves, water utilities, and gated security portals.
              </p>
            </div>

            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow-md transition-all hover:-translate-y-0.5 shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Escorted Site Tour</span>
            </button>
          </div>
        </ScrollReveal>

        {/* 8 Photo Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {onSiteDevelopments.map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 50} direction="up">
              <TiltCard
                maxTilt={5}
                onClick={() => setSelectedPhotoModal(item)}
                className="group bg-[#0b0e17] rounded-2xl overflow-hidden border border-slate-800 shadow-md hover:shadow-2xl hover:border-brand-orange/50 transition-all duration-300 flex flex-col cursor-pointer h-full"
              >
                <div className="relative h-52 overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute top-3 left-3 bg-[#0c0f17]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700">
                    {item.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md text-brand-orange text-[10px] font-bold px-2.5 py-1 rounded-md shadow border border-slate-800">
                    {item.tag}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-brand-orange transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-brand-orange flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Inspect Development</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ========================================================== */}
      {/* 10. COMPLETE 12 AMENITIES GRID                             */}
      {/* ========================================================== */}
      <section id="amenities" className="bg-[#080d18] border-y border-slate-900 py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                <span className="h-px w-6 bg-brand-orange/40" />
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                SANCTIONED STANDARDS
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                <span className="h-px w-6 bg-brand-orange/40" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                Master Plan Features &amp; Infrastructure
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Built to high DTCP regulatory benchmarks ensuring long-term liveability and generational asset protection.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {amenities.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <ScrollReveal key={idx} delay={(idx % 4) * 60} direction="up">
                  <div className="bg-[#0b0e17] p-6 rounded-2xl border border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-orange/50 transition-all duration-200 space-y-3 group h-full">
                    <div className="w-12 h-12 rounded-xl bg-orange-950/70 border border-orange-500/30 group-hover:bg-brand-orange text-brand-orange group-hover:text-white flex items-center justify-center transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-white group-hover:text-brand-orange transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 11. SPECIAL LANDMARK & LOCATION HIGHLIGHTS EXPLORER        */}
      {/* ========================================================== */}
      <section id="landmarks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <ScrollReveal direction="up">
          <SpecialLandmarkView />
        </ScrollReveal>
      </section>

      {/* ========================================================== */}
      {/* 12. JB INFRA SIGNATURE: TESTIMONIALS ANIMATED CAROUSEL     */}
      {/* ========================================================== */}
      <section
        id="testimonials"
        className="bg-[#0b0e14] py-20 border-y border-slate-800 text-white scroll-mt-24 select-none"
        onMouseEnter={() => setIsTestimonialHovered(true)}
        onMouseLeave={() => setIsTestimonialHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <ScrollReveal direction="up">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                  <span className="h-px w-8 bg-brand-orange/40" />
                  <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                  TESTIMONIALS
                  <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                  <span className="h-px w-8 bg-brand-orange/40" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  What Our Clients Say
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-light">
                  Hear authentic feedback from verified families and investors who have partnered with Skandha Group.
                </p>
              </div>
            </ScrollReveal>

            {/* Carousel Control Buttons */}
            <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
              <button
                type="button"
                onClick={prevTestimonial}
                aria-label="Previous Testimonial"
                className="w-11 h-11 rounded-full bg-[#141824] hover:bg-brand-orange border border-slate-700 hover:border-brand-orange text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                type="button"
                onClick={nextTestimonial}
                aria-label="Next Testimonial"
                className="w-11 h-11 rounded-full bg-[#141824] hover:bg-brand-orange border border-slate-700 hover:border-brand-orange text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md group"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Smooth Carousel Overflow Window */}
          <div className="overflow-hidden relative py-2">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${activeTestimonial * 100}%)`
              }}
            >
              {testimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="w-full shrink-0 px-1 sm:px-2"
                >
                  <div className="bg-[#141824] rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px] hover:border-brand-orange/40 transition-colors">
                    {/* Background Decorative Quote Watermark */}
                    <Quote className="absolute right-6 bottom-6 w-24 h-24 text-slate-800/40 pointer-events-none" />

                    <div className="space-y-4 relative z-10 max-w-3xl">
                      {/* Top Badges: Stars & Highlight Pill */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange bg-orange-950/70 border border-orange-500/30 px-3 py-0.5 rounded-full">
                          {item.highlight}
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="text-sm sm:text-lg text-slate-200 leading-relaxed font-light italic">
                        &ldquo;{item.comment}&rdquo;
                      </p>
                    </div>

                    {/* Author Footer */}
                    <div className="pt-6 border-t border-slate-800/80 flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange font-bold text-base flex items-center justify-center shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-white">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {item.location} &bull; <span className="text-emerald-400 font-medium">Verified Plot Owner</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Navigation Indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTestimonial(idx)}
                aria-label={`Jump to testimonial ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === idx
                    ? 'w-8 bg-brand-orange shadow-md shadow-orange-500/40'
                    : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 15. VIP PRIVATE SITE VISIT INVITATION                      */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden group">
            <div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-200 bg-white/20 px-3 py-1 rounded-full">
                Complimentary Daily Site Tours
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Experience Our Kadthal Venture In Person
              </h2>
              <p className="text-sm sm:text-base text-orange-100 leading-relaxed font-light">
                Walk the wide blacktop avenues, inspect the landscaped Ac. 0.758 park, and experience the serenity of Kadthal just 1 minute from Maisigandi Temple.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="bg-white hover:bg-orange-50 text-brand-orange font-bold px-8 py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Private Escorted Visit</span>
                </button>
                <Link
                  to="/contact"
                  className="bg-orange-950/40 hover:bg-orange-950/60 border border-white/30 text-white font-bold px-7 py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Route &amp; Driving Map</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      </div>

      {/* On-Site Development / Lighting Photo Detail Modal */}
      {selectedPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#0b0e17] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden space-y-4 text-white"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-4 right-4 z-10 bg-slate-900/90 hover:bg-slate-800 text-white p-2 rounded-full shadow border border-slate-700 transition-colors"
            >
              &times;
            </button>
            <img
              src={selectedPhotoModal.image}
              alt={selectedPhotoModal.title}
              className="w-full max-h-[60vh] object-cover rounded-2xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-950/70 border border-orange-500/30 px-2.5 py-0.5 rounded">
                  {selectedPhotoModal.category}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Skandha Group Lifestyle Feature
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                {selectedPhotoModal.title}
              </h3>
              <p className="text-sm text-slate-300">
                {selectedPhotoModal.desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />

      {/* Lightbox */}
      <Lightbox
        items={gallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex(prev => (prev > 0 ? prev - 1 : gallery.length - 1))}
        onNext={() => setLightboxIndex(prev => (prev < gallery.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
}
