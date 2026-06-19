# Ansaea Design System

Ansaea's frontend employs a bespoke CSS methodology prioritizing a "Clinical Precision" and "Medical Luxury" aesthetic. The system avoids heavy utility libraries (like Tailwind CSS) to maintain strict architectural control over visual tokens.

## 1. Aesthetic Vision
- **Sterile yet High-End**: Emphasizing extreme whitespace, stark contrasts, and minimal visual noise.
- **Micro-Interactions**: Elements feature subtle, smooth transitions (e.g., `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`) to ensure the application feels highly responsive and premium.

## 2. Global CSS Variables (`index.css`)
We define strict CSS custom properties to ensure consistency across the application.

### Colors
- `--color-background`: `#ffffff` (Pure White) - Used for primary surfaces.
- `--color-surface`: `#fcfcfc` (Clinical Grey) - Used for cards and secondary panels.
- `--color-surface-variant`: `#f5f5f5` - Used for hovers and subtle backgrounds.
- `--color-primary`: `#000000` (Obsidian) - Used for primary buttons, core typography, and distinct headers.
- `--color-border-subtle`: `#eaeaea` - Used for sharp, 1px demarcations.

### Typography
- Primary Font: **Hanken Grotesk**
- Headings are tight-tracked (`letter-spacing: -0.02em`) and bold (`font-weight: 600`).
- System UI utilizes uppercase styling for labels:
  ```css
  .font-label-caps {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  ```

## 3. Structural Rules
- **Radii**: Sharp, minimal corner rounding (`8px` globally via `--radius-md`).
- **Shadows**: Avoid heavy drop-shadows. Depth is achieved via `1px solid var(--color-border-subtle)` rather than blurring.
- **Forms**: Input fields use minimalistic borders that transition smoothly into obsidian outlines upon focus.
