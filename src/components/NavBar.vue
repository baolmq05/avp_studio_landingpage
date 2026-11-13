<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const menuOpen = ref(false)
const closeMenu = () => { menuOpen.value = false }

const handleKeydown = (e) => {
  if (e.key === 'Escape' && menuOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header class="nav">
    <nav class="nav__inner" aria-label="Main navigation">
      <!-- Official Brand Logo (Header placement) -->
      <a href="#hero" class="nav__logo" aria-label="AVP STUDIO — home">
        <img src="../assets/logo_header.png" alt="AVP STUDIO" class="nav__logo-img" />
      </a>

      <!-- Desktop nav -->
      <ul class="nav__links" role="list">
        <li><a href="#services" class="nav__link">Services</a></li>
        <li><a href="#studio" class="nav__link">Studio</a></li>
        <li><a href="#releases" class="nav__link">Releases</a></li>
        <li>
          <a href="#contact" class="nav__cta" aria-label="Contact us">
            Let's talk
          </a>
        </li>
      </ul>

      <!-- Mobile toggle -->
      <button class="nav__burger" :aria-expanded="menuOpen" aria-controls="mobile-menu"
        aria-label="Toggle navigation menu" @click="menuOpen = !menuOpen">
        <span class="nav__burger-bar" :class="{ open: menuOpen }"></span>
        <span class="nav__burger-bar" :class="{ open: menuOpen }"></span>
        <span class="nav__burger-bar" :class="{ open: menuOpen }"></span>
      </button>
    </nav>

    <!-- Mobile menu -->
    <div id="mobile-menu" class="nav__mobile" :class="{ 'nav__mobile--open': menuOpen }" :aria-hidden="!menuOpen"
      :inert="!menuOpen" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <ul role="list">
        <li><a href="#services" class="nav__mobile-link" @click="closeMenu">Services</a></li>
        <li><a href="#studio" class="nav__mobile-link" @click="closeMenu">Studio</a></li>
        <li><a href="#releases" class="nav__mobile-link" @click="closeMenu">Releases</a></li>
        <li><a href="#contact" class="nav__mobile-link nav__mobile-link--cta" @click="closeMenu">Let's talk</a></li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
/* ─── Nav wrapper (Always visible sticky header) ──────────── */
.nav {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(23, 23, 23, 0.08);
  box-shadow: 0 1px 0 rgba(201, 62, 39, 0.12);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-3) var(--container-pad);
  min-height: 64px;
}

/* ─── Official Logo ──────────────────────────────────────── */
.nav__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  line-height: 1;
  transition: opacity var(--duration-fast) var(--ease-out-expo);
}

.nav__logo:hover {
  opacity: 0.85;
}

.nav__logo-img {
  height: clamp(34px, 4vw, 38px);
  width: auto;
  aspect-ratio: 660 / 178;
  object-fit: contain;
  display: block;
}

/* ─── Desktop links ──────────────────────────────────────── */
.nav__links {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__link {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--charcoal);
  opacity: 0.75;
  line-height: 1;
  transition: opacity var(--duration-fast) var(--ease-out-expo), color var(--duration-fast) var(--ease-out-expo);
}

.nav__link:hover {
  opacity: 1;
  color: var(--brand-red);
}

.nav__cta {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--white);
  background: var(--brand-red);
  padding: 0 var(--space-6);
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  line-height: 1;
  transition:
    background var(--duration-fast) var(--ease-out-expo),
    transform var(--duration-fast) var(--ease-out-expo);
}

.nav__cta:hover {
  background: var(--brand-red-dark);
  transform: translateY(-1px);
}

/* ─── Burger ─────────────────────────────────────────────── */
.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
}

.nav__burger-bar {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--charcoal);
  transition: transform var(--duration-base) var(--ease-out-expo), opacity var(--duration-base);
  transform-origin: center;
}

.nav__burger-bar.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.nav__burger-bar.open:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.nav__burger-bar.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ─── Mobile menu ────────────────────────────────────────── */
.nav__mobile {
  display: none;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.98);
  padding: 0 var(--container-pad);
  border-top: 1px solid rgba(201, 62, 39, 0.15);
  overflow: hidden;
  max-height: 0;
  visibility: hidden;
  transition:
    max-height var(--duration-slow) var(--ease-out-expo),
    visibility var(--duration-slow) var(--ease-out-expo),
    padding var(--duration-slow) var(--ease-out-expo);
}

.nav__mobile--open {
  max-height: 400px;
  visibility: visible;
  padding-bottom: var(--space-8);
}

.nav__mobile ul {
  list-style: none;
  margin-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav__mobile-link {
  display: block;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--charcoal);
  padding: var(--space-3) 0;
  border-bottom: 1px solid rgba(23, 23, 23, 0.08);
  transition: color var(--duration-fast) var(--ease-out-expo);
}

.nav__mobile-link:hover {
  color: var(--brand-red);
}

.nav__mobile-link--cta {
  color: var(--brand-red);
  border-bottom: none;
  margin-top: var(--space-4);
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .nav__links {
    display: none;
  }

  .nav__burger {
    display: flex;
  }

  .nav__mobile {
    display: flex;
  }
}
</style>
