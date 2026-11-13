<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const visible = ref(false)

let observer

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { visible.value = true; observer.disconnect() } },
    { threshold: 0.15 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())

const services = [
  {
    id: 'brand',
    title: 'Brand Identity',
    description: 'Complete visual systems — logos, color, typography, and the language that makes you unforgettable.',
    accent: 'Identity Systems',
  },
  {
    id: 'motion',
    title: 'Motion & Animation',
    description: 'Characters, transitions, and micro-interactions that breathe life into every frame.',
    accent: 'Moving Images',
  },
  {
    id: 'print',
    title: 'Editorial & Print',
    description: 'Books, posters, zines, and packaging designed with intention and printed with pride.',
    accent: 'Tangible Work',
  },
  {
    id: 'digital',
    title: 'Digital Design',
    description: 'Websites, apps, and digital campaigns where craft meets conversion.',
    accent: 'Screens & Code',
  },
]
</script>

<template>
  <section id="services" ref="sectionRef" class="services" :class="{ 'services--visible': visible }"
    aria-labelledby="services-heading">
    <div class="services__container">
      <!-- Header row -->
      <div class="services__header">
        <h2 id="services-heading" class="services__heading">
          What we <em class="services__heading-em">do best</em>
        </h2>
        <p class="services__intro">
          AVP STUDIO is a creative practice that sits at the edge of art and design.
          We work with brands, studios, and individuals who refuse to settle for ordinary.
        </p>
      </div>

      <!-- Services grid -->
      <div class="services__grid" role="list">
        <article v-for="(service, i) in services" :key="service.id" class="services__item"
          :style="{ '--delay': `${i * 80}ms` }" role="listitem">
          <div class="services__item-inner">
            <div class="services__item-top">
              <span class="services__item-accent">{{ service.accent }}</span>
              <div class="services__item-line" aria-hidden="true"></div>
            </div>
            <h3 class="services__item-title">{{ service.title }}</h3>
            <p class="services__item-desc">{{ service.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ─── Section ────────────────────────────────────────────── */
.services {
  background: var(--charcoal);
  color: var(--white);
  padding: var(--space-24) 0;
  position: relative;
  overflow: hidden;
}

/* ─── Container ──────────────────────────────────────────── */
.services__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
}

/* ─── Header ─────────────────────────────────────────────── */
.services__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-6);
  margin-bottom: var(--space-16);

  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--duration-slow) var(--ease-out-expo),
    transform var(--duration-slow) var(--ease-out-expo);
}

.services--visible .services__header {
  opacity: 1;
  transform: none;
}

.services__heading {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 5.5vw, 5rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--white);
  text-align: center;
}

.services__heading-em {
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 400;
  font-size: 0.85em;
  color: var(--brand-red);
  letter-spacing: 0;
  text-transform: none;
}

.services__intro {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.65);
  max-width: 58ch;
  text-align: center;
  margin: 0 auto;
}

/* ─── Grid ───────────────────────────────────────────────── */
.services__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.08);
}

/* ─── Item ───────────────────────────────────────────────── */
.services__item {
  background: var(--charcoal);

  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity var(--duration-slow) var(--ease-out-expo) var(--delay),
    transform var(--duration-slow) var(--ease-out-expo) var(--delay);
}

.services--visible .services__item {
  opacity: 1;
  transform: none;
}

.services__item-inner {
  padding: var(--space-8);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  border-top: 2px solid transparent;
  transition: border-color var(--duration-base) var(--ease-out-expo),
    background var(--duration-base) var(--ease-out-expo);
}

.services__item:hover .services__item-inner {
  border-color: var(--brand-red);
  background: var(--charcoal-soft);
}

.services__item-top {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.services__item-accent {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brand-red);
  flex-shrink: 0;
}

.services__item-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.services__item-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--white);
  line-height: 1.1;
}

.services__item-desc {
  font-size: 0.9rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.55);
  flex: 1;
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 1024px) {
  .services__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .services__header {
    gap: var(--space-4);
  }
}

@media (max-width: 480px) {
  .services__grid {
    grid-template-columns: 1fr;
  }
}
</style>
