<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)
const visualRef = ref(null)
const isSwapped = ref(false)

// Parallax state with smooth damping
const mouseX = ref(0)
const mouseY = ref(0)
let targetX = 0
let targetY = 0
let rafId = null

const updateParallax = () => {
  // Smooth lerp towards target
  mouseX.value += (targetX - mouseX.value) * 0.08
  mouseY.value += (targetY - mouseY.value) * 0.08

  if (Math.abs(targetX - mouseX.value) > 0.001 || Math.abs(targetY - mouseY.value) > 0.001) {
    rafId = requestAnimationFrame(updateParallax)
  } else {
    rafId = null
  }
}

const handleMouseMove = (e) => {
  if (!visualRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = visualRef.value.getBoundingClientRect()
  const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
  const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)

  // Clamp within [-1, 1]
  targetX = Math.max(-1, Math.min(1, x))
  targetY = Math.max(-1, Math.min(1, y))

  if (!rafId) {
    rafId = requestAnimationFrame(updateParallax)
  }
}

const handleMouseLeave = () => {
  targetX = 0
  targetY = 0
  if (!rafId) {
    rafId = requestAnimationFrame(updateParallax)
  }
}

onMounted(() => {
  // Trigger entrance after a short delay for a clean load-in
  requestAnimationFrame(() => {
    setTimeout(() => { visible.value = true }, 80)
  })
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <section id="hero" class="hero" :class="{ 'hero--visible': visible }" aria-labelledby="hero-heading">
    <!-- Background decorative shape -->
    <div class="hero__bg-stripe" aria-hidden="true"></div>

    <div class="hero__container">
      <!-- Left: Text content (Strictly preserved) -->
      <div class="hero__content">
        <p class="hero__overline" aria-hidden="true">Creative Design Studio</p>

        <h1 id="hero-heading" class="hero__heading">
          <span class="hero__heading-line hero__heading-line--1">We make</span>
          <span class="hero__heading-line hero__heading-line--2">
            things
            <em class="hero__heading-italic">feel</em>
          </span>
          <span class="hero__heading-line hero__heading-line--3">alive.</span>
        </h1>

        <p class="hero__tagline">Beyond what you see.</p>

        <div class="hero__actions">
          <a href="#products" class="hero__btn hero__btn--primary">See our work</a>
          <a href="#contact" class="hero__btn hero__btn--ghost">Start a project</a>
        </div>
      </div>

      <!-- Right: Experimental Art Collage -->
      <div ref="visualRef" class="hero__visual" aria-hidden="true" @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave">
        <div class="collage" :class="{ 'collage--swapped': isSwapped }" :style="{
          '--mouse-x': mouseX,
          '--mouse-y': mouseY
        }" @mouseenter="isSwapped = true" @mouseleave="isSwapped = false" @click="isSwapped = !isSwapped">
          <!-- Ambient gradient glow behind the composition -->
          <div class="collage__glow"></div>

          <!-- LAYER 1: Back Editorial Poster (angled left) -->
          <div class="collage__float collage__float--back">
            <article class="collage__card collage__card--back">
              <img src="/images/banners/banner_02.png" alt="AVP STUDIO Creative Banner" class="collage__card-img"
                loading="lazy" draggable="false" />
            </article>
          </div>

          <!-- LAYER 2: Dominant Central Artwork Poster (angled right) -->
          <div class="collage__float collage__float--main">
            <article class="collage__card collage__card--main">
              <img src="/images/banners/banner_01.png" alt="AVP STUDIO Creative Banner" class="collage__card-img"
                loading="lazy" draggable="false" />
            </article>
          </div>

          <!-- LAYER 3: Official AVP Mascot Studio Seal / Stamp (Overlapping top-right corner) -->
          <div class="collage__stamp" :style="{
            transform: `translate3d(${mouseX * 24}px, ${mouseY * 20}px, 0) rotate(${mouseY * 4 - 8}deg)`
          }">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ─── Section ────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: calc(100vh - 72px);
  background: var(--cream);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: var(--space-4);
}

/* ─── BG stripe ──────────────────────────────────────────── */
.hero__bg-stripe {
  position: absolute;
  top: 0;
  right: 0;
  width: 42%;
  height: 100%;
  background: var(--charcoal);
  clip-path: polygon(8% 0, 100% 0, 100% 100%, 0 100%);
  z-index: 0;
}

/* ─── Container ──────────────────────────────────────────── */
.hero__container {
  position: relative;
  z-index: 1;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-16) var(--container-pad) var(--space-12);
  width: 100%;
  align-items: center;
}

/* ─── Content (left - preserved) ─────────────────────────── */
.hero__content {
  padding-right: var(--space-12);
}

.hero__overline {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand-red);
  margin-bottom: var(--space-6);

  /* entrance */
  opacity: 0;
  transform: translateY(12px);
  transition: opacity var(--duration-slow) var(--ease-out-expo) 100ms,
    transform var(--duration-slow) var(--ease-out-expo) 100ms;
}

.hero--visible .hero__overline {
  opacity: 1;
  transform: none;
}

.hero__heading {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(3.5rem, 7vw, 6.5rem);
  line-height: 0.95;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--charcoal);
  margin-bottom: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: 0.08em;
}

.hero__heading-line {
  display: block;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--duration-slow) var(--ease-out-expo),
    transform var(--duration-slow) var(--ease-out-expo);
}

.hero--visible .hero__heading-line--1 {
  opacity: 1;
  transform: none;
  transition-delay: 150ms;
}

.hero--visible .hero__heading-line--2 {
  opacity: 1;
  transform: none;
  transition-delay: 220ms;
}

.hero--visible .hero__heading-line--3 {
  opacity: 1;
  transform: none;
  transition-delay: 290ms;
  color: var(--brand-red);
}

.hero__heading-italic {
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 400;
  font-size: 0.9em;
  letter-spacing: 0;
  text-transform: none;
  margin-left: 0.08em;
}

.hero__tagline {
  font-family: var(--font-accent);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-style: italic;
  color: var(--ink-secondary);
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-8);
  border-bottom: 1px solid rgba(23, 23, 23, 0.12);

  opacity: 0;
  transform: translateY(10px);
  transition: opacity var(--duration-slow) var(--ease-out-expo) 360ms,
    transform var(--duration-slow) var(--ease-out-expo) 360ms;
}

.hero--visible .hero__tagline {
  opacity: 1;
  transform: none;
}

/* ─── CTA Buttons ────────────────────────────────────────── */
.hero__actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-16);

  opacity: 0;
  transform: translateY(10px);
  transition: opacity var(--duration-slow) var(--ease-out-expo) 440ms,
    transform var(--duration-slow) var(--ease-out-expo) 440ms;
}

.hero--visible .hero__actions {
  opacity: 1;
  transform: none;
}

.hero__btn {
  border-radius: 10px;
  display: inline-block;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  padding: var(--space-4) var(--space-8);
  transition:
    background var(--duration-fast) var(--ease-out-expo),
    color var(--duration-fast) var(--ease-out-expo),
    transform var(--duration-fast) var(--ease-out-expo),
    box-shadow var(--duration-fast) var(--ease-out-expo);
}

.hero__btn--primary {
  background: var(--brand-red);
  color: var(--white);
  box-shadow: 0 4px 16px rgba(201, 62, 39, 0.28);
}

.hero__btn--primary:hover {
  background: var(--brand-red-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 62, 39, 0.36);
}

.hero__btn--ghost {
  background: transparent;
  color: var(--charcoal);
  border: 1.5px solid var(--charcoal);
}

.hero__btn--ghost:hover {
  background: var(--charcoal);
  color: var(--white);
  transform: translateY(-2px);
}

/* ─── Scroll cue ─────────────────────────────────────────── */
.hero__scroll-cue {
  display: flex;
  align-items: center;
  gap: var(--space-3);

  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out-expo) 700ms;
}

.hero--visible .hero__scroll-cue {
  opacity: 0.45;
}

.hero__scroll-line {
  display: block;
  width: 32px;
  height: 1px;
  background: var(--charcoal);
}

.hero__scroll-label {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--charcoal);
}

/* ─── Right: Experimental Art Collage ────────────────────── */
.hero__visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;
  perspective: 1200px;
  user-select: none;

  opacity: 0;
  transform: translateX(30px);
  transition: opacity var(--duration-slow) var(--ease-out-expo) 200ms,
    transform var(--duration-slow) var(--ease-out-expo) 200ms;
}

.hero--visible .hero__visual {
  opacity: 1;
  transform: none;
}

.collage {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  --shift-x: 230px;
  --shift-y: 150px;
  --card-w: 300px;
  --card-h: 400px;
  --card-1-left: 20px;
  --card-1-top: 20px;
}

/* Background atmospheric aura */
.collage__glow {
  position: absolute;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(201, 62, 39, 0.18) 0%, rgba(201, 62, 39, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(24px);
}

/* ─── Floating Frames (Carrying the whole card container with borders & shadows) ─── */
.collage__float {
  position: absolute;
  width: var(--card-w);
  height: var(--card-h);
  will-change: transform;
}

.collage__float--back {
  top: var(--card-1-top);
  left: var(--card-1-left);
  z-index: 1;
  animation: levitate-back 5.6s ease-in-out infinite alternate;
}

.collage__float--main {
  top: calc(var(--card-1-top) + var(--shift-y));
  left: calc(var(--card-1-left) + var(--shift-x));
  z-index: 2;
  animation: levitate-main 6.4s ease-in-out infinite alternate;
  animation-delay: -2.8s;
}

@keyframes levitate-back {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-10px) rotate(0.6deg);
  }

  100% {
    transform: translateY(6px) rotate(-0.4deg);
  }
}

@keyframes levitate-main {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(12px) rotate(-0.8deg);
  }

  100% {
    transform: translateY(-8px) rotate(0.5deg);
  }
}

/* Base Card Styles: Integrated Frame + Border + Shadow + Image */
.collage__card {
  width: 100%;
  height: 100%;
  will-change: transform, box-shadow;
  transition:
    transform 0.65s cubic-bezier(0.25, 1, 0.35, 1),
    box-shadow 0.65s cubic-bezier(0.25, 1, 0.35, 1);
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
}

.collage__card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  pointer-events: none;
}

/* ─── LAYER 1: Back Editorial Poster (default at top-left, rotated -4.5deg, stays at z-index 1) ─── */
.collage__card--back {
  border: 1px solid rgba(23, 23, 23, 0.12);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.14);
  transform: translate3d(calc(var(--mouse-x, 0) * -8px), calc(var(--mouse-y, 0) * -6px), 0) rotate(-4.5deg) scale(0.94);
}

/* ─── LAYER 2: Main Editorial Artwork Poster (default at bottom-right, rotated 2deg, stays at z-index 2) ─── */
.collage__card--main {
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.28);
  transform: translate3d(calc(var(--mouse-x, 0) * 12px), calc(var(--mouse-y, 0) * 10px), 0) rotate(2deg) scale(1);
}

/* ─── HOVER / SWAPPED STATE: Cards Trade Places via Transform (Preserving Initial Layer Order) ─── */
.collage:hover .collage__card--back,
.collage.collage--swapped .collage__card--back {
  /* Back card glides down-right underneath Card 2 (remains z-index: 1) */
  transform: translate3d(calc(var(--shift-x) + var(--mouse-x, 0) * 12px), calc(var(--shift-y) + var(--mouse-y, 0) * 10px), 0) rotate(2deg) scale(0.96);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
}

.collage:hover .collage__card--main,
.collage.collage--swapped .collage__card--main {
  /* Main card glides up-left over Card 1 (remains z-index: 2) */
  transform: translate3d(calc(-1 * var(--shift-x) + var(--mouse-x, 0) * -8px), calc(-1 * var(--shift-y) + var(--mouse-y, 0) * -6px), 0) rotate(-4.5deg) scale(1);
  box-shadow: 0 28px 56px rgba(0, 0, 0, 0.32);
}

/* ─── LAYER 3: Official AVP Mascot Stamp / Seal ───────────── */
.collage__stamp {
  position: absolute;
  top: 140px;
  right: -10px;
  z-index: 4;
  width: 110px;
  height: 110px;
  will-change: transform;
  transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1);
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.22));
}

@keyframes rotate-stamp {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.stamp__symbol-center {
  position: relative;
  z-index: 2;
  width: 46px;
  height: 46px;
  background: var(--cream);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}

.stamp__symbol-icon {
  width: 22px;
  height: 22px;
}

/* ─── LAYER 4 & 5: Floating Editorial Stickers ───────────── */
.collage__sticker {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  z-index: 5;
  will-change: transform;
  transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease;
}

.collage__sticker--branding {
  top: 75px;
  left: 0;
  background: var(--white);
  color: var(--charcoal);
  border: 1px solid rgba(23, 23, 23, 0.15);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

.collage__sticker--branding .sticker__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-red);
}

.collage__sticker--culture {
  bottom: 50px;
  right: 10px;
  background: var(--charcoal-soft);
  color: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
}

.collage__sticker--culture .sticker__tag {
  color: var(--brand-red-light);
  font-weight: 900;
}

/* ─── LAYER 6: Angled Studio Tape Motif ──────────────────── */
.collage__tape {
  position: absolute;
  bottom: 25px;
  left: 40px;
  z-index: 4;
  background: var(--brand-red);
  color: var(--white);
  padding: 0.4rem 1.1rem;
  font-family: var(--font-display);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  box-shadow: 0 8px 20px rgba(201, 62, 39, 0.35);
  will-change: transform;
  transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1);
}

.collage__tape:hover {
  background: var(--brand-red-dark);
}

/* ─── Marquee strip (Strictly preserved) ─────────────────── */
.hero__marquee-wrap {
  position: relative;
  z-index: 1;
  background: var(--charcoal);
  overflow: hidden;
  padding: var(--space-4) 0;
  flex-shrink: 0;
}

.hero__marquee-track {
  display: flex;
  gap: var(--space-8);
  white-space: nowrap;
  animation: marquee 28s linear infinite;
  width: max-content;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

.hero__marquee-item {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
}

.hero__marquee-sep {
  color: var(--brand-red);
  font-size: 0.7rem;
  opacity: 0.8;
}

/* ─── Reduced Motion ─────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {

  .hero__visual,
  .collage__card,
  .collage__stamp,
  .collage__sticker,
  .collage__tape {
    transform: none !important;
    transition: none !important;
  }

  .stamp__circular-text,
  .art-svg__burst,
  .hero__marquee-track {
    animation: none !important;
  }
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 1100px) {
  .collage {
    max-width: 480px;
    height: 520px;
    --card-w: 260px;
    --card-h: 350px;
    --shift-x: 180px;
    --shift-y: 120px;
    --card-1-left: 15px;
    --card-1-top: 20px;
  }

  .collage__stamp {
    width: 95px;
    height: 95px;
  }
}

@media (max-width: 900px) {
  .hero__bg-stripe {
    display: none;
  }

  .hero__container {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: var(--space-8);
  }

  .hero__content {
    padding-right: 0;
    order: 2;
  }

  .hero__visual {
    order: 1;
    min-height: auto;
    margin-bottom: var(--space-8);
  }

  .collage {
    max-width: 440px;
    height: 480px;
    --card-w: 220px;
    --card-h: 300px;
    --shift-x: 160px;
    --shift-y: 110px;
    --card-1-left: 15px;
    --card-1-top: 15px;
  }

  .collage__stamp {
    width: 85px;
    height: 85px;
    top: 100px;
    right: -5px;
  }

  .stamp__symbol-center {
    width: 38px;
    height: 38px;
  }

  .stamp__symbol-icon {
    width: 18px;
    height: 18px;
  }

  .collage__tape {
    bottom: 15px;
    left: 20px;
    font-size: 0.65rem;
    padding: 0.3rem 0.8rem;
  }

  .hero__heading {
    align-items: center;
  }

  .hero__actions {
    justify-content: center;
  }

  .hero__scroll-cue {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .collage {
    max-width: 340px;
    height: 400px;
    --card-w: 180px;
    --card-h: 245px;
    --shift-x: 115px;
    --shift-y: 95px;
    --card-1-left: 10px;
    --card-1-top: 15px;
  }

  .collage__sticker--branding {
    top: 45px;
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
  }

  .collage__sticker--culture {
    bottom: 30px;
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
  }

  .collage__stamp {
    width: 72px;
    height: 72px;
    top: 85px;
    right: -5px;
  }

  .stamp__symbol-center {
    width: 32px;
    height: 32px;
  }

  .stamp__symbol-icon {
    width: 14px;
    height: 14px;
  }

  .collage__tape {
    display: none;
  }

  .hero__btn {
    width: 100%;
    text-align: center;
  }
}
</style>
