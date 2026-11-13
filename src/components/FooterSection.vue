<script setup>
const handleFbImgError = (event) => {
  const img = event.target
  img.onerror = null
  img.src = 'https://z-m-static.xx.fbcdn.net/rsrc.php/y4/r/M6oWJ5INQpg.webp'
  img.style.objectFit = 'contain'
  img.style.padding = '15%'
}
</script>

<template>
  <footer class="footer" aria-label="Site footer">
    <div class="footer__inner">

      <div class="footer__main">
        <!-- Left: Brand block & Navigation Links -->
        <div class="footer__left">
          <div class="footer__brand">
            <a href="#hero" class="footer__logo-link" aria-label="AVP STUDIO — back to top">
              <img
                src="../assets/logo_header.png"
                alt="AVP STUDIO logo"
                class="footer__logo-img"
              />
            </a>
          </div>

          <!-- Nav links -->
          <nav class="footer__nav" aria-label="Footer navigation">
            <ul class="footer__nav-list" role="list">
              <li><a href="#services" class="footer__nav-link">Services</a></li>
              <li><a href="#studio" class="footer__nav-link">Studio</a></li>
              <li><a href="#releases" class="footer__nav-link">Releases</a></li>
              <li><a href="#contact" class="footer__nav-link">Contact</a></li>
            </ul>
            <ul class="footer__nav-list" role="list">
              <li>
                <a
                  href="https://www.facebook.com/p/AVP-Studio-61595595074121/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="footer__nav-link"
                  aria-label="Visit AVP STUDIO on Facebook"
                >Facebook Fanpage</a>
              </li>
              <li>
                <a
                  href="mailto:avpteamstudio06@gmail.com"
                  class="footer__nav-link"
                  aria-label="Email AVP STUDIO"
                >avpteamstudio06@gmail.com</a>
              </li>
              <li>
                <a
                  href="tel:0348197716"
                  class="footer__nav-link"
                  aria-label="Call AVP STUDIO hotline"
                >Hotline: 0348 197 716</a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Right: Official Facebook Page Card Widget -->
        <div class="footer__right">
          <span class="footer__widget-title">Official Page</span>
          <a
            href="https://www.facebook.com/p/AVP-Studio-61595595074121/"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__fb-card"
            aria-label="AVP Studio on Facebook"
          >
            <div class="fb-card__thumb">
              <img
                src="https://scontent.xx.fbcdn.net/v/t39.30808-1/864787852_122102432037519835_5885476418636587545_n.jpg?stp=cp0_dst-jpg_e15_fr_q65_tt6&cstp=mx1200x1207&ctp=s720x720&_nc_cat=109&ccb=1-7&_nc_sid=3ab345&_nc_ohc=fuLQ8YJxhr0Q7kNvwEaFXKm&_nc_oc=Adoh66KTUgjaBCsqoFdFsyb0AWoI4QL08oaX6qleux3sIa9LwsJf-rDcqC-Pdabt0eY&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_rml=0&_nc_ht=scontent.xx&_nc_gid=2qG_-tFZi1gg7jSxQaBJhQ&_nc_ss=7b289&oh=00_AQT7RYW7tL8hr67FZAzPRtn6UNst6RogWjoF-5TDhAFr9g&oe=6AF9EFC7"
                alt="AVP Studio Avatar"
                class="fb-card__img"
                @error="handleFbImgError"
              />
            </div>
            <div class="fb-card__info">
              <div class="fb-card__meta">
                <img
                  src="https://z-m-static.xx.fbcdn.net/rsrc.php/y4/r/M6oWJ5INQpg.webp"
                  alt="Facebook"
                  class="fb-card__favicon"
                />
                <span class="fb-card__domain">facebook.com</span>
              </div>
              <div class="fb-card__name">AVP Studio | Can Tho</div>
              <div class="fb-card__desc">
                AVP Studio, Can Tho. 57 followers · 11 talking about this. Graphic &amp; Fashion Studio. note: Page này chỉ dùng cho mục đích học tập.
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Bottom strip -->
      <div class="footer__bottom">
        <p class="footer__copy">
          © {{ new Date().getFullYear() }} AVP STUDIO. All rights reserved.
        </p>
        <a href="#hero" class="footer__back-top" aria-label="Back to top">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
          </svg>
          <span>Back to top</span>
        </a>
      </div>

    </div>
  </footer>
</template>

<style scoped>
/* ─── Footer ─────────────────────────────────────────────── */
.footer {
  background: var(--charcoal);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer__inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-16) var(--container-pad) var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

/* ─── Main Content Split ─────────────────────────────────── */
.footer__main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-12);
  flex-wrap: wrap;
}

.footer__left {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  flex: 1;
  min-width: 280px;
}

/* ─── Brand ──────────────────────────────────────────────── */
.footer__brand {
  display: flex;
  align-items: center;
}

.footer__logo-link {
  display: inline-block;
  transition: opacity var(--duration-fast) var(--ease-out-expo);
}

.footer__logo-link:hover {
  opacity: 0.85;
}

.footer__logo-img {
  height: clamp(38px, 4.5vw, 48px);
  width: auto;
  aspect-ratio: 660 / 178;
  object-fit: contain;
  display: block;
}

/* ─── Nav ────────────────────────────────────────────────── */
.footer__nav {
  display: flex;
  gap: var(--space-16);
  flex-wrap: wrap;
}

.footer__nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.footer__nav-link {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.55);
  transition: color var(--duration-fast) var(--ease-out-expo);
}

.footer__nav-link:hover {
  color: var(--brand-red-light);
}

/* ─── Right: Facebook Embed Card ─────────────────────────── */
.footer__right {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 460px;
  width: 100%;
}

.footer__widget-title {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brand-red);
}

.footer__fb-card {
  display: flex;
  text-decoration: none;
  color: #111111;
  width: 100%;
  max-width: 460px;
  min-height: 140px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #dedede;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  transition:
    transform var(--duration-fast) var(--ease-out-expo),
    box-shadow var(--duration-fast) var(--ease-out-expo),
    border-color var(--duration-fast) var(--ease-out-expo);
}

.footer__fb-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  border-color: var(--brand-red);
}

.fb-card__thumb {
  width: 140px;
  flex-shrink: 0;
  align-self: stretch;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.fb-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fb-card__info {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
  justify-content: center;
}

.fb-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 15px;
}

.fb-card__favicon {
  width: 15px;
  height: 15px;
  border-radius: 4px;
  flex-shrink: 0;
}

.fb-card__domain {
  font-size: 11px;
  font-weight: 500;
  color: #888888;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.fb-card__name {
  font-size: 15px;
  font-weight: 700;
  color: #000000;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fb-card__desc {
  font-size: 12.5px;
  color: #444444;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ─── Bottom strip ───────────────────────────────────────── */
.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-top: var(--space-6);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer__copy {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.35);
  font-family: var(--font-body);
}

.footer__back-top {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.4);
  transition: color var(--duration-fast) var(--ease-out-expo);
}

.footer__back-top:hover {
  color: var(--brand-red-light);
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .footer__main {
    flex-direction: column;
    gap: var(--space-8);
  }

  .footer__nav {
    gap: var(--space-8);
  }

  .footer__right {
    max-width: 100%;
  }

  .footer__fb-card {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .fb-card__thumb {
    width: 110px;
  }
}
</style>
