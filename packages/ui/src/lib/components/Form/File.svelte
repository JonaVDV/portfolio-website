<script lang="ts">
	let { ...rest } = $props();
</script>

<input type="file" {...rest} />

<style>
	input[type='file'] {
		border: 3px dashed;

		border-color: var(--clr-brand-400);
		stroke-dashoffset: 5px;
		text-align: center;

		&:hover {
			border-color: var(--clr-brand-500);
		}
	}
</style>
