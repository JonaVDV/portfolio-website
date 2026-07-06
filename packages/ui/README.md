# @SCOPE/ui

Native-first Svelte 5 component library. Static components (dialogs, popovers, avatars, …) ship **zero JavaScript** — they build on native platform features (`<dialog>`, Popover API, Invoker Commands, CSS anchor positioning) and use JS only to progressively enhance. Styling is fully yours via CSS custom properties and consumer-owned `*.variants.css` files. See [PHILOSOPHIES.md](./PHILOSOPHIES.md) and the repo's STYLE.md for the guiding principles.

## Installation

```sh
pnpm add @SCOPE/ui
```

```svelte
<!-- +layout.svelte -->
<script>
	import '@SCOPE/ui/styles/main.css';
</script>
```

```svelte
<script>
	import { Button, Dialog } from '@SCOPE/ui';
	import * as DropdownMenu from '@SCOPE/ui/components/DropdownMenu';
</script>
```

- Simple components are flat named exports (`Button`, `Dialog`, `AlertDialog`, `Card`, …).
- Compound components are namespaces (`DropdownMenu.Root`, `Sidebar.Item`, `Form.Input`, …), importable from the root or per-component subpaths.

### Variant styles (the CLI)

Color/variant styling lives in `*.variants.css` files that **you own**. Pull them into your project with [@SCOPE/cli](../cli):

```sh
npx @SCOPE/cli init
npx @SCOPE/cli add button dialog
```

The CLI also supports a shadcn-style **vendor** mode that copies whole components into your project. See the CLI README.

## styling

### Layout

#### Shell

The shell component is a simple wrapper that provides a consistent layout for the application. You can enable different modules on the shell, such as a header and sidebar, by using the `modules` prop. The shell also provides a slot for the main content of the application. this is useful for pages that have a consistent layout, such as a dashboard or admin panel. This is all responsive, however, the sidebar will only be responsive up to around 375px
only **if** you make the sidebar collapsible.

other then that, there are also some utility classes to make the shell even more flexible, these include:

- `full`: makes the element take up the full width of the viewport, but leaves the default padding on the left and right sides. It also makes any children of the shell take up the `content` width. this is useful for if you want to have a full width background, but still want to have the content of the page constrained to a certain width.
- `full-start`: makes the element take up space from the left edge of the viewport (minus the default padding) to the right edge of the `content` area.
- `full-end`: makes the element take up space from the right edge of the viewport (minus the default padding) to the left edge of the `content` area.
- `content`: makes the element take up the full width of the content area, which is the area between the left and right padding of the shell and is the inner layer so to speak.
- `full-width`: alias for `full`,
- `full-content`: same as `full`, but also makes the children of the element take up the full width of the viewport, this is usefull if you want the entire section to be full width, including the content. this will however still leave the default padding on the left and right sides of the viewport.
- ``full-content-nopadding`: same as `full-content`, but also removes the default padding on the left and right sides of the viewport, this is useful if you want the entire section to be full width, including the content, and you don't want any padding on the sides of the viewport.

##### Shell sidebar/content sizing formula

The shell uses CSS math functions (without extra media queries) to decide how much width the sidebar track should reserve and how much width content can use.

Variables involved:

- `--sidebar-mobile-breakpoint`: breakpoint where sidebar track reservation starts.
- `--sidebar-max-width`: desktop expanded sidebar cap.
- `--sidebar-icons-only-width`: collapsed icon rail width.
- `--minimum-content-padding`: horizontal shell padding per side.
- `--content-max-width`: readable measure cap for content.

Core equations:

```css
/* 0 below breakpoint, very large above breakpoint */
--sidebar-breakpoint-gate: min(
  max(0px, (100cqi - var(--sidebar-mobile-breakpoint)) * 9999),
  100cqi
);

/* Breakpoint-aware sidebar widths */
--sidebar-expanded-width: min(var(--sidebar-max-width), var(--sidebar-breakpoint-gate));
--sidebar-collapsed-width: min(var(--sidebar-icons-only-width), var(--sidebar-breakpoint-gate));

/* Chosen by state: expanded by default, collapsed when [data-sidebar-collapsed='true'] */
--sidebar-active-width: var(--sidebar-expanded-width);

/* Available content width after sidebar and both paddings */
--content-available-inline-size: calc(
  100cqi - var(--sidebar-active-width) - var(--minimum-content-padding) * 2
);

/* Clamp to readable max and never go negative */
--content: min(var(--content-max-width), max(0px, var(--content-available-inline-size)));
```

Practical behavior:

- below breakpoint: sidebar reservation becomes `0px`, so content can fill available space.
- above breakpoint + expanded: content shrinks by expanded sidebar width.
- above breakpoint + collapsed: content shrinks only by icon rail width.
- shell without sidebar: default grid still works, since the sidebar track is only used by `.with-sidebar`.

#### Flex

for flex there is no component, but there are utility classes that you can use to create a flex container.
for the basic flex container, you can use the `flex-group` class, this will make the element a flex container and will also apply some default styles to it, such as `width: fit-content;` and `gap: 1rem;`.

See the full class reference in the [layout styles](./src/lib/styles/layout/_flex.scss) file.
to set a gap, simply change the `--flex-gap` variable on the element, for example:

```html
<div class="flex-group" style="--flex-gap: 2rem;">
  <!-- flex items here -->
</div>
```

if you want the items to have space between them, you can use the `space-between` class on the flex container, this will apply `justify-content: space-between;` to the container and set the width to `100%`,

```html
<div class="flex-group space-between">
  <!-- flex items here -->
</div>
```

in order to center the items, you can use the `center` class on the flex container.

```html
<div class="flex-group center">
  <!-- flex items here -->
</div>
```

by default the flex container will wrap the items, but if you want to prevent that, you can use the `nowrap` class on the flex container.

```html
<div class="flex-group nowrap">
  <!-- flex items here -->
</div>
```

all the utility classes are scoped to the flex container, so you can use them on any element that has the `flex-group` class, and they will only apply to that element and its children.

#### Grid

for grid there is also no component, but there are utility classes that you can use to create a grid container. in order to create an adapting grid that works on any screen size and has a max limit of columns, you can use the `grid-auto-fit` class on the container, and set the `--min-column-size` variable to the minimum size of the columns, and the `--max-columns` variable to the maximum number of columns, for example:

```html
<div class="grid-auto-fit" style="--min-column-size: 200px; --max-columns: 4;">
  <!-- grid items here -->
</div>
```

this will create a grid that adapts to the screen size, and will have a maximum of 4 columns, and the columns will have a minimum size of 200px, if the screen size is smaller than 800px, the grid will automatically reduce the number of columns to fit the screen size, and if the screen size is larger than 800px, the grid will have 4 columns, and the columns will have a size of 200px.

> [!NOTE]: this is excluding the gap between the columns, so if you have a gap of 1rem, the actual minimum size of the columns will be 200px + 1rem. but this is calculated automatically by the grid, so you don't have to worry about it.

If you want to adjust the gap between the columns, you can set the `--gap` variable on the container, for example:

```html
<div class="grid-auto-fit" style="--min-column-size: 200px; --max-columns: 4; --gap: 2rem;">
  <!-- grid items here -->
</div>
```

## components

Accordion ✅
Alert Dialog
Alert ✅
Aspect Ratio ❌ <!-- will not implement, just use CSS for this, it's not worth it to make a component for this. -->
Avatar
Badge ✅
Breadcrumb
Button Group
Button ✅
Calendar
Card ✅
Carousel
Chart (lowest on the priority list, but will be implemented eventually but on top of layerchart v2 for svelte 5+)
Checkbox ✅
Collapsible
Combobox (can be created using a combination of the popover and command components)
Command ✅
Context Menu
Data Table ✅ currently also requires some backend logic to handle the data, but with sveltekit remote functions, this can be done easily, and the data table can be used to display any kind of data, and can be easily integrated into any project.
Date Picker ❌ <!-- will not implement, over all a date picker can be best left to the browser. with input type date, and if you need a date range picker, you can use two input type date and some custom logic to handle the range. -->
Dialog ✅
Drawer
Dropdown Menu ✅
Empty
Field
Formsnap ❌ <!-- will not implement, formsnap already exists as a separate package, and it is not worth it to make a component for this, since it is already a standalone package that can be easily integrated into any project. -->
Hover Card
Input Group ✅
Input OTP
Input ✅
Item ✅
Kbd ✅
Label ✅ (maybe needs some extra customization)
Menubar
Native Select ❌ <!-- will not implement, the select component is already a native select, and the native select is already a native select, so there is no need to make a component for this. -->
Navigation Menu
Pagination
Popover ✅
Progress ✅
Radio Group ✅ (also maybe needs some extra customization)
Range Calendar ❌ <!-- will not implement, similar to the date picker, a range calendar can be best left to the browser, with input type date and some custom logic to handle the range. -->
Resizable
Scroll Area (i am split on this one, it can be useful for some use cases, but it can also be done with CSS, so i will leave it as a maybe for now)
Select
Separator ✅
Sheet
Sidebar ✅
Skeleton ✅ (maybe some improvements can be made to the skeleton component. currently it does not handle a non-explicit width or height very well)
Slider ✅ (see range input for more information on this, the slider component is a wrapper around the range input, and it can be customized to look like a slider, but it is still a range input under the hood, so it has the same limitations as the range input)
Sonner
Spinner ✅
Switch ✅
Table ✅
Tabs ✅
Textarea ✅
Toggle Group
Toggle ✅
Tooltip ✅
Typography

Browser support: the components are designed to work on all modern browsers. all features used in the components have at least 90%, are base
