# Philosophies

This document contains the guiding principles that shape the design and development of the components in this library.

The library exists primarily for my portfolio website, but the ideas described here apply to any project built with modern web standards.

## Native first

Before creating a custom component, I ask a simple question:

> Does the browser already provide this functionality?

Modern browsers already ship with a surprising number of powerful features and elements. Components should build upon those foundations whenever possible instead of replacing them.

Examples include:

- `dialog` for modals
- `details` and `summary` for accordions
- `aside`, `section`, `footer` for structural landmark elements
- native form validation
- the Popover API
- command invokers
- CSS anchor positioning

These features have accessibility, keyboard support, and browser integration built in. Replacing them with custom JavaScript should be the exception, not the default.

`SidebarGroup` is a good example of this in practice. It renders as a `<details>` element when collapsible and a plain `<div>` when not. That single decision gives collapsing behaviour, keyboard support, and the correct ARIA semantics for free. There is no toggle state, no event handler, no `aria-expanded`. The browser handles all of it.

If HTML and CSS can solve a problem, introducing JavaScript requires a strong reason.

## Less code is a feature

Every line of code has a maintenance cost.

A component should justify its complexity by providing meaningful value beyond what the browser already offers. If a feature can be implemented with semantic HTML and a small amount of CSS, adding hundreds of lines of JavaScript rarely improves the end result.

The goal is not to eliminate code entirely, but to write only the code that provides real value.

Simple implementations are generally:

- easier to understand
- easier to debug
- easier to maintain
- less likely to break
- easier to make accessible

The sidebar collapse behaviour is a good example. The entire interaction — toggling between expanded and collapsed states, animating the transition, repositioning items into icon-only mode — is driven by a single `data-collapsed` attribute on the `<aside>` element. There is no class manipulation, no computed style reads, no resize observers. CSS responds to the attribute directly.

## Progressive enhancement

I strongly believe in progressive enhancement.

When a feature can be built using standard HTML and CSS, it should be. Modern browser features can often be adopted before every browser supports them, as long as the experience degrades gracefully.

Take the `closedby="any"` dialog attribute as an example. At the time of writing, Safari does not support this feature. However, the dialog itself still functions correctly. Users on browsers that support the feature receive an enhanced experience, while Safari users still have a fully functional dialog that can be closed using the Escape key or a dedicated close button.

The same logic applies to newer CSS features. `@property` is used in `Shell` to register `--sidebar-active-width` as a typed `<length>` value, which is what allows it to be transitioned smoothly as the sidebar collapses. In browsers that do not support `@property`, the sidebar still collapses correctly — it simply does not animate.

CSS anchor positioning is used in `SidebarItem` to position the action slot relative to its list item. In browsers without support, the action falls back to static layout. The component still works; the positioning just becomes less precise.

On top of that, we also use a polyfill for anchor positioning that provides a close approximation of the native behavior, so even users on older browsers get a similar experience.

This approach allows new platform features to be adopted without sacrificing compatibility.

## Accessibility by default

Accessibility is not an enhancement; it is a feature.

One of the biggest advantages of native HTML elements is that they come with years of accessibility work already built in. Keyboard navigation, semantics, focus management, and screen reader support are often provided automatically.

For example:

```html
<details>
  <summary>Accordion Title</summary>
  <p>Accordion Content</p>
</details>
```

already provides much of the functionality that many component libraries reimplement using custom JavaScript.

Where native elements are not sufficient on their own, the components fill the gaps explicitly. `SidebarSection` generates a unique ID for its label and associates it with the containing `<section>` via `aria-labelledby`, so screen reader users can identify each region of the sidebar. `SidebarItem` sets `aria-current="page"` on active links and `aria-pressed` on active buttons, using the semantically correct attribute for each element type. When the sidebar collapses into icon-only mode and the group label is no longer visible, the tooltip is wired up via `aria-describedby` so the label is still announced.

None of this requires a testing library or a third-party accessibility plugin. It is just HTML attributes applied correctly.

Custom solutions are sometimes necessary, but they should improve upon native behavior rather than replace it unnecessarily.

## Standards outlive frameworks

Frameworks, build tools, and CSS methodologies change constantly.

Web standards move much slower.

Whenever possible, this library builds upon browser standards rather than framework-specific abstractions. A component built on top of HTML, CSS, and browser APIs is more likely to remain useful years from now than one tightly coupled to a particular ecosystem trend.

The layout system in `Shell` is built entirely on CSS grid, container queries, and custom properties. There is no layout library, no utility class framework, no runtime style injection. The core ideas would transfer to any framework, or no framework at all.

Betting on platform direction is also part of this. Container query units (`cqi`), `@property`, `anchor-name`, `100svh`, `content-visibility`, and `isolation: isolate` are all in use. Some of these have partial support today. That is fine — using them now means the components are already positioned to benefit as support matures, rather than requiring a rewrite later.

## Complexity belongs in the implementation, not the API

Some components in this library contain surprisingly complex CSS.

That complexity is intentional.

The goal is not to eliminate complexity. The goal is to place it where it creates the most value.

A layout system should solve difficult layout problems once so that every consumer of the component does not have to solve them again.

A concrete example: the `Shell` component needs to collapse a sidebar without using a media query inside the layout itself. The solution is a "breakpoint gate" — a CSS formula that evaluates to `0px` below a threshold and a very large value above it, then gets clamped:

```css
--sidebar-breakpoint-gate: min(
  max(0px, (100cqi - var(--sidebar-mobile-breakpoint)) * 9999),
  100cqi
);
--sidebar-expanded-width: min(var(--sidebar-max-width), var(--sidebar-breakpoint-gate));
```

Below the breakpoint, the gate is `0px`, so `--sidebar-expanded-width` collapses to `0px`. Above it, the gate is large, so the `min()` resolves to `--sidebar-max-width`. It behaves like a boolean switch in pure CSS.

The same gate pattern is used in `SidebarGroup` and `SidebarItem` to transition padding into icon-centering mode as the sidebar collapses. A single formula replaces what would otherwise be a media query, a JavaScript resize observer, and a pile of conditional class logic.

None of that complexity is visible from the outside. The consumer just writes:

```svelte
<Shell modules={['sidebar', 'content', 'header']}>
```

The implementation may be complex, but the public API should remain simple.

If a layout requires a page of documentation to use, the API is probably too complicated. If the implementation requires a page of documentation but the consumer only needs a few attributes, that is often a worthwhile trade-off.

## We control the layout, you control the styles

This library provides layout primitives, not visual design systems.

The components are responsible for solving layout concerns such as:

- content width constraints
- responsive grids
- sidebars
- spacing relationships
- page structure
- alignment

The consumer remains responsible for visual design.

This means that components generally avoid predefined color palettes, opinionated typography, fixed themes, and framework-specific styling conventions.

Instead, every visual property is exposed through CSS custom properties using a consistent pattern. Each component declares a private property that falls back to a public hook:

```css
--_sidebar-item-border-radius: var(--sidebar-item-border-radius, 0.75rem);
```

The leading underscore signals that `--_sidebar-item-border-radius` is internal. The component uses it everywhere internally. The consumer never sets it directly — they set `--sidebar-item-border-radius`, and the component picks it up automatically. The fallback value means the component looks reasonable out of the box without any configuration at all.

The goal is to provide robust layout behavior while allowing the consuming application to completely control the visual appearance.

A layout should determine where things go, not what they look like.
