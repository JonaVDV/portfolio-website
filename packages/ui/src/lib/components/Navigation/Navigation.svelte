<script lang="ts">
	import Button from '$components/Button/Button.svelte';
	import Submenu from './Submenu.svelte';
</script>

<header>
	<nav class="primary-navigation">
		<ul role="list" class="navigation-list | flex-group">
			<li><a href="#link-1">Link 1</a></li>
			<li><a href="#link-2">Link 2</a></li>
			<li><a href="#link-3">Link 3</a></li>
			<li>
				<Submenu>
					{#snippet trigger(id)}
						<Button class="submenu-trigger" variant="stripped" popovertarget={id}>submenu</Button>
					{/snippet}
					<ul role="list">
						<li><a href="#sublink-1">Sublink 1</a></li>
						<li><a href="#sublink-2">Sublink 2</a></li>
						<li><a href="#sublink-3">Sublink 3</a></li>
					</ul>
				</Submenu>
			</li>
		</ul>
	</nav>
</header>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.primary-navigation {
	}

	header {
		background-color: $clr-brand-200;
	}

	.navigation-submenu {
		/* in default position (above anchor) the tether arrows on left, top, and right
   are hidden because we are clipping based on the margin. */
		/* NOTE: the inset here is optional, just a little offest so the arrow
   doesn't touch the anchor*/

		/* clip-path: inset(var(--arrow-offset)) margin-box;

		&::before {
			content: '';
			position: absolute;
			z-index: -1;
			inset: calc(-1 * var(--arrow-size)) calc(50% - var(--arrow-size));
			clip-path: polygon(
				0 var(--arrow-size),
				50% 0,
				100% var(--arrow-size),
				100% calc(100% - var(--arrow-size)),
				50% 100%,
				0 calc(100% - var(--arrow-size))
			);
			background: inherit;
		} */
	}
</style>
