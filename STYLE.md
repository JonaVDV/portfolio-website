# CSS and Component Styling Guide

This document outlines the specific CSS patterns, layout strategies, and modern web standards used in this project. It is intended for both developers and AI agents to understand the methodology behind the styling.

## 1. Property Scoping and Private Variables

We use a specific naming convention to distinguish between a component's public styling API and its internal implementation details.

- **Public Variables (`--component-name-prop`)**: These are intended to be overridden by the consumer. They define the "themeable" surface area of a component.
- **Private Variables (`--_component-name-prop`)**: These are internal implementation details. They typically consume the public variable while providing a sensible default.

### Pattern: The Default Fallback

```scss
.breadcrumb {
  // 1. Define private variable with public override + default
  --_breadcrumbs-gap: var(--breadcrumbs-gap, 0.5rem);

  // 2. Use the private variable internally
  gap: var(--_breadcrumbs-gap);
}
```

**Why?** This prevents the "variable leakage" problem where internal changes accidentally break external overrides, and ensures that internal fallback logic is centralized in one place.

---

## 2. Media-Query-Free Layouts

We avoid fixed media queries (`@media`) in favor of **Container Queries** and mathematical "logic gates." This makes components truly fluid and responsive to their _placement_ rather than the viewport size.

### The "Breakpoint Gate" Strategy

To switch between values (e.g., expanded vs. collapsed states) based on width without a media query, we use a calculation that behaves like a binary switch:

```scss
/* 
 * 1) Build a "gate" that stays at 0px until 100cqi exceeds the breakpoint.
 * 2) Multiplied by a large number (9999) to force it to "snap" once positive.
 * 3) Capped at 100cqi to prevent overflow.
 */
--sidebar-breakpoint-gate: min(
  max(0px, (100cqi - var(--sidebar-mobile-breakpoint)) * 9999),
  100cqi
);

/* Use the gate to clamp widths */
--sidebar-expanded-width: min(var(--sidebar-max-width), var(--sidebar-breakpoint-gate));
```

### Key Units & Properties

- `100cqi`: 100% of the container's inline size.
- `100svh`: Shortest Viewport Height (avoids mobile browser UI issues).
- `container-type: inline-size`: Sets up an element as a container query context.

---

## 3. Modern Web Standards

We prioritize native browser APIs over custom JavaScript reimplementations.

### Popover API

- Use `popover="auto"` or `popover="manual"` on elements.
- Use `popovertarget` on triggers.
- Benefits: Native top-layer handling, light-dismiss, and keyboard support (ESC) for free.

### CSS Anchor Positioning

Used to position elements relative to a trigger without manual calculation or `getBoundingClientRect`.

```html
<!-- Trigger -->
<button style="anchor-name: --my-anchor">Open</button>

<!-- Popover -->
<div popover style="position-anchor: --my-anchor; position-area: top;">Content</div>
```

### @property (CSS Typed OM)

We use `@property` to register custom properties. This allows us to:

1.  Define a type (e.g., `<length>`, `<color>`).
2.  Enable **transitions and animations** for custom properties that would otherwise be discrete.
3.  Provide initial values that are respected by the browser's computation engine.

```scss
@property --sidebar-active-width {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}
```

---

## 4. Component Architecture Patterns

### Slot-Driven Composition

We use Svelte snippets (slots) to allow deep customization while maintaining layout consistency. Major components like `Item` and `Shell` use named snippets for `header`, `media`, `actions`, and `footer`.

### "No-Logic" Interactivity

Many "interactive" features are implemented purely via CSS selector logic.

- **Hover/Active**: Instead of JS state, we use `:is(a, button, [role='option'], [tabindex='0']):hover`.
- **Zebra Striping & Border Logic**: Handled via `:nth-child` and combined with private variable fallbacks.

### Smart Relative Color Manipulation

We use the `oklch` color space and the `from` keyword for dynamic color variations (like hover states) that work across any theme:

```scss
--_item-background: var(
  --item-background-hover,
  oklch(from var(--_item-background-base) calc(l - 10) c h)
);
```

---

## 5. Global Utility Patterns

### The `flow` Utility

Used to create consistent vertical spacing between siblings without needing manual margins on every element.

```scss
.flow > :where(:not(:first-child)) {
  margin-block-start: var(--flow-spacer, 1em);
}
```

this is particularly useful for flowing content like articles, lists, or any stacked elements where you want consistent spacing without worrying about the first-child margin. we usually use this for text though, because we can use em to scale the spacing with the font size, but it can be used for any type of content.

### The `grid-stack` Utility

Simplifies overlapping elements (like background images with text overlays) without relying on `position: absolute`.

```scss
.grid-stack {
  display: grid;
  grid-template-areas: "stack";
  & > * {
    grid-area: stack;
  }
}
```

this can also be used for things like a notification badge on top of an icon, where the badge and icon are siblings in the markup but visually stacked.

### The `flex-group` Utility

A robust utility for creating flex containers with consistent gaps and alignment. It defaults to a `fit-content` width and wraps by default, which is ideal for toolbars, tag lists, or button groups.

#### Core Container Modifiers

- `.flex-group`: The base class. Uses `--flex-gap` (default `1em`) to create a responsive gap (half-gap for rows, full-gap for columns).
- `.center`: Centers items and sets width to `auto`.
- `.nowrap`: Prevents items from wrapping to a new line.
- `.space-between`: Forces the container to `100%` width and distributes space between items.

#### Item Layout Modifiers

- `.push-first`: Applied to the container; pushes the first child to the start by setting `margin-inline-end: auto`. Useful for "Logo + Nav" patterns.
- `.push-last`: Applied to the container; pushes the last child to the end by setting `margin-inline-start: auto`. Useful for "Primary Nav + CTA" patterns.
- `.no-shrink`: Applied directly to a child to prevent it from collapsing in tight flex contexts.
- `--align-self`: Can be set as a CSS variable on any direct child of `.flex-group` to override its individual alignment (defaults to `auto`).

```scss
.flex-group {
  --flex-gap: 1em;
  display: flex;
  width: var(--_flex-container-width, fit-content);
  flex-wrap: wrap;
  align-items: center;
  gap: calc(var(--flex-gap) / 2) var(--flex-gap);

  & > * {
    align-self: var(--align-self, auto);
  }

  &.center {
    --_flex-container-width: auto;
    justify-content: center;
  }

  &.nowrap {
    flex-wrap: nowrap;
  }

  &.push-first > :first-child {
    margin-inline-end: auto;
  }

  &.push-last > :last-child {
    margin-inline-start: auto;
  }
}

.space-between {
  --_flex-container-width: 100%;
  justify-content: space-between;
}

.no-shrink {
  flex-shrink: 0;
}
```

---

## 6. Advanced Grid Systems

### The `primary-layout` Shell

The `primary-layout` (found in `Shell.svelte`) is a three-track grid system designed to handle sidebars and centered content without complex wrappers.

- **Named Tracks**: `[full-width-start]`, `[content-start]`, `[content-end]`, `[full-width-end]`.
- **The Sidebar Interaction**: The sidebar track is a `minmax(0, var(--sidebar-active-width))`. Because `--sidebar-active-width` is a typed length (via `@property`), it can be transitioned smoothly.
- **Content Centering**: The center track uses `--content-max-width` (default `65ch`) but stays fluid via `calc(100cqi - sidebar - padding)`.

whenever you need to align content in complex ways, like a header navigation that has some content that stretches from the end of the content to the edge of the screen, you can use this layout to place it in the "full-width" area while keeping the main content centered. this can also be used for breaking out of the content area for things like a full-width hero image or a background color that spans the entire width of the viewport.

### Responsive `grid-auto-columns` (The Math Fix)

Standard CSS `auto-fit` often creates "single wide columns" on small screens but lacks a way to cap the number of columns on large screens. Our utility uses a "math gate" to enforce a `--max-columns` limit:

```scss
/*
 * Calculates the exact point where columns would break
 * based on min-size, max-columns, and gap.
 */
--column-size: calc((100% / var(--max-columns)) - (var(--gap, 1em)));

grid-template-columns: repeat(
  var(--grid-fit-strategy),
  minmax(min(max(var(--column-size), (100% - var(--breakpoint)) * -9999), 100%), 1fr)
);
```

**Effect**: This forces the grid to respect the `--max-columns` even when there is enough space for more, while still collapsing down to a single column on mobile.

---

## 7. Stacking & Layout Encapsulation

Styling should be driven by **state attributes** rather than class manipulation.

- **Bad:** `.sidebar.is-collapsed`
- **Good:** `aside[data-collapsed="true"]`

This allows CSS to react directly to the data passed into a component (e.g., via Svelte's `$state`) without needing explicit class-toggling logic in the script block.

## 8. Progressive Enhancement

We build components to work in a basic form without JavaScript, then enhance them with interactivity and polish. This means:

- Using native HTML elements (like `<details>` for accordions) that provide basic functionality out of the box.
- Adding CSS for better visuals and transitions.
- Enhancing with JavaScript only for advanced features or improved accessibility.

Progressive enhancement can also be applied to new CSS features. For example, we can use `@property` to enable transitions on custom properties, but the component will still function without it (albeit without smooth transitions). The same goes for things like `interpolate-size` or `transition-behavior: allow-discrete` - they enhance the experience but aren't strictly necessary for basic functionality.

So long as the core functionality of a component is preserved without JavaScript or newer CSS features, we can consider it progressively enhanced.

## 9. Component Composition Patterns

We use two primary patterns for building flexible components in Svelte 5, often combining them for complex features.

### Pattern A: Snippet-Driven Composition (The "Item" Pattern)

This is our default approach for standalone components with a fixed internal layout but variable content pockets. Instead of complex prop flags, we use named snippets (`{#snippet ...}`) to allow consumers to inject content into predefined layout areas.

- **Canonical Example**: [Item.svelte](packages/ui/src/lib/components/Item/Item.svelte) defines `header`, `media`, and `actions` snippets.
- **When to use**: When a component has a consistent "container" logic but the internal pieces (like icons, titles, or buttons) can vary wildly.
- **Key Mechanic**: The component provides the layout (e.g., a `.flex-group` or `.grid-stack`) and the consumer provides the content.

### Pattern B: Compound Components (The "Sidebar" Pattern)

For complex systems where multiple parts need to share state or react to each other without prop drilling, we use compound components.

- **Canonical Example**: The [Sidebar](packages/ui/src/lib/components/Sidebar/) family (`Sidebar`, `SidebarItem`, `SidebarGroup`, etc.).
- **When to use**: When you have a deep or flexible hierarchy where children need to know about a parent's state (e.g., if the sidebar is `collapsed`).
- **Key Mechanic**: Use a `context.ts` to define a reactive state object. The parent (e.g., `SidebarProvider`) sets the context, and descendants use a getter (e.g., `getSidebarState()`) to access and even modify that state.

### Pattern C: Progressive Hybrids

The most powerful components often combine both. For example, `Sidebar.svelte` uses snippets for its own `header` and `footer` areas while simultaneously participating in the broader compound component state. This allows for a declarative API that feels clean and declarative.

---

## 10. Component Variant Theming (The 3-Layer Color System)

Components that have visual variants (different colors, moods, or semantic meanings) follow a consistent 3-layer customization pattern. This is deliberately implemented **per component** rather than shared globally, because each component uses component-namespaced CSS custom properties — sharing a single selector across components would cause variable name collisions and make nesting impossible.

The pattern is a convention; the 15-or-so implementation lines are intentionally copy-pasted per component.

### How it works

The component owns the **mechanism**: oklch-based hover/active derivation lives inside the component's `<style>` block. A consumer-owned `{Component}.variants.css` file owns the **palette**: it just sets base colors. Hover and active states are derived automatically.

```css
/* Inside the component's <style> — applied to every variant automatically */
.button[data-variant] {
  --_button-hover-l: var(--button-hover-l, -0.08);  /* layer 2 default delta */
  --_button-hover-c: var(--button-hover-c, 0);
  --_button-hover-h: var(--button-hover-h, 0);
  --_button-active-l: var(--button-active-l, -0.16);
  --_button-active-c: var(--button-active-c, 0);
  --_button-active-h: var(--button-active-h, 0);

  background-color: var(--button-background);

  &:is(:hover, :focus-visible) {
    background-color: var(
      --button-hover-background,        /* layer 3: full override */
      oklch(
        from var(--button-background)
        calc(l + var(--_button-hover-l))  /* layer 2: tunable deltas */
        calc(c + var(--_button-hover-c))
        calc(h + var(--_button-hover-h))
      )
    );
  }
}
```

The consumer's variants file is minimal — just base colors:

```css
/* Button.variants.css — consumer-owned */
[data-variant='primary'] {
  --button-background: var(--clr-brand-400);
  --button-color: var(--clr-brand-000);
}
```

### The three layers

| Layer | Consumer sets | Effect |
|-------|---------------|--------|
| **1 — Base** | `--{component}-background` | Changes base color; hover/active derived automatically |
| **2 — Deltas** | `--{component}-hover-l`, `-c`, `-h` | Tunes how far hover/active shift in oklch space |
| **3 — Override** | `--{component}-hover-background` | Bypasses derivation entirely for a specific state |

Layers are applied in priority order: layer 3 wins over layer 2 which wins over the default. Consumers only need to reach for the next layer when the previous one is insufficient.

### Why per component, not a shared selector

A shared `[data-has-variants]` selector would force all components to use the same generic var names (e.g., `--component-background`). That breaks as soon as two components are nested — the inner component would inherit and potentially clobber the outer one's values. Component-namespaced vars (`--button-background` vs `--alert-background`) are what makes the cascade safe.

The implementation overhead is low: the oklch block is ~15 lines and the pattern is identical across components. For this reason the pattern is intentionally copy-pasted rather than abstracted.

### Variants file convention

Every component with variants ships a `{Component}.variants.css` file next to the component. This file is:

- **Consumer-owned**: designed to be copied into the consumer's project and edited freely
- **Minimal**: only base colors (layer 1), with commented-out layer 2/3 examples
- **Self-documenting**: includes the full public API as a comment block at the top

For display-only components (no hover/active), the same file convention applies but the oklch derivation block is omitted from the component's style — only layer 1 and 3 are relevant.

### Applying to a new component

1. Add `data-variant={variant}` to the root element and `variant?: string` to props
2. In `<style>`: add the `[data-component][data-variant]` base block with the oklch hover/active derivation
3. Create `{Component}.variants.css` with at minimum a `primary` variant and the full API comment block
4. Import the variants file in `{Component}.stories.svelte` as a side-effect import
