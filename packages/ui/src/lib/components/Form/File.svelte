<script lang="ts">
	let { ...rest } = $props();
</script>

<input type="file" {...rest} />

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	input[type='file'] {
		border: 3px dashed;

		border-color: $clr-brand-400;
		stroke-dashoffset: 5px;
		text-align: center;

		> :global(label) {
			display: none;
			color: transparent;
		}

		&:hover {
			border-color: $clr-brand-500;
		}
	}
</style>
