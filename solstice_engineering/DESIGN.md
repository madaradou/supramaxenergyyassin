```markdown
# Design System Strategy: Modern Engineering meets Luxury Minimalist

## 1. Overview & Creative North Star
This design system is built to bridge the gap between technical prowess and high-end editorial sophistication. Our goal is to move away from the "SaaS-standard" layout of cards and borders, instead adopting a philosophy we call **"The Kinetic Curator."**

**The Kinetic Curator** treats the digital interface as a high-end physical gallery for engineering excellence. We use intentional asymmetry, overlapping elements, and high-contrast typography scales to create a sense of momentum. The layout should feel "engineered" through precise alignment and "luxury" through expansive white space and tonal depth. We do not use lines to separate ideas; we use space and light.

---

## 2. Colors: Tonal Depth over Structural Lines
The palette is rooted in a deep tech blue, supported by the energetic friction of sun-orange and environmental green. To maintain a premium feel, these vibrant accents must be used with surgical precision (less than 5% of the total UI surface).

### The "No-Line" Rule
Standard 1px solid borders are prohibited for sectioning or containment. Boundaries must be defined solely through:
1.  **Background Color Shifts:** A `surface_container_low` (#f6f3f2) section sitting on a `background` (#fcf9f8).
2.  **Tonal Transitions:** Moving from `surface_container` (#f0eded) to `surface_container_highest` (#e4e2e1) to define hierarchy.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface tiers to create "nested" depth:
- **Base Layer:** `background` (#fcf9f8) or `surface` (#fcf9f8).
- **Secondary Content Areas:** `surface_container_low` (#f6f3f2).
- **Interactive/Elevated Elements:** `surface_container_lowest` (#ffffff).
- **Overlays/Tooltips:** Use `surface_bright` (#fcf9f8) with a signature glassmorphism effect.

### The Glass & Gradient Rule
To achieve a "Modern Engineering" look, use Glassmorphism for floating navigation or secondary panels. Apply `surface_container_lowest` at 70% opacity with a `24px` backdrop-blur. 
*   **Signature Gradients:** For Hero backgrounds or Primary CTAs, use a subtle linear gradient from `primary` (#003466) to `primary_container` (#1a4b84) at a 135-degree angle to provide a sense of "tech-soul."

---

## 3. Typography: Authority in Contrast
We utilize a high-contrast pairing to evoke the feeling of a prestige engineering journal.

- **Headings (Noto Serif):** The "Authority." Use `display-lg` (3.5rem) for hero statements to command attention. These should be set with tight letter-spacing (-0.02em) to feel architectural.
- **Body & Labels (Manrope):** The "Technical Precision." Manrope provides a clean, geometric feel that balances the serif’s traditionalism.
- **Visual Scale:** Always maintain a minimum 2:1 ratio between heading sizes and body sizes to ensure an editorial, non-generic hierarchy.

---

## 4. Elevation & Depth: Tonal Layering
Depth in this system is achieved through "stacking" rather than traditional structural shadows.

- **The Layering Principle:** Place a `surface_container_lowest` (#ffffff) card on a `surface_container_low` (#f6f3f2) background. The change in hex value creates a soft, natural lift that feels like fine paper.
- **Ambient Shadows:** When a floating effect is required (e.g., a primary modal), shadows must be extra-diffused. 
    - **Shadow Token:** `0px 24px 48px -12px rgba(27, 28, 28, 0.06)`. 
    - Note the use of the `on_surface` color (#1b1c1c) at very low opacity to mimic natural light.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (#c3c6d1) at 20% opacity. 100% opaque high-contrast borders are forbidden.

---

## 5. Components

### Buttons
- **Primary:** `primary` (#003466) background with `on_primary` (#ffffff) text. Use `lg` (0.5rem) rounding for a modern, slightly softened edge.
- **Secondary:** Transparent background with a "Ghost Border" of `outline` (#737781) and `primary` text.
- **Action/Accent:** Use `secondary_container` (#fc9910) sparingly for high-conversion energy moments.

### Cards & Lists
- **Rule:** Forbid the use of divider lines. 
- Use vertical white space from a 16px/24px/48px spacing scale to separate content. 
- For cards, use `surface_container_low` with a hover transition to `surface_container_high`.

### Input Fields
- Use `surface_container_lowest` (#ffffff) for the input area to provide high contrast against `background` (#fcf9f8). 
- **States:** On focus, transition the "Ghost Border" from 20% opacity to a 100% opaque `surface_tint` (#335f99).

### Energy Metrics (Custom Component)
For renewable data, use "Large-Scale Data Displays." Pair a `display-md` (2.75rem) Noto Serif number with a `label-sm` Manrope description. Surround this with ample white space to let the data "breathe" like a premium report.

---

## 6. Do's and Don'ts

### Do:
- **Embrace Asymmetry:** Align a text block to the left and a technical diagram slightly off-center to the right to create visual tension.
- **Use "Intentional Overlap":** Let an image container slightly overlap a `surface_container` background to create a sense of three-dimensional layers.
- **Prioritize Breathing Room:** If a layout feels "busy," increase the white space by 20%.

### Don't:
- **Don't use 1px dividers:** If you feel the need for a line, use a background color shift instead.
- **Don't use "pure black" shadows:** Always tint your shadows with the `on_surface` charcoal tone to keep them integrated.
- **Don't clutter the Accent colors:** Sun-orange (#fc9910) and Environmental Green (#183c00) are spices, not the main course. Use them for status indicators or singular CTAs only.

### Accessibility Note
Ensure that all text on `secondary_container` or `tertiary_container` surfaces uses the corresponding `on_` token (e.g., `on_secondary_container` #643900) to maintain high-contrast readability for our professional audience.```