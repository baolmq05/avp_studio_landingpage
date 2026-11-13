<script setup>
/**
 * ProductAlbum.vue
 * Immersive editorial visual exhibition for AVP STUDIO releases.
 * Dynamic layout rendering: full-bleed, split, asymmetric, detail, horizontal, overlap.
 * Full-screen lightbox with keyboard controls & mobile touch swipe.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { formatDate, formatTime } from '../composables/useProducts.js'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  savedScrollY: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['close'])

// ── Close & Restore Scroll ───────────────────────────────────────────────────
function handleClose() {
  document.body.style.overflow = ''
  emit('close')
  requestAnimationFrame(() => {
    window.scrollTo({ top: props.savedScrollY, behavior: 'instant' })
  })
}

// ── Flatten all images for universal Lightbox navigation ─────────────────────
const allImages = computed(() => {
  const list = []
  if (!props.product) return list

  // Include cover/banner
  if (props.product.coverImage) {
    list.push({
      src: props.product.coverImage,
      alt: `${props.product.name} — Cover Artwork`,
      caption: `${props.product.name} — Official Cover Architecture`,
    })
  }

  // Iterate album blocks
  for (const block of props.product.album || []) {
    if (block.layout === 'full-bleed' || block.layout === 'split' || block.layout === 'detail') {
      if (block.src) {
        list.push({
          src: block.src,
          alt: block.alt || props.product.name,
          caption: block.caption || block.title || '',
        })
      }
    } else if (block.layout === 'asymmetric') {
      if (block.primary?.src) {
        list.push({
          src: block.primary.src,
          alt: block.primary.alt || props.product.name,
          caption: block.primary.caption || '',
        })
      }
      if (block.secondary?.src) {
        list.push({
          src: block.secondary.src,
          alt: block.secondary.alt || props.product.name,
          caption: block.secondary.caption || '',
        })
      }
    } else if (block.layout === 'horizontal') {
      for (const item of block.items || []) {
        if (item.src) {
          list.push({
            src: item.src,
            alt: item.alt || props.product.name,
            caption: item.caption || '',
          })
        }
      }
    } else if (block.layout === 'overlap') {
      if (block.base?.src) {
        list.push({
          src: block.base.src,
          alt: block.base.alt || props.product.name,
          caption: block.base.caption || '',
        })
      }
      if (block.overlay?.src) {
        list.push({
          src: block.overlay.src,
          alt: block.overlay.alt || props.product.name,
          caption: block.overlay.caption || '',
        })
      }
    }
  }

  return list
})

// ── Lightbox State & Navigation ──────────────────────────────────────────────
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const activeLightboxImage = computed(() => {
  return allImages.value[lightboxIndex.value] || null
})

function openLightboxBySrc(src, defaultCaption = '') {
  const foundIdx = allImages.value.findIndex((img) => img.src === src)
  if (foundIdx !== -1) {
    lightboxIndex.value = foundIdx
  } else {
    // If not found in flat list, fallback
    allImages.value.push({ src, alt: props.product.name, caption: defaultCaption })
    lightboxIndex.value = allImages.value.length - 1
  }
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function nextLightbox() {
  if (!allImages.value.length) return
  lightboxIndex.value = (lightboxIndex.value + 1) % allImages.value.length
}

function prevLightbox() {
  if (!allImages.value.length) return
  lightboxIndex.value = (lightboxIndex.value - 1 + allImages.value.length) % allImages.value.length
}

// ── Keyboard Controls ────────────────────────────────────────────────────────
function handleKeyDown(e) {
  if (lightboxOpen.value) {
    if (e.key === 'ArrowRight') nextLightbox()
    if (e.key === 'ArrowLeft') prevLightbox()
    if (e.key === 'Escape') closeLightbox()
  } else {
    if (e.key === 'Escape') handleClose()
  }
}

// ── Lightbox Touch Swipe ─────────────────────────────────────────────────────
let lbTouchStartX = 0
let lbTouchStartY = 0

function handleLbTouchStart(e) {
  if (!e.touches?.[0]) return
  lbTouchStartX = e.touches[0].clientX
  lbTouchStartY = e.touches[0].clientY
}

function handleLbTouchEnd(e) {
  if (!e.changedTouches?.[0]) return
  const deltaX = e.changedTouches[0].clientX - lbTouchStartX
  const deltaY = e.changedTouches[0].clientY - lbTouchStartY
  if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < 0) nextLightbox()
    else prevLightbox()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.scrollTo({ top: 0, behavior: 'instant' })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="album-view" role="dialog" aria-modal="true" :aria-label="`${product.name} Visual Exhibition`">
    <!-- ── Sticky Editorial Header Bar ──────────────────────────────────────── -->
    <header class="album-header">
      <div class="album-header__inner">
        <button
          type="button"
          class="album-header__back-btn"
          aria-label="Return to releases"
          @click="handleClose"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>BACK TO RELEASES</span>
          <span class="album-header__esc-hint" aria-hidden="true">[ESC]</span>
        </button>

        <div class="album-header__meta">
          <span class="album-header__edition">{{ product.edition }}</span>
          <span class="album-header__sep" aria-hidden="true">/</span>
          <span class="album-header__title">{{ product.name }}</span>
        </div>

        <div class="album-header__status">
          <span class="album-header__status-dot" aria-hidden="true"></span>
          <span>{{ product.status?.toUpperCase() || 'UPCOMING' }}</span>
        </div>
      </div>
    </header>

    <main class="album-content">
      <!-- ── Section 1: Editorial Introduction & Dominant Cover ─────────────── -->
      <section class="album-intro">
        <div class="album-intro__container">
          <div class="album-intro__lead">
            <div class="album-intro__badge-row">
              <span class="album-intro__badge">{{ product.edition }}</span>
              <span class="album-intro__category">{{ product.category }}</span>
            </div>
            <h1 class="album-intro__title">{{ product.name }}</h1>
            <p class="album-intro__tagline">
              {{ product.tagline || product.description }}
            </p>
          </div>

          <!-- Dominant Full-Width Cover Visual -->
          <div
            class="album-intro__cover-frame"
            role="button"
            tabindex="0"
            :aria-label="`Zoom ${product.name} cover visual`"
            @click="openLightboxBySrc(product.coverImage, `${product.name} — Cover Visual`)"
            @keydown.enter="openLightboxBySrc(product.coverImage, `${product.name} — Cover Visual`)"
          >
            <img
              :src="product.coverImage"
              :alt="`${product.name} cover artwork`"
              class="album-intro__cover-img"
            />
            <div class="album-intro__cover-overlay" aria-hidden="true">
              <span class="album-zoom-tag">CLICK TO EXPAND ARTWORK ↗</span>
            </div>
            <div class="album-intro__cover-caption">
              <span>00 · OFFICIAL RELEASE COVER</span>
              <span>AVP STUDIO ARCHIVE</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Section 2: Visual Storytelling Sequence (Data-Driven Layouts) ─── -->
      <section class="album-gallery" aria-label="Visual Exhibition Story">
        <div
          v-for="(block, idx) in product.album"
          :key="block.id || idx"
          class="album-block"
          :class="`album-block--${block.layout}`"
        >
          <!-- 1. FULL-BLEED LAYOUT -->
          <div v-if="block.layout === 'full-bleed'" class="bleed-comp">
            <div class="bleed-comp__container">
              <div class="bleed-comp__meta-row">
                <span class="album-kicker">{{ block.kicker || 'ARCHIVE STUDY' }}</span>
                <h2 v-if="block.title" class="bleed-comp__title">{{ block.title }}</h2>
              </div>

              <div
                class="bleed-comp__image-wrap"
                role="button"
                tabindex="0"
                :aria-label="`Zoom ${block.alt}`"
                @click="openLightboxBySrc(block.src, block.caption)"
                @keydown.enter="openLightboxBySrc(block.src, block.caption)"
              >
                <img :src="block.src" :alt="block.alt" class="bleed-comp__img" loading="lazy" />
                <div class="album-zoom-badge" aria-hidden="true">EXPAND ↗</div>
              </div>

              <p v-if="block.caption" class="album-caption">{{ block.caption }}</p>
            </div>
          </div>

          <!-- 2. SPLIT COMPOSITION LAYOUT -->
          <div v-else-if="block.layout === 'split'" class="split-comp">
            <div class="split-comp__container">
              <div
                class="split-comp__visual"
                role="button"
                tabindex="0"
                :aria-label="`Zoom ${block.alt}`"
                @click="openLightboxBySrc(block.src, block.caption)"
                @keydown.enter="openLightboxBySrc(block.src, block.caption)"
              >
                <img :src="block.src" :alt="block.alt" class="split-comp__img" loading="lazy" />
                <div class="album-zoom-badge" aria-hidden="true">EXPAND ↗</div>
                <p v-if="block.caption" class="album-caption">{{ block.caption }}</p>
              </div>

              <div class="split-comp__text">
                <span class="album-kicker">{{ block.kicker || 'CONCEPT MEMORANDUM' }}</span>
                <h2 class="split-comp__heading">{{ block.title }}</h2>
                <div class="split-comp__divider" aria-hidden="true"></div>
                <p class="split-comp__body">{{ block.text }}</p>
              </div>
            </div>
          </div>

          <!-- 3. ASYMMETRIC PRESENTATION LAYOUT -->
          <div v-else-if="block.layout === 'asymmetric'" class="asym-comp">
            <div class="asym-comp__container">
              <div
                v-if="block.primary"
                class="asym-comp__primary"
                role="button"
                tabindex="0"
                :aria-label="`Zoom ${block.primary.alt}`"
                @click="openLightboxBySrc(block.primary.src, block.primary.caption)"
                @keydown.enter="openLightboxBySrc(block.primary.src, block.primary.caption)"
              >
                <img :src="block.primary.src" :alt="block.primary.alt" class="asym-comp__img" loading="lazy" />
                <div class="album-zoom-badge" aria-hidden="true">EXPAND ↗</div>
                <p v-if="block.primary.caption" class="album-caption">{{ block.primary.caption }}</p>
              </div>

              <div
                v-if="block.secondary"
                class="asym-comp__secondary"
                role="button"
                tabindex="0"
                :aria-label="`Zoom ${block.secondary.alt}`"
                @click="openLightboxBySrc(block.secondary.src, block.secondary.caption)"
                @keydown.enter="openLightboxBySrc(block.secondary.src, block.secondary.caption)"
              >
                <img :src="block.secondary.src" :alt="block.secondary.alt" class="asym-comp__img" loading="lazy" />
                <div class="album-zoom-badge" aria-hidden="true">EXPAND ↗</div>
                <p v-if="block.secondary.caption" class="album-caption">{{ block.secondary.caption }}</p>
              </div>
            </div>
          </div>

          <!-- 4. DETAIL SHOWCASE LAYOUT -->
          <div v-else-if="block.layout === 'detail'" class="detail-comp">
            <div class="detail-comp__container">
              <div class="detail-comp__header">
                <span class="album-kicker">{{ block.kicker || 'MACRO CRAFT' }}</span>
                <h2 class="detail-comp__title">{{ block.title }}</h2>
              </div>

              <div
                class="detail-comp__frame"
                role="button"
                tabindex="0"
                :aria-label="`Zoom ${block.alt}`"
                @click="openLightboxBySrc(block.src, block.caption)"
                @keydown.enter="openLightboxBySrc(block.src, block.caption)"
              >
                <img :src="block.src" :alt="block.alt" class="detail-comp__img" loading="lazy" />
                <div class="album-zoom-badge" aria-hidden="true">EXPAND ↗</div>
              </div>

              <p v-if="block.caption" class="album-caption detail-comp__caption">{{ block.caption }}</p>
            </div>
          </div>

          <!-- 5. HORIZONTAL GALLERY LAYOUT -->
          <div v-else-if="block.layout === 'horizontal'" class="horiz-comp">
            <div class="horiz-comp__container">
              <div class="horiz-comp__header">
                <div>
                  <span class="album-kicker">{{ block.kicker || 'HORIZONTAL SEQUENCE' }}</span>
                  <h2 class="horiz-comp__title">{{ block.title }}</h2>
                </div>
                <span class="horiz-comp__drag-hint">DRAG TO EXPLORE →</span>
              </div>

              <div class="horiz-comp__track" tabindex="0" aria-label="Horizontally scrollable gallery">
                <div
                  v-for="(item, iIdx) in block.items"
                  :key="iIdx"
                  class="horiz-comp__item"
                  role="button"
                  tabindex="0"
                  :aria-label="`Zoom ${item.alt}`"
                  @click="openLightboxBySrc(item.src, item.caption)"
                  @keydown.enter="openLightboxBySrc(item.src, item.caption)"
                >
                  <div class="horiz-comp__thumb-frame">
                    <img :src="item.src" :alt="item.alt" class="horiz-comp__img" loading="lazy" />
                    <div class="album-zoom-badge" aria-hidden="true">EXPAND ↗</div>
                  </div>
                  <p class="horiz-comp__caption">{{ item.caption }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 6. OVERLAPPING COMPOSITION LAYOUT -->
          <div v-else-if="block.layout === 'overlap'" class="overlap-comp">
            <div class="overlap-comp__container">
              <div class="overlap-comp__header">
                <span class="album-kicker">{{ block.kicker || 'COMPOSITIONAL OVERLAP' }}</span>
              </div>

              <div class="overlap-comp__stage">
                <!-- Base Image -->
                <div
                  v-if="block.base"
                  class="overlap-comp__base"
                  role="button"
                  tabindex="0"
                  :aria-label="`Zoom ${block.base.alt}`"
                  @click="openLightboxBySrc(block.base.src, block.base.caption)"
                  @keydown.enter="openLightboxBySrc(block.base.src, block.base.caption)"
                >
                  <img :src="block.base.src" :alt="block.base.alt" class="overlap-comp__base-img" loading="lazy" />
                  <div class="album-zoom-badge" aria-hidden="true">EXPAND ↗</div>
                  <p v-if="block.base.caption" class="album-caption">{{ block.base.caption }}</p>
                </div>

                <!-- Floating Overlap Image -->
                <div
                  v-if="block.overlay"
                  class="overlap-comp__overlay"
                  role="button"
                  tabindex="0"
                  :aria-label="`Zoom ${block.overlay.alt}`"
                  @click="openLightboxBySrc(block.overlay.src, block.overlay.caption)"
                  @keydown.enter="openLightboxBySrc(block.overlay.src, block.overlay.caption)"
                >
                  <img :src="block.overlay.src" :alt="block.overlay.alt" class="overlap-comp__overlay-img" loading="lazy" />
                  <div class="album-zoom-badge" aria-hidden="true">EXPAND ↗</div>
                  <p v-if="block.overlay.caption" class="album-caption overlap-comp__overlay-caption">
                    {{ block.overlay.caption }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Section 3: Product Colophon & Launch Access (Secondary to Art) ─── -->
      <section class="album-specs" aria-labelledby="specs-heading">
        <div class="album-specs__container">
          <div class="album-specs__header">
            <span class="album-kicker">RELEASE COLOPHON</span>
            <h2 id="specs-heading" class="album-specs__title">Specifications & Access</h2>
          </div>

          <div class="album-specs__grid">
            <!-- Left: Specifications Table -->
            <div class="album-specs__colophon">
              <dl class="album-specs__dl">
                <div v-for="spec in product.specs" :key="spec.label" class="album-specs__row">
                  <dt class="album-specs__dt">{{ spec.label }}</dt>
                  <dd class="album-specs__dd">{{ spec.value }}</dd>
                </div>
              </dl>

              <!-- Launch Schedule Bar -->
              <div class="album-specs__schedule">
                <div class="album-specs__schedule-item">
                  <span class="album-specs__label">Official Release Date</span>
                  <span class="album-specs__val">{{ formatDate(product.releaseDate) }}</span>
                </div>
                <div class="album-specs__schedule-sep" aria-hidden="true"></div>
                <div class="album-specs__schedule-item">
                  <span class="album-specs__label">Release Time</span>
                  <span class="album-specs__val">{{ formatTime(product.releaseTime) }}</span>
                </div>
              </div>
            </div>

            <!-- Right: QR Code Launch Access -->
            <div class="album-specs__qr-card">
              <div class="album-specs__qr-box">
                <img
                  :src="product.qrImage"
                  :alt="`QR Launch code for ${product.name}`"
                  class="album-specs__qr-img"
                  width="180"
                  height="180"
                />
              </div>
              <div class="album-specs__qr-meta">
                <span class="album-specs__qr-tag">DIRECT LAUNCH ACCESS</span>
                <p class="album-specs__qr-note">
                  Scan this QR code on <strong>{{ formatDate(product.releaseDate) }}</strong> at
                  <strong>{{ formatTime(product.releaseTime) }}</strong> to enter the direct studio acquisition portal.
                </p>
              </div>
            </div>
          </div>

          <!-- Bottom Close Action -->
          <div class="album-specs__footer">
            <button type="button" class="album-return-btn" @click="handleClose">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>RETURN TO STUDIO RELEASES</span>
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- ── Section 4: Universal Full-Screen Lightbox ────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Expanded Artwork View"
        @click.self="closeLightbox"
        @touchstart="handleLbTouchStart"
        @touchend="handleLbTouchEnd"
      >
        <!-- Backdrop Close Button -->
        <button
          type="button"
          class="lightbox__close-btn"
          aria-label="Close Lightbox (Escape)"
          @click="closeLightbox"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- Navigation Arrows -->
        <button
          type="button"
          class="lightbox__nav-btn lightbox__nav-btn--prev"
          aria-label="Previous artwork (Arrow Left)"
          @click.stop="prevLightbox"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          class="lightbox__nav-btn lightbox__nav-btn--next"
          aria-label="Next artwork (Arrow Right)"
          @click.stop="nextLightbox"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- Main Lightbox Stage -->
        <div class="lightbox__stage" @click.self="closeLightbox">
          <transition name="lb-fade" mode="out-in">
            <div :key="lightboxIndex" class="lightbox__figure">
              <img
                :src="activeLightboxImage?.src"
                :alt="activeLightboxImage?.alt || 'Artwork detail'"
                class="lightbox__img"
              />
            </div>
          </transition>
        </div>

        <!-- Lightbox Caption & Counter Strip -->
        <div class="lightbox__caption-bar">
          <span class="lightbox__counter">
            0{{ lightboxIndex + 1 }} / 0{{ allImages.length }}
          </span>
          <p class="lightbox__caption-text">
            {{ activeLightboxImage?.caption || activeLightboxImage?.alt }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ─── Album View Shell ─────────────────────────────────────── */
.album-view {
  min-height: 100vh;
  background: var(--white);
  color: var(--charcoal);
  position: relative;
  overflow-x: hidden;
}

/* ─── Sticky Header ────────────────────────────────────────── */
.album-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(23, 23, 23, 0.1);
  padding: var(--space-4) 0;
}

.album-header__inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.album-header__back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  background: transparent;
  border: 1px solid rgba(23, 23, 23, 0.16);
  padding: 8px 16px;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--charcoal);
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-out-expo),
    border-color var(--duration-fast) var(--ease-out-expo),
    color var(--duration-fast) var(--ease-out-expo);
}

.album-header__back-btn:hover {
  background: var(--charcoal);
  border-color: var(--charcoal);
  color: var(--white);
}

.album-header__esc-hint {
  opacity: 0.4;
  font-size: 0.72rem;
}

.album-header__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.album-header__edition {
  color: var(--brand-red);
}

.album-header__sep {
  opacity: 0.3;
}

.album-header__title {
  color: var(--charcoal);
}

.album-header__status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--ink-secondary);
}

.album-header__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-red);
}

/* ─── Shared Editorial Elements ────────────────────────────── */
.album-kicker {
  font-family: var(--font-display);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--brand-red);
  display: block;
  margin-bottom: var(--space-2);
}

.album-caption {
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--ink-secondary);
  opacity: 0.85;
  margin-top: var(--space-3);
}

.album-zoom-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 14px;
  background: rgba(23, 23, 23, 0.85);
  backdrop-filter: blur(8px);
  color: var(--white);
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  border-radius: 999px;
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
  pointer-events: none;
}

[role='button']:hover .album-zoom-badge,
[role='button']:focus-visible .album-zoom-badge {
  opacity: 1;
  transform: translateY(0);
}

/* ─── Intro Section & Dominant Cover ───────────────────────── */
.album-intro {
  padding: var(--space-16) 0 var(--space-20);
  background: var(--white);
  border-bottom: 1px solid rgba(23, 23, 23, 0.08);
}

.album-intro__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.album-intro__lead {
  max-width: 860px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.album-intro__badge-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.album-intro__badge {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-red);
}

.album-intro__category {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-secondary);
}

.album-intro__title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6.5vw, 6rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--charcoal);
  margin: 0;
}

.album-intro__tagline {
  font-size: clamp(1.1rem, 1.8vw, 1.4rem);
  line-height: 1.5;
  color: var(--ink-secondary);
  max-width: 60ch;
  margin: 0;
}

.album-intro__cover-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 720px;
  overflow: hidden;
  background: var(--charcoal);
  cursor: pointer;
  box-shadow: 0 24px 60px rgba(23, 23, 23, 0.14);
}

.album-intro__cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.album-intro__cover-frame:hover .album-intro__cover-img {
  transform: scale(1.03);
}

.album-intro__cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(23, 23, 23, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.album-intro__cover-frame:hover .album-intro__cover-overlay {
  opacity: 1;
}

.album-zoom-tag {
  padding: 12px 24px;
  background: var(--white);
  color: var(--charcoal);
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.album-intro__cover-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: linear-gradient(to top, rgba(23, 23, 23, 0.85), transparent);
  color: var(--white);
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* ─── Gallery Composition Blocks ───────────────────────────── */
.album-gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  padding: var(--space-24) 0;
}

/* 1. Full-Bleed */
.bleed-comp__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.bleed-comp__meta-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.bleed-comp__title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--charcoal);
}

.bleed-comp__image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 680px;
  overflow: hidden;
  background: #111;
  cursor: pointer;
}

.bleed-comp__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s var(--ease-out-expo);
}

.bleed-comp__image-wrap:hover .bleed-comp__img {
  transform: scale(1.025);
}

/* 2. Split Composition */
.split-comp__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.split-comp__visual {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background: #111;
}

.split-comp__img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.6s var(--ease-out-expo);
}

.split-comp__visual:hover .split-comp__img {
  transform: scale(1.03);
}

.split-comp__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.split-comp__heading {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.5vw, 3.2rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--charcoal);
  margin: 0;
}

.split-comp__divider {
  width: 48px;
  height: 2px;
  background: var(--brand-red);
}

.split-comp__body {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--ink-secondary);
}

/* 3. Asymmetric Presentation */
.asym-comp__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--space-12);
  align-items: end;
}

.asym-comp__primary,
.asym-comp__secondary {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background: #111;
}

.asym-comp__primary .asym-comp__img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  display: block;
  transition: transform 0.6s var(--ease-out-expo);
}

.asym-comp__secondary .asym-comp__img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
  transition: transform 0.6s var(--ease-out-expo);
}

.asym-comp__primary:hover .asym-comp__img,
.asym-comp__secondary:hover .asym-comp__img {
  transform: scale(1.03);
}

/* 4. Detail Showcase */
.detail-comp__container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 var(--container-pad);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
}

.detail-comp__title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 900;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--charcoal);
  margin: 0;
}

.detail-comp__frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 540px;
  overflow: hidden;
  background: #111;
  cursor: pointer;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}

.detail-comp__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.detail-comp__frame:hover .detail-comp__img {
  transform: scale(1.04);
}

/* 5. Horizontal Gallery */
.horiz-comp__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.horiz-comp__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.horiz-comp__title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 900;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--charcoal);
  margin: 0;
}

.horiz-comp__drag-hint {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brand-red);
}

.horiz-comp__track {
  display: flex;
  gap: var(--space-6);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: var(--space-4);
  -webkit-overflow-scrolling: touch;
}

.horiz-comp__item {
  flex: 0 0 340px;
  scroll-snap-align: start;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.horiz-comp__thumb-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #111;
}

.horiz-comp__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.horiz-comp__item:hover .horiz-comp__img {
  transform: scale(1.04);
}

.horiz-comp__caption {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--charcoal);
  margin: 0;
}

/* 6. Overlapping Composition */
.overlap-comp__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
}

.overlap-comp__stage {
  position: relative;
  width: 100%;
}

.overlap-comp__base {
  position: relative;
  width: 85%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #111;
  cursor: pointer;
}

.overlap-comp__base-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.overlap-comp__base:hover .overlap-comp__base-img {
  transform: scale(1.02);
}

.overlap-comp__overlay {
  position: absolute;
  right: 0;
  bottom: -40px;
  width: 42%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #222;
  cursor: pointer;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  border: 4px solid var(--white);
  z-index: 2;
}

.overlap-comp__overlay-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.overlap-comp__overlay:hover .overlap-comp__overlay-img {
  transform: scale(1.04);
}

/* ─── Colophon & Launch Specifications ─────────────────────── */
.album-specs {
  background: var(--charcoal);
  color: var(--white);
  padding: var(--space-20) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.album-specs__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.album-specs__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.8vw, 3.4rem);
  font-weight: 900;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--white);
  margin: 0;
}

.album-specs__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--space-12);
  align-items: center;
}

.album-specs__dl {
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.album-specs__row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-4) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.92rem;
}

.album-specs__dt {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.album-specs__dd {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--white);
  text-align: right;
  margin: 0;
}

.album-specs__schedule {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-6) 0 0;
}

.album-specs__schedule-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.album-specs__label {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brand-red);
}

.album-specs__val {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--white);
}

.album-specs__schedule-sep {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
}

.album-specs__qr-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
}

.album-specs__qr-box {
  background: var(--white);
  padding: 12px;
  border-radius: 4px;
}

.album-specs__qr-img {
  display: block;
}

.album-specs__qr-tag {
  font-family: var(--font-display);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand-red);
  display: block;
  margin-bottom: 4px;
}

.album-specs__qr-note {
  font-size: 0.88rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.album-specs__footer {
  display: flex;
  justify-content: center;
  padding-top: var(--space-8);
}

.album-return-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: 14px 32px;
  background: transparent;
  border: 1px solid var(--brand-red);
  color: var(--brand-red);
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-out-expo),
    color var(--duration-fast) var(--ease-out-expo);
}

.album-return-btn:hover {
  background: var(--brand-red);
  color: var(--white);
}

/* ─── Lightbox Overlay ─────────────────────────────────────── */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 10, 10, 0.96);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lightbox__close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition:
    background var(--duration-fast) ease,
    transform var(--duration-fast) ease;
}

.lightbox__close-btn:hover {
  background: var(--brand-red);
  border-color: var(--brand-red);
  transform: scale(1.06);
}

.lightbox__nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition:
    background var(--duration-fast) ease,
    transform var(--duration-fast) ease;
}

.lightbox__nav-btn:hover {
  background: var(--brand-red);
  border-color: var(--brand-red);
  transform: translateY(-50%) scale(1.08);
}

.lightbox__nav-btn--prev {
  left: 24px;
}

.lightbox__nav-btn--next {
  right: 24px;
}

.lightbox__stage {
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox__figure {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox__img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  display: block;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
}

.lightbox__caption-bar {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: rgba(23, 23, 23, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 24px;
  border-radius: 999px;
  max-width: 80vw;
}

.lightbox__counter {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  color: var(--brand-red);
}

.lightbox__caption-text {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Lightbox Transition ─────────────────────────────────── */
.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.25s ease;
}

.lb-fade-enter-from,
.lb-fade-leave-to {
  opacity: 0;
}

/* ─── Responsive Media Queries ────────────────────────────── */
@media (max-width: 1024px) {
  .split-comp__container {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .asym-comp__container {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .album-specs__grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .overlap-comp__overlay {
    bottom: -20px;
    width: 50%;
  }
}

@media (max-width: 768px) {
  .album-header__meta {
    display: none;
  }

  .album-intro__title {
    font-size: 3rem;
  }

  .lightbox__nav-btn--prev {
    left: 8px;
  }

  .lightbox__nav-btn--next {
    right: 8px;
  }
}

@media (max-width: 640px) {
  .horiz-comp__item {
    flex: 0 0 280px;
  }

  .overlap-comp__base {
    width: 100%;
  }

  .overlap-comp__overlay {
    position: static;
    width: 100%;
    margin-top: var(--space-4);
    border: none;
  }

  .album-specs__schedule {
    flex-direction: column;
    align-items: flex-start;
  }

  .album-specs__schedule-sep {
    display: none;
  }
}

/* ─── Reduced Motion ─────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .album-intro__cover-img,
  .bleed-comp__img,
  .split-comp__img,
  .asym-comp__img,
  .detail-comp__img,
  .horiz-comp__img,
  .overlap-comp__base-img,
  .overlap-comp__overlay-img {
    transition: none !important;
    transform: none !important;
  }
}
</style>
