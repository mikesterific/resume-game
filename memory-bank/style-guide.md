
# Portfolio Quest Style Guide

This style guide establishes the visual and interaction standards for Portfolio Quest, ensuring a cohesive sci-fi spaceship exploration theme. It draws inspiration from retro sci-fi aesthetics (e.g., Star Trek/Blade Runner vibes) with pixel-art elements for the game world and modern, clean UI for overlays/modals. All designs prioritize professionalism, accessibility (WCAG AA), and performance (optimized for Phaser.js rendering and Vue.js components).

## 1. Core Principles
- **Theme**: Sci-fi exploration – dark space with neon accents, metallic interfaces, holographic effects.
- **Tone**: Professional yet adventurous; Tech-forward, innovative, reliable.
- **Accessibility**: High contrast (min 4.5:1 ratio); Keyboard/touch-friendly; Semantic HTML/ARIA.
- **Responsiveness**: Mobile-first; Scale assets for desktop/HDMI (e.g., 1080p/4K).
- **Tools**: Pixel-art via Aseprite; CSS for UI (with GSAP for animations); Phaser.js for game sprites.

## 2. Color Palette
Use a dark base for space immersion with vibrant neon accents for highlights/interactions. Hex codes provided; Ensure WCAG compliance.

- **Primary (Space Background)**: #0A0A1F (Deep navy)
- **Secondary (Metallic UI)**: #2A2A4A (Slate gray)
- **Accent (Neon Glow)**: #00FFFF (Cyan) – For highlights, scans, buttons.
- **Neutral (Text/Base)**: #E0E0E0 (Light gray) – For body text.
- **Success (Visited Markers)**: #00FF00 (Neon green)
- **Warning/Error**: #FF4500 (Orange red)
- **Background Variants**: Gradient from #0A0A1F to #1A1A3A for depth.

Example Usage: Buttons – bg-secondary hover:accent; Text – neutral on primary.

## 3. Typography
Sans-serif fonts for a modern, tech feel. Use system fonts for performance; Fallback to Google Fonts if needed.

- **Font Family**: 'Roboto', sans-serif (Primary); 'Orbitron', sans-serif (Headings for sci-fi flair).
- **Sizes**:
  - Headings (H1): 32px (bold, Orbitron)
  - H2: 24px
  - Body: 16px (Roboto)
  - Small: 14px (captions/labels)
- **Weights**: Bold (700) for emphasis; Regular (400) for body.
- **Line Height**: 1.5 for readability.
- **Accessibility**: Min 16px base; Contrast checks against backgrounds.

Example: Modals – H1 for titles, body for descriptions.

## 4. Spacing System
Consistent spacing for layout harmony; Based on a 8px base unit (rem for responsiveness).

- **Base Unit**: 8px (0.5rem)
- **Scale**: x1 (8px), x2 (16px), x3 (24px), x4 (32px), x6 (48px), x8 (64px).
- **Margins/Paddings**: Use x2 for component spacing; x4 for sections.
- **Grid**: 12-column flexible grid for layouts (Vue components).
- **Game Scaling**: Phaser scenes scale to viewport; UI overlays use CSS flex/grid with rem units.

Example: Modal padding: x3 (24px); Planet spacing in galaxy: x8 (64px) for orbits.

## 5. Key Component Styles (Conceptual)
Define base styles for reusable elements; Implement in Vue with CSS classes (or Tailwind-like utilities if integrated).

- **Buttons**: Rounded rectangle (border-radius: 4px); bg-accent, text-primary; Hover: glow effect (box-shadow: 0 0 8px accent); Padding: x2; Font: Roboto bold.
- **Modals**: Semi-transparent overlay (bg-secondary 80% opacity); Border: neon accent glow; Close button: X icon in corner (hover: warning color).
- **Cards (e.g., Skill Info)**: Metallic frame (border: 1px solid secondary); bg-primary; Padding: x3; Shadow: subtle drop (for depth).
- **Icons**: 32x32 pixel-art (e.g., gear for skills, rocket for projects); Neon outline on hover.
- **Animations**: Fade-in (0.3s); Glow pulses (GSAP for holographic effects).

## 6. Imagery & Iconography Style
- **Style**: Retro pixel-art (16-64px resolution) with sci-fi motifs (ships, planets, holograms).
- **Guidelines**: High contrast; Avoid clutter; Use sprite sheets for animations (e.g., ship thrust).
- **Sourcing**: Free itch.io packs; Custom in Aseprite.
- **Tone of Voice**: Concise, professional (e.g., 'Scan Complete' instead of playful quips).

## 7. Accessibility & Best Practices
- **Contrast**: All text meets WCAG AA.
- **Focus States**: Visible outlines (accent color).
- **Alt Text**: Required for all images/icons.
- **Responsive Breakpoints**: Mobile (<768px): Simplified layouts; Desktop: Full immersion.
- **Performance**: Compress assets; Lazy-load non-essential images.

This guide is a living document – update as needed for new features. Last Updated: [Date]. 