---
name: Bakery Aesthetic
colors:
  surface: '#fef8f2'
  surface-dim: '#dfd9d3'
  surface-bright: '#fef8f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3ed'
  surface-container: '#f3ede7'
  surface-container-high: '#ede7e1'
  surface-container-highest: '#e7e2dc'
  on-surface: '#1d1b18'
  on-surface-variant: '#524346'
  inverse-surface: '#32302c'
  inverse-on-surface: '#f6f0ea'
  outline: '#847376'
  outline-variant: '#d6c1c5'
  surface-tint: '#894c5c'
  primary: '#894c5c'
  on-primary: '#ffffff'
  primary-container: '#f4a7b9'
  on-primary-container: '#733949'
  inverse-primary: '#ffb1c3'
  secondary: '#6d5d2a'
  on-secondary: '#ffffff'
  secondary-container: '#f4de9e'
  on-secondary-container: '#71612e'
  tertiary: '#50625a'
  on-tertiary: '#ffffff'
  tertiary-container: '#adc1b7'
  on-tertiary-container: '#3e4f48'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e0'
  primary-fixed-dim: '#ffb1c3'
  on-primary-fixed: '#380a1a'
  on-primary-fixed-variant: '#6e3545'
  secondary-fixed: '#f7e1a1'
  secondary-fixed-dim: '#dac587'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#534614'
  tertiary-fixed: '#d3e7dc'
  tertiary-fixed-dim: '#b7cbc1'
  on-tertiary-fixed: '#0e1f18'
  on-tertiary-fixed-variant: '#394a43'
  background: '#fef8f2'
  on-background: '#1d1b18'
  surface-variant: '#e7e2dc'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 42px
  headline-lg:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 34px
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 30px
  headline-sm:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

This design system embodies a soft, warm, light, and airy bakery aesthetic designed to evoke feelings of comfort, artisanal craftsmanship, and nostalgic sweetness. The target audience includes food enthusiasts, patrons of boutique bakeries, and those seeking an inviting, tactile digital experience. The interface relies on a tactile, welcoming approach with generous whitespace, gentle curves, and a palette reminiscent of fresh flour, delicate frostings, and warm butter.

## Colors

The color palette is anchored by a warm cream white background (`#FFF9F3`) that creates an airy, sunlit canvas. Soft blush pink (`#FDE8EC`) provides delicate surface variations, while pastel rose pink (`#F4A7B9`) serves as the primary accent for interactive elements. Butter yellow (`#FFE9A8`) and mint cream (`#DFF3E8`) offer subtle secondary and tertiary highlights. Text is rendered in a soft warm grey-brown (`#6B5B5B`) for readability, and headings glow in a richer rose-brown (`#8A5A64`).

## Typography

Typography pairs elegant serif headings with a clean, soft sans-serif for body copy. Newsreader brings a literary, editorial warmth to titles and headers, ensuring a sophisticated yet approachable tone. Plus Jakarta Sans offers a rounded, welcoming geometry for readable body copy and UI labels. Ensure line heights remain generous to maintain the airy, unhurried atmosphere of the brand.

## Layout & Spacing

A fluid grid system organizes content with generous 1.5rem gutters and 2rem outer canvas margins on desktop, scaling down comfortably to 1rem margins on mobile viewports. Spacing tokens follow an organic rhythm, prioritizing breathing room around elements to reinforce the light and airy feel. Content should never feel cramped; allow cards, lists, and typography to float within ample whitespace.

## Elevation & Depth

Depth is communicated through warm, diffused ambient shadows rather than harsh lines. Surfaces float gently above the cream background using low-opacity, rose-tinted drop shadows that mimic soft morning light. Layering should be subtle: use soft blush pink (`#FDE8EC`) surface containers to group related items, and reserve elevated shadows for interactive cards and floating action buttons.

## Shapes

The shape language is consistently soft and welcoming, utilizing a 16px base roundedness (`0.5rem` to `1rem` scale) across all containers, cards, and buttons. Pill shapes are reserved for interactive chips and primary call-to-action badges. Avoid sharp 90-degree corners entirely to maintain the tactile, comforting feel of baked goods.

## Components

- **Buttons:** Pill-shaped or fully rounded (16px+ radius) with soft pastel rose backgrounds (`#F4A7B9`) and warm grey-brown text (`#6B5B5B`). Hover states should slightly lighten or bloom with a soft ambient shadow.
- **Chips & Tags:** Small, rounded badges utilizing pastel highlights like butter yellow (`#FFE9A8`) or mint cream (`#DFF3E8`) to categorize menu items or tags.
- **Lists:** Generously padded list items separated by soft, low-contrast dividers in blush pink, ensuring easy scanning for menus or item selections.
- **Checkboxes & Radio Buttons:** Custom styled with rounded corners and circles, filling with pastel rose when selected, accompanied by soft warm grey labels.
- **Input Fields:** Generously rounded text inputs featuring warm cream backgrounds, subtle rose-brown borders, and placeholder text in muted grey-brown.
- **Cards:** Elevated surfaces with 16px rounded corners, warm cream or blush pink backgrounds, and soft ambient shadows, ideal for showcasing bakery items, daily specials, or user reviews.
- **Quantity Steppers:** Pill-shaped controls that allow users to easily adjust items in their pastry box with gentle tactile feedback.