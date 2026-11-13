<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
    { threshold: 0.15 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section
    id="contact"
    ref="sectionRef"
    class="contact"
    :class="{ 'contact--visible': visible }"
    aria-labelledby="contact-heading"
  >
    <div class="contact__container">

      <!-- Editorial Header -->
      <header class="contact__header">
        <h2 id="contact-heading" class="contact__heading">
          HAVE A PROJECT<br>
          <em>IN MIND?</em>
        </h2>
        <p class="contact__message">
          We collaborate with brands, creators, and visionaries ready to explore beyond what you see. Reach out directly through any of our primary channels below:
        </p>
      </header>

      <!-- Three Horizontally Aligned Editorial Rows -->
      <div class="contact__list" role="list">

        <!-- 1. EMAIL -->
        <a
          href="mailto:avpteamstudio06@gmail.com"
          class="contact-row"
          role="listitem"
          aria-label="Send email to avpteamstudio06@gmail.com"
        >
          <span class="contact-row__label">EMAIL</span>
          <span class="contact-row__value">avpteamstudio06@gmail.com</span>
          <span class="contact-row__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </a>

        <!-- 2. PHONE -->
        <a
          href="tel:0348197716"
          class="contact-row"
          role="listitem"
          aria-label="Call phone hotline 0348 197 716"
        >
          <span class="contact-row__label">PHONE</span>
          <span class="contact-row__value">0348 197 716</span>
          <span class="contact-row__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </a>

        <!-- 3. FACEBOOK FANPAGE -->
        <a
          href="https://www.facebook.com/p/AVP-Studio-61595595074121/"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-row"
          role="listitem"
          aria-label="Visit AVP STUDIO official Facebook Fanpage (opens in new tab)"
        >
          <span class="contact-row__label">FACEBOOK</span>
          <span class="contact-row__value">AVP STUDIO</span>
          <span class="contact-row__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </a>

      </div>

      <!-- Studio Availability Meta Strip -->
      <footer class="contact__meta">
        <div class="contact__meta-item">
          <span class="contact__meta-bullet" aria-hidden="true">●</span>
          <span>Open for commissions &amp; creative collaborations</span>
        </div>
        <div class="contact__meta-item">
          <span>Based in Can Tho &amp; Ho Chi Minh City, Vietnam</span>
        </div>
      </footer>

    </div>
  </section>
</template>

<style scoped>
/* ─── Section Shell ──────────────────────────────────────── */
.contact {
  background: var(--charcoal);
  color: var(--white);
  padding: var(--space-20) 0;
  position: relative;
  overflow: hidden;
}

.contact__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
  display: flex;
  flex-direction: column;
}

/* ─── Editorial Header ───────────────────────────────────── */
.contact__header {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: var(--space-10);
  align-items: flex-end;
  margin-bottom: var(--space-12);

  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity var(--duration-slow) var(--ease-out-expo),
    transform var(--duration-slow) var(--ease-out-expo);
}

.contact--visible .contact__header {
  opacity: 1;
  transform: none;
}

.contact__heading {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4.5vw, 3.8rem);
  font-weight: 900;
  line-height: 1.0;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--white);
  margin: 0;
}

.contact__heading em {
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 400;
  font-size: 0.95em;
  color: var(--brand-red-light);
  letter-spacing: 0;
  text-transform: none;
}

.contact__message {
  font-family: var(--font-body);
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.72);
  max-width: 48ch;
  margin: 0;
}

/* ─── Contact List (Editorial Rows) ──────────────────────── */
.contact__list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(255, 255, 255, 0.12);

  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity var(--duration-slow) var(--ease-out-expo) 120ms,
    transform var(--duration-slow) var(--ease-out-expo) 120ms;
}

.contact--visible .contact__list {
  opacity: 1;
  transform: none;
}

/* ─── Individual Contact Row ─────────────────────────────── */
.contact-row {
  display: grid;
  grid-template-columns: 160px 1fr auto;
  align-items: center;
  gap: var(--space-6);
  padding: clamp(1.2rem, 2vw, 1.75rem) var(--space-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  background: transparent;
  transition:
    background var(--duration-fast) var(--ease-out-expo),
    border-color var(--duration-fast) var(--ease-out-expo);
}

.contact-row:hover {
  background: rgba(255, 255, 255, 0.025);
  border-color: rgba(201, 62, 39, 0.45);
}

.contact-row:focus-visible {
  outline: 2px solid var(--brand-red);
  outline-offset: -2px;
}

/* Row Label */
.contact-row__label {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  transition: color var(--duration-fast) var(--ease-out-expo);
}

.contact-row:hover .contact-row__label {
  color: rgba(255, 255, 255, 0.85);
}

/* Row Value */
.contact-row__value {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2vw, 1.75rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0.01em;
  color: var(--white);
  word-break: break-all;
  transition:
    color var(--duration-fast) var(--ease-out-expo),
    transform var(--duration-fast) var(--ease-out-expo);
}

.contact-row:hover .contact-row__value {
  color: var(--brand-red-light);
}

/* Row Icon */
.contact-row__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.35);
  transition:
    color var(--duration-fast) var(--ease-out-expo),
    transform var(--duration-fast) var(--ease-out-expo);
}

.contact-row:hover .contact-row__icon {
  color: var(--brand-red-light);
  transform: translate(4px, -4px);
}

/* ─── Meta Strip ─────────────────────────────────────────── */
.contact__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-top: var(--space-6);
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);

  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out-expo) 200ms;
}

.contact--visible .contact__meta {
  opacity: 1;
}

.contact__meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.contact__meta-bullet {
  color: #22c55e;
  font-size: 0.65rem;
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .contact {
    padding: var(--space-20) 0 var(--space-16);
  }

  .contact__header {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .contact-row {
    grid-template-columns: 130px 1fr auto;
    gap: var(--space-4);
    padding: var(--space-5) var(--space-2);
  }
}

@media (max-width: 640px) {
  .contact {
    padding: var(--space-20) 0 var(--space-16);
  }

  .contact-row {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "label icon"
      "value value";
    gap: var(--space-1);
    padding: var(--space-4) 0;
  }

  .contact-row__label {
    grid-area: label;
  }

  .contact-row__icon {
    grid-area: icon;
    width: 28px;
    height: 28px;
  }

  .contact-row__value {
    grid-area: value;
    font-size: clamp(1rem, 4.6vw, 1.25rem);
  }

  .contact__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
}

/* ─── Reduced Motion ─────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .contact__header,
  .contact__list,
  .contact__meta,
  .contact-row,
  .contact-row__value,
  .contact-row__icon {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
