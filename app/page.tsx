"use client";

import { useEffect, useState, useRef, useCallback, useMemo, Suspense } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
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
// THREE.JS COMPONENTS
// ============================================================================

// Custom Heart Shape
function createHeartShape() {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  
  shape.moveTo(x + 0.25, y + 0.25);
  shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
  shape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35);
  shape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.2, y + 0.77, x + 0.25, y + 0.95);
  shape.bezierCurveTo(x + 0.7, y + 0.77, x + 0.85, y + 0.55, x + 0.85, y + 0.35);
  shape.bezierCurveTo(x + 0.85, y + 0.35, x + 0.85, y, x + 0.5, y);
  shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
  
  return shape;
}

// 3D Floating Heart
function FloatingHeart3D({ 
  position, 
  scale, 
  speed, 
  rotationSpeed,
  color 
}: { 
  position: [number, number, number]; 
  scale: number; 
  speed: number;
  rotationSpeed: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  const geometry = useMemo(() => {
    const shape = createHeartShape();
    const extrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    meshRef.current.position.y = initialY + Math.sin(time * speed + offset) * 0.4;
    meshRef.current.position.x = position[0] + Math.sin(time * speed * 0.5 + offset) * 0.2;
    meshRef.current.rotation.y = Math.sin(time * rotationSpeed + offset) * 0.4;
    meshRef.current.rotation.z = Math.sin(time * rotationSpeed * 0.7 + offset) * 0.15;
  });
  
  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry}
      position={position} 
      scale={scale}
      rotation={[Math.PI, 0, Math.PI]}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.15}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Sparkle Particle
function Sparkle({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const baseScale = useMemo(() => 0.015 + Math.random() * 0.025, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    meshRef.current.scale.setScalar(baseScale * (0.5 + Math.sin(time * 3 + offset) * 0.5));
    meshRef.current.position.y = position[1] + Math.sin(time * speed + offset) * 0.6;
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#fffaf0" transparent opacity={0.9} />
    </mesh>
  );
}

// Particle Field
function ParticleField() {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 4 - 2,
        ] as [number, number, number],
      });
    }
    return temp;
  }, []);
  
  return (
    <>
      {particles.map((particle, i) => (
        <Sparkle key={i} position={particle.position} />
      ))}
    </>
  );
}

// Rose Petal
function RosePetal({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.2 + Math.random() * 0.3, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const initialY = position[1];
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    meshRef.current.position.y = initialY - (time * speed * 0.2) % 12 + 6;
    meshRef.current.position.x = position[0] + Math.sin(time * 0.4 + offset) * 1;
    meshRef.current.rotation.x = time * 0.2 + offset;
    meshRef.current.rotation.z = Math.sin(time * 0.3 + offset) * 0.6;
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <circleGeometry args={[0.06, 6]} />
      <meshStandardMaterial
        color="#fda4af"
        emissive="#fda4af"
        emissiveIntensity={0.25}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Petal Field
function PetalField() {
  const petals = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 25; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 12,
          Math.random() * 12,
          (Math.random() - 0.5) * 5 - 2,
        ] as [number, number, number],
      });
    }
    return temp;
  }, []);
  
  return (
    <>
      {petals.map((petal, i) => (
        <RosePetal key={i} position={petal.position} />
      ))}
    </>
  );
}

// Main 3D Scene
function Scene() {
  const hearts = useMemo(() => {
    const heartConfigs = [];
    const colors = ["#f43f5e", "#fb7185", "#fda4af", "#fecdd3", "#e11d48", "#d4a574"];
    
    for (let i = 0; i < 10; i++) {
      heartConfigs.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 10,
          -2 - Math.random() * 4,
        ] as [number, number, number],
        scale: 0.12 + Math.random() * 0.2,
        speed: 0.25 + Math.random() * 0.35,
        rotationSpeed: 0.15 + Math.random() * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return heartConfigs;
  }, []);
  
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#fff5f7" />
      <directionalLight position={[-5, -5, -5]} intensity={0.25} color="#fda4af" />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#f43f5e" distance={12} />
      
      {hearts.map((heart, i) => (
        <FloatingHeart3D
          key={i}
          position={heart.position}
          scale={heart.scale}
          speed={heart.speed}
          rotationSpeed={heart.rotationSpeed}
          color={heart.color}
        />
      ))}
      
      <ParticleField />
      <PetalField />
    </>
  );
}

// Three.js Background Canvas
function ThreeBackground() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ============================================================================
// ICONS - Premium Enhanced
// ============================================================================

const HeartIcon = ({
  className = "",
  style,
  filled = true,
}: {
  className?: string
  style?: React.CSSProperties
  filled?: boolean
}) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={filled ? 0 : 1.5}
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const SparkleIcon = ({ 
  className = "", 
  style 
}: { 
  className?: string;
  style?: React.CSSProperties; // <-- Added this
}) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    style={style} // <-- Added this
    aria-hidden="true"
  >
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
  </svg>
);

const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

// ============================================================================
// FLOATING HEARTS BACKGROUND - 2D Fallback with Premium Effects
// ============================================================================

interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
}

function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const colors = ["#f43f5e", "#fb7185", "#fda4af", "#fecdd3", "#d4a574"];
    const generated: FloatingHeart[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 16 + Math.random() * 16,
      duration: 16 + Math.random() * 12,
      delay: Math.random() * 15,
      opacity: 0.08 + Math.random() * 0.12,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setHearts(generated);
  }, []);

  if (hearts.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-[2]"
      aria-hidden="true"
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            bottom: "-40px",
            opacity: heart.opacity,
            color: heart.color,
          }}
          animate={{
            y: [0, "-110vh"],
            x: [0, Math.sin(heart.id) * 30, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: heart.duration, repeat: Infinity, delay: heart.delay, ease: "linear" },
            x: { duration: heart.duration / 2, repeat: Infinity, delay: heart.delay, ease: "easeInOut" },
            rotate: { duration: heart.duration * 2, repeat: Infinity, ease: "linear" },
          }}
        >
          <HeartIcon
            className="drop-shadow-lg"
            style={{ width: heart.size, height: heart.size, filter: `drop-shadow(0 0 ${heart.size/3}px ${heart.color}40)` } as React.CSSProperties}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// TOUCH HEART BURST EFFECT
// ============================================================================

interface BurstHeart {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  color: string;
}

function HeartBurst({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  const hearts: BurstHeart[] = useMemo(() => {
    const colors = ["#f43f5e", "#fb7185", "#fda4af", "#d4a574", "#e11d48"];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      angle: (i / 8) * Math.PI * 2,
      scale: 0.6 + Math.random() * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, heart.scale, heart.scale * 0.5],
            x: Math.cos(heart.angle) * 60,
            y: Math.sin(heart.angle) * 60,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute"
          style={{ color: heart.color }}
        >
          <HeartIcon className="w-6 h-6" />
        </motion.div>
      ))}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 0] }}
        transition={{ duration: 0.6 }}
        className="absolute text-rose-400"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <HeartIcon className="w-10 h-10" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// TOAST NOTIFICATION - Premium Glass Effect
// ============================================================================

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 6000);
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
          className="fixed bottom-6 left-4 right-4 z-[60] mx-auto max-w-sm"
        >
          <div className="glass-card-strong rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <SparkleIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-sparkle" />
              <p className="text-sm text-gray-700 leading-relaxed font-[family-name:var(--font-sans)]">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 text-xs text-rose-400 hover:text-rose-500 transition-colors font-medium"
              aria-label="Close notification"
            >
              ✨ Tap to close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// HERO SECTION - Premium with 3D Effects
// ============================================================================

interface HeroProps {
  onBegin: () => void;
  onEasterEgg: () => void;
}

function Hero({ onBegin, onEasterEgg }: HeroProps) {
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.9]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

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
    <motion.section 
      style={{ opacity, scale, y }}
      className="min-h-[100dvh] min-h-screen flex flex-col items-center justify-center px-6 py-12 relative"
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-rose-200/30 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-100/20 via-transparent to-transparent pointer-events-none" style={{ top: '30%' }} />

      {/* Content positioned slightly above center for elegance */}
      <div className="flex flex-col items-center -mt-8 relative z-10">
        
        {/* Decorative sparkles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2"
        >
          <SparkleIcon className="w-5 h-5 text-amber-300 animate-sparkle" />
        </motion.div>
        
        {/* Premium glowing heart with rings */}
        <motion.button
          onClick={handleHeartTap}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 1.2, delay: 0.2 }}
          className="relative mb-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-4 rounded-full group"
          aria-label="Heart icon - tap 3 times for a surprise"
        >
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full bg-rose-400/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute -inset-4 rounded-full border-2 border-rose-300/30 animate-pulse" />
          <div className="absolute -inset-8 rounded-full border border-rose-200/20" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full animate-glow-pulse" />
          
          {/* Main heart */}
          <div className="relative">
            <HeartIcon className="w-24 h-24 sm:w-28 sm:h-28 text-rose-400 animate-heartbeat relative z-10 drop-shadow-2xl group-active:scale-90 transition-transform" 
              style={{ filter: 'drop-shadow(0 0 20px rgba(244, 63, 94, 0.4))' }} 
            />
            {/* Inner glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <HeartIcon className="w-20 h-20 sm:w-24 sm:h-24 text-rose-300/50 blur-sm" />
            </div>
          </div>
        </motion.button>

        {/* Premium Title with gold shimmer */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-[family-name:var(--font-script)] text-6xl sm:text-7xl md:text-8xl text-center mb-4 tracking-tight text-shadow-luxury"
          style={{ 
            background: 'linear-gradient(135deg, #f43f5e 0%, #d4a574 50%, #f43f5e 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gold-shimmer 4s linear infinite',
          }}
        >
          {HERO_CONTENT.title}
        </motion.h1>

        {/* Subtitle with elegant styling */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-[family-name:var(--font-serif)] text-xl sm:text-2xl text-rose-400/90 text-center mb-12 font-medium tracking-wide"
        >
          {HERO_CONTENT.subtitle}
        </motion.p>

        {/* Premium CTA Button */}
        <motion.button
          onClick={onBegin}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500 text-white px-10 py-5 rounded-full text-lg sm:text-xl font-semibold shadow-2xl min-h-[64px] min-w-[220px] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-4 overflow-hidden animate-button-glow"
          aria-label="Begin the experience"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <span className="relative flex items-center gap-3">
            {HERO_CONTENT.buttonText} 
            <HeartIcon className="w-5 h-5 animate-heartbeat" />
          </span>
        </motion.button>
        
        {/* Decorative text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-sm text-rose-300 font-[family-name:var(--font-sans)]"
        >
          ✨ Made with infinite love ✨
        </motion.p>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-rose-300/70 font-[family-name:var(--font-sans)]">scroll</span>
          <svg
            className="w-6 h-6 text-rose-300"
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
    </motion.section>
  );
}

// ============================================================================
// LOVE NOTE SECTION - Premium Glass Card
// ============================================================================

function LoveNote() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28 px-5"
      aria-labelledby="love-note-heading"
    >
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="glass-card-strong rounded-[2rem] p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-rose-200/30 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-200/20 to-transparent rounded-tl-full" />
          
          {/* Top decorative elements */}
          <div className="flex justify-center mb-8 relative">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <SparkleIcon className="absolute -left-8 -top-2 w-4 h-4 text-amber-300 animate-sparkle" />
            </motion.div>
            <HeartIcon className="w-10 h-10 text-rose-400 animate-gentle-float" style={{ filter: 'drop-shadow(0 4px 12px rgba(244, 63, 94, 0.3))' }} />
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <SparkleIcon className="absolute -right-8 -top-2 w-4 h-4 text-amber-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
            </motion.div>
          </div>

          {/* Greeting */}
          <h2
            id="love-note-heading"
            className="font-[family-name:var(--font-script)] text-4xl sm:text-5xl text-rose-500 text-center mb-8"
            style={{ textShadow: '0 2px 15px rgba(244, 63, 94, 0.2)' }}
          >
            {LOVE_NOTE_CONTENT.greeting}
          </h2>

          {/* Paragraphs */}
          <div className="space-y-6">
            {LOVE_NOTE_CONTENT.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + index * 0.15 }}
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
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-10 text-center"
          >
            <div className="inline-block">
              <p className="font-[family-name:var(--font-script)] text-xl text-rose-400">
                {LOVE_NOTE_CONTENT.signature}
              </p>
              <p className="font-[family-name:var(--font-script)] text-3xl text-rose-500 mt-2"
                style={{ 
                  background: 'linear-gradient(135deg, #f43f5e 0%, #d4a574 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {LOVE_NOTE_CONTENT.signatureName}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// TIMELINE SECTION - Premium Cards
// ============================================================================

function Timeline() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 px-5"
      aria-labelledby="timeline-heading"
    >
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SparkleIcon className="w-6 h-6 text-amber-400 mx-auto mb-4 animate-sparkle" />
          <h2
            id="timeline-heading"
            className="font-[family-name:var(--font-script)] text-5xl sm:text-6xl text-center"
            style={{ 
              background: 'linear-gradient(135deg, #f43f5e 0%, #d4a574 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Our Story
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Premium vertical line with gradient */}
          <div className="absolute left-6 sm:left-7 top-4 bottom-4 w-0.5 bg-gradient-to-b from-rose-300 via-amber-300 to-rose-400 rounded-full" />

          {/* Memory cards */}
          <div className="space-y-8">
            {TIMELINE_MEMORIES.map((memory, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className="relative pl-16 sm:pl-18"
              >
                {/* Timeline dot - premium with glow */}
                <div className="absolute left-4 sm:left-5 top-2 w-5 h-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg flex items-center justify-center z-10"
                  style={{ boxShadow: '0 0 15px rgba(244, 63, 94, 0.4)' }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Card */}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card rounded-2xl p-6 sm:p-7 transition-all duration-300 cursor-default"
                >
                  <span className="inline-block text-xs sm:text-sm text-amber-600 font-semibold uppercase tracking-wider mb-3 px-3 py-1 bg-amber-50 rounded-full">
                    {memory.date}
                  </span>
                  <h3 className="font-[family-name:var(--font-serif)] text-xl sm:text-2xl text-gray-800 mb-3 font-semibold">
                    {memory.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {memory.description}
                  </p>
                </motion.div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// REASONS SECTION - Premium Cards with Icons
// ============================================================================

function Reasons() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 px-5 relative overflow-hidden"
      aria-labelledby="reasons-heading"
    >
      {/* Premium background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-50/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/30 via-transparent to-amber-50/30 pointer-events-none" />
      
      <div className="max-w-lg mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center gap-2 mb-4">
            <HeartIcon className="w-5 h-5 text-rose-400 animate-heartbeat" style={{ animationDelay: '0s' }} />
            <HeartIcon className="w-5 h-5 text-rose-300 animate-heartbeat" style={{ animationDelay: '0.2s' }} />
            <HeartIcon className="w-5 h-5 text-rose-400 animate-heartbeat" style={{ animationDelay: '0.4s' }} />
          </div>
          <h2
            id="reasons-heading"
            className="font-[family-name:var(--font-script)] text-5xl sm:text-6xl text-center mb-4"
            style={{ 
              background: 'linear-gradient(135deg, #f43f5e 0%, #d4a574 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Why I Love You
          </h2>
          <p className="text-center text-rose-400/80 text-sm font-[family-name:var(--font-sans)]">
            Just a few of the endless reasons ✨
          </p>
        </motion.div>

        <div className="space-y-4">
          {REASONS_TO_LOVE.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card rounded-2xl p-5 sm:p-6 cursor-default group transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                  style={{ boxShadow: '0 4px 15px rgba(244, 63, 94, 0.3)' }}
                >
                  <HeartIcon className="w-5 h-5 text-white" />
                </div>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-[family-name:var(--font-serif)] pt-1">
                  {reason.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-10 gap-3"
        >
          <SparkleIcon className="w-4 h-4 text-amber-300 animate-sparkle" />
          <span className="text-sm text-rose-300">and so many more...</span>
          <SparkleIcon className="w-4 h-4 text-amber-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// SURPRISE SECTION - Premium Reveal
// ============================================================================

function Surprise() {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 px-5"
      aria-labelledby="surprise-heading"
    >
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <StarIcon className="w-8 h-8 text-amber-400 mx-auto mb-4 animate-sparkle" />
          <h2
            id="surprise-heading"
            className="font-[family-name:var(--font-script)] text-5xl sm:text-6xl"
            style={{ 
              background: 'linear-gradient(135deg, #f43f5e 0%, #d4a574 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {SURPRISE_CONTENT.title}
          </h2>
        </motion.div>

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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white px-10 py-5 rounded-full text-lg sm:text-xl font-semibold shadow-2xl min-h-[64px] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-4 animate-button-glow overflow-hidden"
                aria-expanded={isRevealed}
                aria-controls="surprise-content"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-3">
                  🎁 {SURPRISE_CONTENT.buttonText}
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              id="surprise-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="glass-card-strong rounded-[2rem] p-8 sm:p-12 relative overflow-hidden"
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-rose-200/40 to-transparent rounded-br-full" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-tl-full" />
              
              {/* Heart animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, damping: 10 }}
                className="mb-8"
              >
                <div className="relative inline-block">
                  <HeartIcon className="w-16 h-16 text-rose-400 animate-heartbeat" 
                    style={{ filter: 'drop-shadow(0 0 20px rgba(244, 63, 94, 0.4))' }} 
                  />
                  <SparkleIcon className="absolute -top-2 -right-2 w-5 h-5 text-amber-400 animate-sparkle" />
                  <SparkleIcon className="absolute -bottom-1 -left-2 w-4 h-4 text-amber-300 animate-sparkle" style={{ animationDelay: '0.3s' }} />
                </div>
              </motion.div>

              {/* Title */}
              <h3 className="font-[family-name:var(--font-script)] text-4xl sm:text-5xl mb-6"
                style={{ 
                  background: 'linear-gradient(135deg, #f43f5e 0%, #d4a574 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {SURPRISE_CONTENT.revealTitle}
              </h3>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-[family-name:var(--font-serif)] text-base sm:text-lg text-gray-600 leading-relaxed mb-8"
              >
                {SURPRISE_CONTENT.revealMessage}
              </motion.p>

              {/* Signature */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="font-[family-name:var(--font-script)] text-xl text-rose-400">
                  {SURPRISE_CONTENT.revealSignature}
                </p>
                <p className="font-[family-name:var(--font-script)] text-3xl mt-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #f43f5e 0%, #d4a574 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
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
// FOOTER - Premium
// ============================================================================

function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="py-16 px-5 text-center relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Hearts decoration */}
        <div className="flex items-center gap-3">
          <SparkleIcon className="w-4 h-4 text-amber-300 animate-sparkle" />
          <HeartIcon className="w-8 h-8 text-rose-400 animate-gentle-float" />
          <SparkleIcon className="w-4 h-4 text-amber-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Credit */}
        <p className="text-sm text-rose-400/90 font-[family-name:var(--font-sans)] font-medium">
          {FOOTER_CONTENT.credit}
        </p>
        
        {/* Love message */}
        <p className="text-rose-300/70 font-[family-name:var(--font-script)] text-lg">
          Forever & Always 💕
        </p>
      </motion.div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE - Premium with 3D Background
// ============================================================================

export default function Home() {
  const [showToast, setShowToast] = useState(false);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const loveNoteRef = useRef<HTMLDivElement>(null);
  const burstIdRef = useRef(0);

  const handleBegin = () => {
    loveNoteRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEasterEgg = useCallback(() => {
    setShowToast(true);
  }, []);

  const handleCloseToast = useCallback(() => {
    setShowToast(false);
  }, []);
  
  // Handle touch/click for heart burst effect
  const handleScreenTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newBurst = {
      id: burstIdRef.current++,
      x: clientX,
      y: clientY,
    };
    
    setBursts(prev => [...prev, newBurst]);
  }, []);
  
  const removeBurst = useCallback((id: number) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  }, []);

  return (
    <main 
      className="relative overflow-x-hidden"
      onTouchStart={handleScreenTap}
    >
      {/* Three.js 3D Background */}
      <ThreeBackground />
      
      {/* 2D Floating Hearts */}
      <FloatingHearts />
      
      {/* Heart Burst Effects */}
      {bursts.map(burst => (
        <HeartBurst 
          key={burst.id} 
          x={burst.x} 
          y={burst.y} 
          onComplete={() => removeBurst(burst.id)} 
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10">
        <Hero onBegin={handleBegin} onEasterEgg={handleEasterEgg} />

        <div ref={loveNoteRef}>
          <LoveNote />
        </div>

        <Timeline />
        <Reasons />
        <Surprise />
        <Footer />
      </div>

      {/* Toast Notification */}
      <Toast
        message={EASTER_EGG_MESSAGE}
        isVisible={showToast}
        onClose={handleCloseToast}
      />
    </main>
  );
}
