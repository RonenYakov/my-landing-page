# Hero Refinement — IDE-Real Code Blocks + Toned-Down Field

Date: 2026-07-06
Status: approved

## Problem

The current hero layers 14 syntax-colored one-liner snippets (VS Code blue/orange/green)
over a dense 3D particle field. The result reads as noisy and messy on the white page.
The center hairline divider adds a visible seam the owner dislikes.

## Decision summary (from brainstorming)

1. **Keep the 3D field, toned down.** It stays the centerpiece but becomes atmosphere.
2. **Replace the 14 one-liners with 4 multi-line code blocks** that read like a real IDE —
   realism from structure (indentation, nesting, comments, real identifiers), not color.
3. **Monochrome, two shades.** Code in `var(--navy-muted)`, comments in light gray. No
   backgrounds, no pills, no syntax colors, no generated images.
4. **Cursor spotlight + light parallax** for mouse interaction.
5. **Remove the hairline frontier divider** from the 3D scene entirely.

## 1. Particle field changes (`src/components/HeroField.tsx`)

- Desktop grid 40×13×5 → **32×11×4** (~1400 points); mobile reduced proportionally (~14×13×3).
- Point opacity 0.9 → **0.55**; size 0.045 → **0.04**.
- Remove the frontier "sizzle" jitter block in the frame loop.
- Soften the chaos color slightly (toward `#5a6f8f`-range) so the left side recedes.
- **Delete the divider mesh** (planeGeometry + its per-frame positioning code).
- Keep: morph spring semantics, entrance scatter assembly, parallax tilt, reduced-motion
  and mobile behavior, `dpr` cap, disc sprites.

## 2. Code blocks (`src/components/SplitHero.tsx`)

- **4 blocks total, 2 per side**, each 4–6 lines of real, structurally honest code:
  - AI side: SNN seizure-detection model definition (torch/snntorch) with a trailing
    comment like `# 64-channel EEG input`; a training-loop / metrics fragment with
    realistic values.
  - Fullstack side: Express/CORS server fragment in the owner's actual server style;
    a React component fragment.
- Typography: IBM Plex Mono, ~0.72rem, line-height 1.6, `white-space: pre`, left-aligned.
- Color: code `var(--navy-muted)`; comments `#a8b2c0` (approx). Two shades only.
- No background, border, or shadow. Positioned absolutely in each identity's territory,
  clear of the big Moderniz side labels.

## 3. Motion

- **Idle:** blocks rest at ~35% opacity with the existing slow vertical float.
- **Spotlight:** within ~240px of the cursor a block eases to 100% opacity and its code
  color shifts to `var(--navy)`; smooth distance falloff, spring-eased.
- **Parallax:** each block drifts 6–14px against the cursor at its own depth.
- **Reduced motion:** all blocks static at 60% opacity, no spotlight, no float.
- **Mobile (<768px):** blocks hidden (unchanged from today).

## Out of scope

- Side labels, scroll cue, boot overlay, mobile auto-cycle frontier — all unchanged.
- No Higgsfield / image generation; everything is rendered text.
