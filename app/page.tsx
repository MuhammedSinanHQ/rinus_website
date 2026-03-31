"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  HERO_CONTENT,
  LOVE_NOTE_CONTENT,
  TIMELINE_MEMORIES,
  REASONS_TO_LOVE,
  SURPRISE_CONTENT,
  FOOTER_CONTENT,
  EASTER_EGG_MESSAGE,
} from "./constants";

// ============================================================================
// ICONS
// ============================================================================

const HeartIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// ============================================================================
// FLOATING HEARTS BACKGROUND
// ============================================================================

interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const generated: FloatingHeart[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 14 + Math.random() * 12,
      duration: 14 + Math.random() * 10,
      delay: Math.random() * 12,
      opacity: 0.06 + Math.random() * 0.08,
    }));
    setHearts(generated);
  }, []);

  if (hearts.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-rose-400"
          style={{
            left: `${heart.x}%`,
            bottom: "-30px",
            opacity: heart.opacity,
          }}
          animate={{
            y: [0, "-105vh"],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
        >
          <HeartIcon
            className="drop-shadow-sm"
            style={{ width: heart.size, height: heart.size } as React.CSSProperties}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// TOAST NOTIFICATION
// ============================================================================

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-rose-100">
            <p className="text-sm text-gray-700 leading-relaxed font-[family-name:var(--font-sans)]">
              {message}
            </p>
            <button
              onClick={onClose}
              className="mt-3 text-xs text-rose-400 hover:text-rose-500 transition-colors"
              aria-label="Close notification"
            >
              Tap to close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

interface HeroProps {
  onBegin: () => void;
  onEasterEgg: () => void;
}

function Hero({ onBegin, onEasterEgg }: HeroProps) {
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleHeartTap = () => {
    setTapCount((prev) => prev + 1);

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    tapTimerRef.current = setTimeout(() => {
      setTapCount(0);
    }, 600);

    if (tapCount + 1 >= 3) {
      onEasterEgg();
      setTapCount(0);
    }
  };

  return (
    <section className="min-h-[100dvh] min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-rose-100/40 via-transparent to-transparent pointer-events-none" />

      {/* Content positioned slightly above center for elegance */}
      <div className="flex flex-col items-center -mt-12 relative z-10">
        {/* Glowing heart */}
        <motion.button
          onClick={handleHeartTap}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 1.2, delay: 0.2 }}
          className="relative mb-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-4 rounded-full"
          aria-label="Heart icon - tap 3 times for a surprise"
        >
          <div className="absolute inset-0 rounded-full animate-glow-pulse" />
          <HeartIcon className="w-20 h-20 sm:w-24 sm:h-24 text-rose-400 animate-heartbeat relative z-10 drop-shadow-lg" />
        </motion.button>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-[family-name:var(--font-script)] text-5xl sm:text-6xl md:text-7xl text-rose-500 text-center mb-3 tracking-tight"
        >
          {HERO_CONTENT.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-[family-name:var(--font-serif)] text-lg sm:text-xl text-rose-400/80 text-center mb-10 font-medium"
        >
          {HERO_CONTENT.subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={onBegin}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-gradient-to-r from-rose-400 to-rose-500 text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-shadow min-h-[56px] min-w-[200px] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-4"
          aria-label="Begin the experience"
        >
          {HERO_CONTENT.buttonText} <span aria-hidden="true">❤️</span>
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-rose-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// LOVE NOTE SECTION
// ============================================================================

function LoveNote() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-16 sm:py-24 px-5"
      aria-labelledby="love-note-heading"
    >
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-7 sm:p-10 shadow-lg border border-rose-100/60"
          style={{
            boxShadow:
              "0 4px 24px rgba(244, 63, 94, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Decorative heart */}
          <div className="flex justify-center mb-6">
            <HeartIcon className="w-8 h-8 text-rose-300" />
          </div>

          {/* Greeting */}
          <h2
            id="love-note-heading"
            className="font-[family-name:var(--font-script)] text-3xl sm:text-4xl text-rose-500 text-center mb-6"
          >
            {LOVE_NOTE_CONTENT.greeting}
          </h2>

          {/* Paragraphs */}
          <div className="space-y-5">
            {LOVE_NOTE_CONTENT.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                className="font-[family-name:var(--font-serif)] text-base sm:text-lg text-gray-600 leading-relaxed text-center"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 text-center"
          >
            <p className="font-[family-name:var(--font-script)] text-xl text-rose-400">
              {LOVE_NOTE_CONTENT.signature}
            </p>
            <p className="font-[family-name:var(--font-script)] text-2xl text-rose-500 mt-1">
              {LOVE_NOTE_CONTENT.signatureName}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// TIMELINE SECTION
// ============================================================================

function Timeline() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 px-5"
      aria-labelledby="timeline-heading"
    >
      <div className="max-w-lg mx-auto">
        <motion.h2
          id="timeline-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-[family-name:var(--font-script)] text-4xl sm:text-5xl text-rose-500 text-center mb-12"
        >
          Our Story
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-rose-200 via-rose-300 to-rose-200" />

          {/* Memory cards */}
          <div className="space-y-8">
            {TIMELINE_MEMORIES.map((memory, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.12 }}
                className="relative pl-14 sm:pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-3 sm:left-4 top-1 w-4 h-4 rounded-full bg-white border-2 border-rose-400 shadow-sm" />

                {/* Card */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-md border border-rose-100/50 hover:shadow-lg transition-shadow duration-300">
                  <span className="text-xs sm:text-sm text-rose-400 font-medium uppercase tracking-wider">
                    {memory.date}
                  </span>
                  <h3 className="font-[family-name:var(--font-serif)] text-lg sm:text-xl text-gray-800 mt-2 mb-2 font-semibold">
                    {memory.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {memory.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// REASONS SECTION
// ============================================================================

function Reasons() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 px-5 bg-gradient-to-b from-transparent via-rose-50/50 to-transparent"
      aria-labelledby="reasons-heading"
    >
      <div className="max-w-lg mx-auto">
        <motion.h2
          id="reasons-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-[family-name:var(--font-script)] text-4xl sm:text-5xl text-rose-500 text-center mb-4"
        >
          Why I Love You
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-rose-400/70 text-sm mb-10"
        >
          Just a few of the endless reasons
        </motion.p>

        <div className="space-y-4">
          {REASONS_TO_LOVE.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-rose-100/50 hover:shadow-md transition-all duration-200 cursor-default"
            >
              <div className="flex items-start gap-4">
                <HeartIcon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {reason.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SURPRISE SECTION
// ============================================================================

function Surprise() {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 px-5"
      aria-labelledby="surprise-heading"
    >
      <div className="max-w-lg mx-auto text-center">
        <motion.h2
          id="surprise-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-[family-name:var(--font-script)] text-4xl sm:text-5xl text-rose-500 mb-8"
        >
          {SURPRISE_CONTENT.title}
        </motion.h2>

        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <motion.button
                onClick={() => setIsRevealed(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-rose-400 to-pink-400 text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-shadow min-h-[56px] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-4 animate-glow-pulse"
                aria-expanded={isRevealed}
                aria-controls="surprise-content"
              >
                <span aria-hidden="true">🎁</span> {SURPRISE_CONTENT.buttonText}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              id="surprise-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-7 sm:p-10 shadow-xl border border-rose-100/60"
            >
              {/* Heart emoji */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-5xl mb-6"
                aria-hidden="true"
              >
                💕
              </motion.div>

              {/* Title */}
              <h3 className="font-[family-name:var(--font-script)] text-3xl sm:text-4xl text-rose-500 mb-5">
                {SURPRISE_CONTENT.revealTitle}
              </h3>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-[family-name:var(--font-serif)] text-base sm:text-lg text-gray-600 leading-relaxed mb-6"
              >
                {SURPRISE_CONTENT.revealMessage}
              </motion.p>

              {/* Signature */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-[family-name:var(--font-script)] text-lg text-rose-400">
                  {SURPRISE_CONTENT.revealSignature}
                </p>
                <p className="font-[family-name:var(--font-script)] text-2xl text-rose-500 mt-1">
                  {SURPRISE_CONTENT.revealName}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="py-12 px-5 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* Small heart */}
        <HeartIcon className="w-6 h-6 text-rose-300 mx-auto mb-4" />

        {/* Credit */}
        <p className="text-sm text-rose-400/80 font-[family-name:var(--font-sans)]">
          {FOOTER_CONTENT.credit}
        </p>
      </motion.div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function Home() {
  const [showToast, setShowToast] = useState(false);
  const loveNoteRef = useRef<HTMLDivElement>(null);

  const handleBegin = () => {
    loveNoteRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEasterEgg = useCallback(() => {
    setShowToast(true);
  }, []);

  const handleCloseToast = useCallback(() => {
    setShowToast(false);
  }, []);

  return (
    <main className="relative overflow-x-hidden">
      <FloatingHearts />

      <Hero onBegin={handleBegin} onEasterEgg={handleEasterEgg} />

      <div ref={loveNoteRef}>
        <LoveNote />
      </div>

      <Timeline />
      <Reasons />
      <Surprise />
      <Footer />

      <Toast
        message={EASTER_EGG_MESSAGE}
        isVisible={showToast}
        onClose={handleCloseToast}
      />
    </main>
  );
}
