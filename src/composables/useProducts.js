// ─── useProducts.js ───────────────────────────────────────────────────────────
// Central data source for all AVP STUDIO products.
// Single source of truth for Studio Releases campaign slider & Product Album exhibitions.

export const products = [
  {
    id: 1,
    edition: 'EDITION 01',
    name: 'Chroma & Conviction',
    tagline: 'A limited 160-page studio monograph on typographic tension, tactile print craft, and design archives.',
    description:
      'Limited creative edition exploring editorial print, tactile artifacts, and contemporary visual culture. Featuring unreleased studio typography, conceptual sketches, and design archives.',
    category: 'Experimental Studio Monograph',
    spec: 'Hardcover · 160 Pages · 200 Copies Worldwide',
    releaseDate: '2026-12-01',
    releaseTime: '09:00',
    status: 'upcoming',
    coverImage: '/images/products/product-01/cover.jpg',
    bannerImage: '/images/products/product-01/banner.jpg',
    qrImage: '/images/products/product-01-qr.svg',
    specs: [
      { label: 'Format', value: 'Hardcover Monograph (240 × 320 mm)' },
      { label: 'Volume', value: '160 Pages · 6 Chapters' },
      { label: 'Paper Stock', value: 'Munken Lynx 150gsm · Uncoated' },
      { label: 'Binding', value: 'Section Sewn · Exposed Crimson Spine Thread' },
      { label: 'Cover Finish', value: 'Fedrigoni 400gsm · Debossed Crimson Foil' },
      { label: 'Edition Run', value: '200 Hand-numbered Copies · Signed Seal' },
      { label: 'Production', value: 'AVP Studio Archive · Can Tho, Vietnam' },
    ],
    album: [
      {
        id: 'p1-1',
        layout: 'full-bleed',
        src: '/images/products/product-01/spread.jpg',
        alt: 'Chroma & Conviction — Editorial Interior Spread',
        kicker: 'INTERIOR SPREAD',
        title: 'Architectural Typographic Grids',
        caption: 'Double-page typographic spread exploring dynamic asymmetric grid structures and high-contrast editorial rhythm on Munken Lynx 150gsm.',
      },
      {
        id: 'p1-2',
        layout: 'split',
        src: '/images/products/product-01/detail.jpg',
        alt: 'Chroma & Conviction — Debossed Foil Detail',
        kicker: 'PRINT PROCESS',
        title: 'Tactility, Paper Weight & Hot Stamping',
        text: 'Every edition is hand-finished with precision crimson hot-foil debossing onto raw unbleached 400gsm cotton board. Raking light reveals deep tactile impressions contrasting against razor-sharp Swiss typography.',
        caption: '0.8mm deep crimson foil stamp on Fedrigoni Materica stock.',
      },
      {
        id: 'p1-3',
        layout: 'asymmetric',
        primary: {
          src: '/images/products/product-01/slipcase.jpg',
          alt: 'Chroma & Conviction — Archival Slipcase',
          caption: 'Rigid matte black archival slipcase with crimson hot-stamped studio seal.',
        },
        secondary: {
          src: '/images/products/product-01/banner.jpg',
          alt: 'Chroma & Conviction — Book Cover Elevation',
          caption: 'Hardcover binding resting on raw architectural plinth under directional daylight.',
        },
      },
      {
        id: 'p1-4',
        layout: 'detail',
        src: '/images/products/product-01/detail.jpg',
        alt: 'Chroma & Conviction — Microscopic Paper Fiber Detail',
        kicker: 'CRAFT ARCHIVE',
        title: 'Microscopic Relief & Fiber Grain',
        caption: 'Extreme close-up showing physical paper fibers and edge relief of the debossed emblem.',
      },
      {
        id: 'p1-5',
        layout: 'horizontal',
        kicker: 'GALLERY SEQUENCE',
        title: 'Visual Studies & Spreads',
        items: [
          {
            src: '/images/products/product-01/banner.jpg',
            alt: 'Studio Monograph Perspective',
            caption: 'Exterior Book Architecture',
          },
          {
            src: '/images/products/product-01/spread.jpg',
            alt: 'Interior Layout Study',
            caption: 'Swiss Grid Typographic Study',
          },
          {
            src: '/images/products/product-01/detail.jpg',
            alt: 'Debossed Detail',
            caption: 'Foil Stamping Precision',
          },
          {
            src: '/images/products/product-01/slipcase.jpg',
            alt: 'Slipcase Presentation',
            caption: 'Protective Archival Box',
          },
        ],
      },
      {
        id: 'p1-6',
        layout: 'overlap',
        kicker: 'COMPOSITIONAL DIALOGUE',
        base: {
          src: '/images/products/product-01/spread.jpg',
          alt: 'Chroma & Conviction Spread',
          caption: 'Primary Spread — 240 × 320 mm format',
        },
        overlay: {
          src: '/images/products/product-01/slipcase.jpg',
          alt: 'Chroma & Conviction Slipcase Inset',
          caption: 'Numbered Edition Slipcase',
        },
      },
    ],
  },
  {
    id: 2,
    edition: 'EDITION 02',
    name: 'Totem & Tension',
    tagline: 'Experimental geometric collectible sculpture cast in hand-pigmented resin and terracotta.',
    description:
      'Experimental design collectible engineered with signature studio typography and brand aesthetics. Cast in premium resin with a bespoke terracotta and charcoal matte finish.',
    category: 'Sculptural Mascot Collectible',
    spec: 'Cast Urethane Resin · Terracotta Duo-Tone · Edition of 100',
    releaseDate: '2026-12-15',
    releaseTime: '20:00',
    status: 'upcoming',
    coverImage: '/images/products/product-02/cover.jpg',
    bannerImage: '/images/products/product-02/banner.jpg',
    qrImage: '/images/products/product-02-qr.svg',
    specs: [
      { label: 'Medium', value: 'High-Density Cast Urethane Resin' },
      { label: 'Colorway', value: 'Terracotta Matte & Raw Charcoal Duo-Tone' },
      { label: 'Dimensions', value: '220 mm (H) × 110 mm (W) × 90 mm (D)' },
      { label: 'Weight', value: '1.45 kg Solid Mass' },
      { label: 'Edition Run', value: '100 Pieces Worldwide · Serialized Base Plate' },
      { label: 'Packaging', value: 'Matte Charcoal Rigid Presentation Case + COA' },
      { label: 'Studio Seal', value: 'Laser Engraved AVP Studio Mark' },
    ],
    album: [
      {
        id: 'p2-1',
        layout: 'full-bleed',
        src: '/images/products/product-02/packaging.jpg',
        alt: 'Totem & Tension — Sculptural Collectible & Presentation Case',
        kicker: 'STUDIO ARTIFACT',
        title: 'Totem Silhouette & Custom Case',
        caption: 'The physical geometric collectible alongside its custom high-density foam archival case and foil-stamped documentation.',
      },
      {
        id: 'p2-2',
        layout: 'split',
        src: '/images/products/product-02/detail.jpg',
        alt: 'Totem & Tension — Macro Surface Texture',
        kicker: 'MATERIAL EXPLORATION',
        title: 'Terracotta Grain & Dense Polymeric Mass',
        text: 'Engineered as a three-dimensional manifestation of AVP STUDIO brand philosophy. Raw terracotta mineral tones blend into dense velvet-charcoal polymer, creating striking visual weight and tactile warmth.',
        caption: 'Hand-pigmented mineral finish with laser-engraved studio emblem.',
      },
      {
        id: 'p2-3',
        layout: 'asymmetric',
        primary: {
          src: '/images/products/product-02/banner.jpg',
          alt: 'Totem & Tension — Gallery Plinth View',
          caption: 'Minimalist gallery elevation with directional spotlighting and stark architectural shadow.',
        },
        secondary: {
          src: '/images/products/product-02/detail.jpg',
          alt: 'Totem & Tension — Emblem Engraving',
          caption: 'Sub-millimeter laser mark recessed into the charcoal foundation.',
        },
      },
      {
        id: 'p2-4',
        layout: 'detail',
        src: '/images/products/product-02/detail.jpg',
        alt: 'Totem & Tension — Surface Microtexture',
        kicker: 'MACRO STUDY',
        title: 'Dual-Material Boundary & Tactile Grain',
        caption: 'Porous mineral terracotta meeting polished charcoal matte composite.',
      },
      {
        id: 'p2-5',
        layout: 'horizontal',
        kicker: 'STUDIO ARCHIVE',
        title: 'Form, Finish & Architecture',
        items: [
          {
            src: '/images/products/product-02/banner.jpg',
            alt: 'Totem Perspective',
            caption: 'Architectural Elevation',
          },
          {
            src: '/images/products/product-02/packaging.jpg',
            alt: 'Archival Case',
            caption: 'Presentation Case & Desk Context',
          },
          {
            src: '/images/products/product-02/detail.jpg',
            alt: 'Tactile Macro',
            caption: 'Cast Mineral Texture',
          },
          {
            src: '/images/products/product-02/context.jpg',
            alt: 'Drafting Table Study',
            caption: 'Design Development Context',
          },
        ],
      },
      {
        id: 'p2-6',
        layout: 'overlap',
        kicker: 'SPATIAL TENSION',
        base: {
          src: '/images/products/product-02/packaging.jpg',
          alt: 'Presentation Case Desk View',
          caption: 'Desk staging with drafting schematics',
        },
        overlay: {
          src: '/images/products/product-02/banner.jpg',
          alt: 'Plinth Monolith Inset',
          caption: 'Monolith Profile',
        },
      },
    ],
  },
]

// ── Shared date / time helpers ────────────────────────────────────────────────
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function formatDate(isoDate) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  return `${day} ${MONTHS[parseInt(month, 10) - 1] || month} ${year}`
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${String(h12).padStart(2, '0')}:${m} ${ampm}`
}
