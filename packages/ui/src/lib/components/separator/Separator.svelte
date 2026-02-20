<script lang="ts">
	interface Props {
		orientation?: 'horizontal' | 'vertical';
		'--separator-margin'?: string;
		'--separator-color'?: string;
		'--separator-thickness'?: string;
	}

	let { orientation = 'horizontal' }: Props = $props();
</script>

<!-- 
	@component Separator
	
	A simple separator component that can be used to separate content. It can be used in both horizontal and vertical orientations. The appearance of the separator can be customized using CSS variables.
-->

<hr aria-orientation={orientation} data-orientation={orientation} />

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	hr {
		margin-block: var(--separator-margin);
		border: none;
		border-block-start: var(--separator-thickness, 1px) solid
			var(--separator-color, $clr-surface-600);
	}

	hr[data-orientation='vertical'] {
		writing-mode: vertical-rl;
		// This is a fix to make sure that the seperator stretches to the full height of its container.
		//  This will eventually be replaced with height: stretch; once that is supported in all browsers.
		height: 100%;
	}
</style>
