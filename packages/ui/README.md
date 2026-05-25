# JonaVDV - Portfolio - UI

This package contains reusable UI components for my portfolio. It is built using Svelte and TypeScript, and is designed to be easily integrated into any Svelte project.

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
