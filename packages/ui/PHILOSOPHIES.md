# Philosophies

this document contains the guiding principles and philosophies that shape the design and development of the components in this library. which is used for building my portfolio website.

## use the browser

the components are designed to make as much use of the built-in HTML and CSS capabilities of modern browsers as possible. this means using native elements like `dialogs`, `details`, and `inputs` whenever possible even if it means sacrificing some customizability. Because the user cares far less about how a component looks and far more about if it works.

This also means avoiding heavy JavaScript solutions when a simpler HTML/CSS approach will suffice. Think about things like the popover attrubute, or the command invokers api. which can be implemented with minimal to no JavaScript at all.

## Progressive enhancement

I am a strong believer in progressive enhancement. and i think that when a feature can be built with just HTML and CSS, it should be. Lets take the `"closedby"="any"` attribute for dialogs as an example. This feature allows users to close a dialog by clicking outside of it. At the time of writing this, safari does not support this attribute natively. However we can still use it and the dialog will function correctly in safari, just without that specific feature. This way, users on Chrome, Firefox, etc. get the enhanced experience, while safari users still get a fully functional dialog. that can still be closed with the escape key or a dedicated close button.

## Why not tailwindcss or similar utility-first css frameworks?

Don't get me wrong, I do not hate tailwindcss or similar frameworks and i think for the right person or project they can be a great fit. However i do not see myself using them for this project or in general. Bear with me here it's going to get a bit spicy.

### 1. Debugging

The one time i used tailwindcss i found debugging styles to be a nightmare. when you are trying to figure out why a certain element is not positioned correctly or behaving weirdly in responsive layouts, having a million utility classes, makes finding the specific culprit way more difficult than it needs to be. with traditional (s)css you usually group styles together or create utilities like this:

```css
.flex-group {
	--flex-gap: 1em;
	display: flex;
	width: var(--_flex-container-width, fit-content);
	flex-wrap: wrap;
	align-items: center;
	gap: calc(var(--flex-gap) / 2) var(--flex-gap);
}
```

This way when you inspect an element in the browser devtools, you can see all the related styles grouped together under a single class name. or at maximum like 4-5 class names if you are using modifiers like `.flex-group.center`. This makes it way easier to understand the layout and behavior of the element at a glance. and it means i do not have to scroll endlessly through the browser devtools to find the specific utility class that is causing the issue. This was one of my biggest frustrations when using tailwindcss.

### 2. Readability

this could be just me but i hate reading this:

**taken from shadcn-svelte accordion component**

```html
<button
	class="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180"
></button>
```

versus this:

```html
<summary class="accordion-trigger"></summary>
```

where all the styles are defined in a separate stylesheet (or in my case the style tag of a svelte component):

```css
summary.accordion-trigger {
	color: var(--summary-color, canvastext);
	font-size: var(--summary-font-size, 1.25rem);
	padding: 0.5em 2em;
	display: flex;
	align-items: center;
}
```

### 3. Composability

The other big problem i had when using tailwindcss was composability. when trying to build a sidebar component (because shadcn did not have one) i found myself constantly fighting against the utility classes. both in the naming department as well as the actual styles. i ended up just writing custom css classes anyway to get the desired layout. I found that particularly with grid layouts tailwindcss just is not very intuitive and ends up being more work than its worth. with traditional css i can just create a class like `.sidebar-layout` and define all the grid areas, columns, and rows in one place. making it way easier to manage and understand.

### 4. new css features

Modern CSS has come a long way and with more and more features being added, i definitely want to take advantage of them. In general i have always found that tailwindcss was behind on implementing new CSS features, for example, anchor positioning is now supported in all modern browsers, but tailwindcss does not have any utilities for it. this means that if i want to use anchor positioning in my components, i would have to write custom CSS anyway, which defeats the purpose of using a utility-first framework in the first place.

and with normal css i can also just use a polyfill for if i just want to have a bit more support. anchor positioning for example has a polyfill that works in some older browsers, so i can just include that polyfill and use the feature without worrying about browser support. (of course i would still make sure that the component works without the feature in browsers that do not support it, following the progressive enhancement philosophy).

## Why build a component library from scratch?

There are already so many component libraries out there even for svelte specifically. so why build another one? well for me it comes down to a few key reasons:

1. Learning experience: This is something i just did not know how to do for the longest time and building a component library from scratch is a great way to learn about what i need to be aware of when building reusable components.
2. Component libraries kind of suck. Everytime i look at a component library i always see the same issues over and over again. lets take an accordion component for example. most component libraries implement accordions using divs and javascript to handle the open/close state. For example shadcn-svelte has 400 lines of javascript alone to implement an accordion component. Why do that when you can just do this:

```html
<details>
	<summary>Accordion Title</summary>
	<p>Accordion Content</p>
</details>
```

This is way more accessible, requires no javascript, and works out of the box in every modern browser. yet no component libraries i have seen use standard html elements like this. instead they re-invent the wheel and create complex components that sacrifice accessibility and performance for customizability that you probably do not even need. realistically you only need some basic styles to make it look good, and a few custom properties to tweak the appearance if needed.

3. Control: By building my own component library, i have full control over the design, implementation, and features of each component. And since i do not need tailwind i have no use for the styles being tied to a specific framework or methodology. I can use plain css, scss, or any other styling approach that makes sense for the project at hand.

## Overengineering css can be good actually

I know, it sounds counterintuitive, but hear me out. There are a lot of benefits to overengineering css, especially when it comes to building responsive layouts without media queries. take the shell component for example. it is designed to be a flexible layout component that can adapt to different screen sizes and configurations without the need for media queries. this is achieved through the use of CSS custom properties, utility classes, and a bit of `Maths™`.

### What about your teammates?

Well here is the neat part, you do not have to worry about that, when overengineering css, It is basically reccomended to use custom properties to control the layout and provide some basic settings for the layout. this means that your teammates do not have to understand the inner workings of the layout to be able to use it effectively. they can just use the provided custom properties and utility classes to achieve the desired layout without having to worry about the underlying implementation. this makes it easier for teammates to work with the layout and reduces the learning curve for new team members.

In fact i have been doing it at my job for a while now and it has been working great.
