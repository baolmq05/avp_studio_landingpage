<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { products } from '../composables/useProducts.js'

const emit = defineEmits(['open-album'])

const sectionRef = ref(null)
const visible = ref(false)

let observer

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.08 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

// Studio Statistics
const stats = [
  { number: '2+', label: 'Years of practice' },
  { number: '2', label: 'Industry awards' },
]

function triggerOpenAlbum(product) {
  emit('open-album', product)
}

// ── Infinite 1-Card Slider Logic (100% Width per Card) ──────────────────────
// 4 slots loop: [P0, P1, P0, P1]
const carouselProducts = [
  products[0],
  products[1],
  products[0],
  products[1],
]

const currentStep = ref(0)
const isTransitioning = ref(false)
const activeIdx = computed(() => currentStep.value % 2)

function nextCard() {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentStep.value++
}

function prevCard() {
  if (isTransitioning.value) return
  if (currentStep.value > 0) {
    isTransitioning.value = true
    currentStep.value--
  } else {
    // Jump silently to slot 2 then animate back to slot 1
    isTransitioning.value = false
    currentStep.value = 2
    nextTick(() => {
      requestAnimationFrame(() => {
        isTransitioning.value = true
        currentStep.value = 1
      })
    })
  }
}

function handleTransitionEnd() {
  isTransitioning.value = false
  // When reaching slot 2 (Product 0), silently reset to slot 0 (Product 0)
  if (currentStep.value >= 2) {
    currentStep.value = currentStep.value % 2
  }
}

// Touch swipe support
let touchStartX = 0
let touchStartY = 0

function handleTouchStart(e) {
  if (!e.touches?.[0]) return
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function handleTouchEnd(e) {
  if (!e.changedTouches?.[0]) return
  const deltaX = e.changedTouches[0].clientX - touchStartX
  const deltaY = e.changedTouches[0].clientY - touchStartY
  if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < 0) {
      nextCard()
    } else {
      prevCard()
    }
  }
}
</script>

<template>
  <div ref="sectionRef" class="about" :class="{ 'about--visible': visible }">
    <!-- ─── Top: Studio Story & Emblem ──────────────────────────────────────── -->
    <section id="studio" class="studio-intro" aria-labelledby="about-heading">
      <span id="about" class="about__anchor" aria-hidden="true"></span>

      <!-- Left decorative diagonal background stripe (Mirrors Hero Section) -->
      <div class="studio-intro__bg-stripe" aria-hidden="true"></div>

      <div class="about__container">
        <div class="about__intro-grid">
          <!-- Left column: Mascot Art Card -->
          <div class="about__left">
            <div class="about__mascot-card">
              <img src="/images/banners/mascot.jpg" alt="AVP Studio Mascot" class="about__mascot-img" loading="lazy" />
            </div>
          </div>

          <!-- Right column: Narrative & Stats -->
          <div class="about__right">
            <h2 id="about-heading" class="about__heading">
              A studio built<br />
              on <em>conviction</em>
            </h2>

            <div class="about__body">
              <p>
                AVP STUDIO is a creative design practice rooted in the belief that great design
                doesn't just communicate — it transforms. We work across brand identity, editorial,
                motion, and digital to build visual systems that last.
              </p>
              <p>
                Founded with an artistic spirit and a sharp editorial eye, our work is playful
                without being trivial, bold without being loud. Our creative conviction says it all —
                a little wild, entirely intentional.
              </p>
            </div>

            <!-- Stats strip -->
            <dl class="about__stats">
              <div v-for="(stat, i) in stats" :key="stat.label" class="about__stat"
                :style="{ '--delay': `${i * 80}ms` }">
                <dt class="about__stat-label">{{ stat.label }}</dt>
                <dd class="about__stat-number">{{ stat.number }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Bottom: Studio Releases (1 Card Visible at a Time, Rectangular) ──── -->
    <section id="products" class="products" aria-labelledby="products-heading">
      <span id="work" class="products__anchor" aria-hidden="true"></span>
      <span id="releases" class="products__anchor" aria-hidden="true"></span>
      <div class="products__container">
        <!-- Left Column: Title, Description & Controls -->
        <div class="products__left-col">
          <h2 id="products-heading" class="products__heading">
            Studio <em class="products__heading-em">Releases</em>
          </h2>
          <p class="products__intro">
            Limited tactile monographs, collectible design sculptures, and physical artifacts produced in strictly
            numbered runs with uncompromising craft.
          </p>
        </div>

        <!-- Right Column: 1-Card Rectangular Slider -->
        <div class="products__right-col" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
          <div class="products__stage">
            <div class="products__track" :style="{
              transform: `translateX(-${currentStep * 100}%)`,
              transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
            }" @transitionend="handleTransitionEnd">
              <article v-for="(product, i) in carouselProducts" :key="`${product.id}-${i}`" class="product-card">
                <!-- Upper: Wide Rectangular Visual (16:9 Landscape) -->
                <div class="product-card__visual" role="button" tabindex="0"
                  :aria-label="`Open album for ${product.name}`" @click.stop="triggerOpenAlbum(product)"
                  @keydown.enter="triggerOpenAlbum(product)" @keydown.space.prevent="triggerOpenAlbum(product)">
                  <img :src="product.bannerImage || product.coverImage" :alt="`${product.name} — Cover Artwork`"
                    class="product-card__img" loading="lazy" />
                  <div class="product-card__overlay" aria-hidden="true">
                    <span class="product-card__hover-cue">
                      <span>EXPLORE ALBUM</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </div>

                  <!-- Next Button: Sitting on the image, middle-right -->
                  <button type="button" class="product-card__arrow-btn" aria-label="Next product"
                    @click.stop="nextCard">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2.5">
                      <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>

                <!-- Lower: Horizontal Card Body (Rectangular Proportion) -->
                <div class="product-card__body">
                  <div class="product-card__info">
                    <h3 class="product-card__name">{{ product.name }}</h3>
                    <p class="product-card__desc">
                      {{ product.tagline || product.description }}
                    </p>
                  </div>

                  <div class="product-card__action">
                    <button type="button" class="product-card__btn" :aria-label="`Show album for ${product.name}`"
                      @click.stop="triggerOpenAlbum(product)">
                      <span>Show Album</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.2">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ─── Section Root ────────────────────────────────────────── */
.about {
  background: var(--white);
  position: relative;
  overflow: hidden;
}

.about__anchor,
.products__anchor {
  position: absolute;
  top: -80px;
  left: 0;
  height: 1px;
  width: 1px;
  opacity: 0;
  pointer-events: none;
}

/* ─── Studio Story Container ─────────────────────────────── */
.studio-intro {
  padding: var(--space-24) 0 var(--space-20);
  background: var(--cream);
  position: relative;
  overflow: hidden;
}

/* ─── Left Diagonal Background Stripe (Mirrors Hero Section) ─── */
.studio-intro__bg-stripe {
  position: absolute;
  top: 0;
  left: 0;
  width: 48%;
  height: 100%;
  background: var(--charcoal);
  clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
  z-index: 0;
}

.about__container {
  position: relative;
  z-index: 1;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
}

/* ─── Intro Grid (Story & Mascot) ────────────────────────── */
.about__intro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: center;
}

/* Left Column: Visual Placement on Dark Stripe */
.about__left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: 0;
  transform: translateX(-24px);
  transition:
    opacity var(--duration-slow) var(--ease-out-expo),
    transform var(--duration-slow) var(--ease-out-expo);
}

.about--visible .about__left {
  opacity: 1;
  transform: none;
}

.about__mascot-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  margin: 0 auto;
  transform: translateX(-40px);
  transition:
    transform var(--duration-medium) var(--ease-out-expo),
    box-shadow var(--duration-medium) var(--ease-out-expo);
}

.about__mascot-card:hover {
  transform: translateX(-40px) translateY(-6px) scale(1.01);
  transition: all 0.3s ease-in-out;
}

.about__mascot-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Right Narrative */
.about__right {
  opacity: 0;
  transform: translateX(24px);
  transition:
    opacity var(--duration-slow) var(--ease-out-expo) 150ms,
    transform var(--duration-slow) var(--ease-out-expo) 150ms;
}

.about--visible .about__right {
  opacity: 1;
  transform: none;
}

.about__heading {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 4.5vw, 4.5rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--charcoal);
  margin-bottom: var(--space-8);
}

.about__heading em {
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 400;
  font-size: 0.88em;
  color: var(--brand-red);
  letter-spacing: 0;
  text-transform: none;
}

.about__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-12);
}

.about__body p {
  font-size: 1.05rem;
  line-height: 1.72;
  color: var(--ink-secondary);
  max-width: 60ch;
}

/* Stats */
.about__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6) var(--space-8);
  border-top: 1px solid rgba(23, 23, 23, 0.12);
  padding-top: var(--space-8);
}

.about__stat {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity var(--duration-slow) var(--ease-out-expo) calc(300ms + var(--delay)),
    transform var(--duration-slow) var(--ease-out-expo) calc(300ms + var(--delay));
}

.about--visible .about__stat {
  opacity: 1;
  transform: none;
}

.about__stat-number {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 900;
  color: var(--brand-red);
  line-height: 1;
  letter-spacing: -0.03em;
}

.about__stat-label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--ink-secondary);
  margin-bottom: var(--space-1);
  order: -1;
}

/* ─── Products Section (2 Columns: Title Left, 1-Card Slider Right) ── */
.products {
  padding: var(--space-20) 0 var(--space-24);
  border-top: 1px solid rgba(23, 23, 23, 0.08);
  background: var(--white);
  position: relative;
  overflow: hidden;
}

.products__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: var(--space-12);
  align-items: center;
}

/* Left Column: Title & Description */
.products__left-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  z-index: 2;
  padding-right: var(--space-4);
}

.products__kicker {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-red);
  margin: 0;
}

.products__heading {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 4vw, 3.8rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--charcoal);
  margin: 0;
}

.products__heading-em {
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 400;
  font-size: 0.92em;
  color: var(--brand-red);
  letter-spacing: 0;
  text-transform: none;
}

.products__intro {
  font-size: 1.02rem;
  line-height: 1.7;
  color: var(--ink-secondary);
  margin: 0;
  max-width: 32ch;
}

/* Slider Controls */
.products__controls {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding-top: var(--space-2);
}

.products__btn-group {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.products__nav-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(23, 23, 23, 0.16);
  background: var(--white);
  color: var(--charcoal);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition:
    background var(--duration-fast) var(--ease-out-expo),
    border-color var(--duration-fast) var(--ease-out-expo),
    color var(--duration-fast) var(--ease-out-expo),
    transform var(--duration-fast) var(--ease-out-expo);
}

.products__nav-btn:hover {
  background: var(--brand-red);
  border-color: var(--brand-red);
  color: var(--white);
  transform: scale(1.06);
}

.products__nav-btn:active {
  transform: scale(0.96);
}

.products__counter {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.1em;
  color: var(--ink-secondary);
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.products__counter strong {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--brand-red);
}

.products__counter-sep {
  opacity: 0.35;
}

/* Right Column: 1-Card Stage (Rectangular Frame) */
.products__right-col {
  min-width: 0;
  position: relative;
}

.products__stage {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: -8px;
}

.products__track {
  display: flex;
  width: 100%;
  will-change: transform;
}

/* Product Card: Wide Landscape Rectangle (100% of stage, 1 card shown) */
.product-card {
  width: 100%;
  flex-shrink: 0;
  background: var(--white);
  border-radius: 16px;
  border: 1px solid rgba(23, 23, 23, 0.12);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(23, 23, 23, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    box-shadow var(--duration-base) var(--ease-out-expo),
    border-color var(--duration-base) var(--ease-out-expo);
}

.product-card:hover {
  border-color: rgba(201, 62, 39, 0.35);
  box-shadow: 0 24px 50px -12px rgba(201, 62, 39, 0.14);
}

/* Visual: Wide 16:9 Landscape Aspect Ratio (Crisp Rectangle) */
.product-card__visual {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 420px;
  overflow: hidden;
  background: #0e0e0e;
  border-bottom: 1px solid rgba(23, 23, 23, 0.08);
  cursor: pointer;
}

.product-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--duration-slow) var(--ease-out-expo);
}

.product-card:hover .product-card__img {
  transform: scale(1.01);
}

.product-card:hover .product-card__overlay {
  opacity: 1;
}

.product-card__hover-cue {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--white);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  border-bottom: 2px solid var(--white);
  padding-bottom: 3px;
  transform: translateY(6px);
  transition: transform var(--duration-base) var(--ease-out-expo);
}

.product-card:hover .product-card__hover-cue {
  transform: translateY(0);
}

/* Card Body: Sleek Horizontal Layout (Info on Left, Button on Right) */
.product-card__body {
  padding: var(--space-6) var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  background: var(--white);
  position: relative;
  z-index: 2;
}

.product-card__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
  min-width: 0;
}

.product-card__edition {
  color: var(--brand-red);
  font-weight: 800;
  letter-spacing: 0.18em;
}

.product-card__dot {
  color: var(--charcoal);
  opacity: 0.45;
}

.product-card__spec {
  color: var(--charcoal);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-card__name {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.2vw, 2.2rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--charcoal);
  margin: 0;
}

.product-card__desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--charcoal);
  font-weight: 450;
  margin: 0;
  max-width: 54ch;
}

.product-card__action {
  flex-shrink: 0;
}

.product-card__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0.85rem 1.8rem;
  background: var(--brand-red);
  color: var(--white);
  border: none;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(201, 62, 39, 0.22);
  transition:
    background var(--duration-fast) var(--ease-out-expo),
    transform var(--duration-fast) var(--ease-out-expo),
    box-shadow var(--duration-fast) var(--ease-out-expo);
  white-space: nowrap;
}

.product-card__btn:hover {
  background: var(--brand-red-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(201, 62, 39, 0.32);
}

.product-card__btn svg {
  transition: transform var(--duration-fast) var(--ease-out-expo);
}

.product-card__btn:hover svg {
  transform: translateX(3px);
}

/* Arrow Button: Positioned on the image, middle-right, compact, hover fades */
.product-card__arrow-btn {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.92);
  color: var(--charcoal);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  z-index: 10;
  backdrop-filter: blur(6px);
  transition:
    opacity var(--duration-fast) var(--ease-out-expo),
    transform var(--duration-fast) var(--ease-out-expo),
    box-shadow var(--duration-fast) var(--ease-out-expo);
}

/* Hover: mờ đi nhẹ, KHÔNG đổi màu đỏ */
.product-card__arrow-btn:hover {
  opacity: 0.68;
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}

.product-card__arrow-btn:active {
  transform: translateY(-50%) scale(0.94);
  opacity: 0.5;
}

/* ─── Responsive Breakpoints ─────────────────────────────── */
@media (max-width: 1024px) {
  .products__container {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .products__left-col {
    padding-right: 0;
  }

  .products__intro {
    max-width: 60ch;
  }
}

@media (max-width: 900px) {
  .studio-intro__bg-stripe {
    display: none;
  }

  .about__intro-grid {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }

  .about__left {
    max-width: 320px;
    margin: 0 auto;
  }

  .about__mascot-card {
    max-width: 320px;
    transform: none;
  }
}

@media (max-width: 640px) {
  .products {
    padding: var(--space-16) 0 var(--space-20);
  }

  .products__heading {
    font-size: 2.4rem;
  }

  .product-card__body {
    flex-direction: column;
    align-items: stretch;
    padding: var(--space-5);
    gap: var(--space-4);
  }

  .product-card__btn {
    width: 100%;
    justify-content: center;
  }

  .product-card__arrow-btn {
    width: 34px;
    height: 34px;
    right: 10px;
  }
}

/* ─── Reduced Motion ─────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {

  .about__left,
  .about__right,
  .about__stat,
  .product-card,
  .product-card__img {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
