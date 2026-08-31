import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

const HERO_SLIDES = [
  {
    tag: 'AUTUMN / WINTER 2026',
    title: 'THE MONARCH CASHMERE COLLECTION',
    description: 'Impeccable Italian tailoring meets ethically sourced 100% Mongolian cashmere. Crafted for timeless elegance.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    discount: '20% OFF WITH "STYLE20"'
  },
  {
    tag: 'LIMITED EDITION',
    title: 'VANGUARD BESPOKE LEATHER',
    description: 'Precision hand-cut lambskin outerwear with signature champagne gold detailing.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop',
    discount: 'EXCLUSIVELY ON STYLEHUB'
  }
];

export const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <div className="relative w-full max-w-7xl mx-auto my-6 px-4">
      <div className="relative h-[480px] lg:h-[540px] rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl">
        
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col justify-center max-w-2xl px-8 lg:px-16 space-y-6">
          <div className="flex items-center gap-2">
            <span className="badge-gold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {slide.tag}
            </span>
            <span className="text-xs font-semibold text-white/70 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              {slide.discount}
            </span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] leading-none">
            {slide.title}
          </h1>

          <p className="text-sm lg:text-base text-slate-300 leading-relaxed font-light">
            {slide.description}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button onClick={onShopNow} className="btn-gold">
              Explore Collection
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-8 flex gap-2 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === idx ? 'w-8 bg-[var(--accent-gold)]' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Feature Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold">Complimentary Express</h4>
            <p className="text-[11px] text-[var(--text-muted)]">Free shipping over $200</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold">Guaranteed Authenticity</h4>
            <p className="text-[11px] text-[var(--text-muted)]">100% Certified Luxury</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold">30-Day Doorstep Return</h4>
            <p className="text-[11px] text-[var(--text-muted)]">Hassle-free exchange policy</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold">Bespoke Concierge</h4>
            <p className="text-[11px] text-[var(--text-muted)]">24/7 Styling advice</p>
          </div>
        </div>
      </div>
    </div>
  );
};
