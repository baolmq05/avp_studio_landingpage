<script setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
import FooterSection from './components/FooterSection.vue'
import ProductAlbum from './components/ProductAlbum.vue'

const activeProduct = ref(null)
const savedScrollY = ref(0)

function openAlbum(product) {
  savedScrollY.value = window.scrollY
  activeProduct.value = product
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function closeAlbum() {
  activeProduct.value = null
}
</script>

<template>
  <!-- Album view: full-screen, replaces entire page -->
  <ProductAlbum v-if="activeProduct" :product="activeProduct" :savedScrollY="savedScrollY" @close="closeAlbum" />

  <!-- Main site layout -->
  <template v-else>
    <NavBar />
    <main>
      <HeroSection />
      <ServicesSection />
      <AboutSection @open-album="openAlbum" />
      <ContactSection />
    </main>
    <FooterSection />
  </template>
</template>

<style>
/* Global anchor style within content */
.content-link {
  color: var(--brand-red);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 500;
  transition: opacity var(--duration-fast) var(--ease-out-expo);
}

.content-link:hover {
  opacity: 0.75;
}
</style>
