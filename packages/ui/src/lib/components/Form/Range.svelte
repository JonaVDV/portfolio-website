<script lang="ts">
</script>

<input type="range" name="" id="" />

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	input[type='range'] {
		appearance: none;
		// add $clr-brand-500 to the gradient and make it so it is not smooth
	}

	input[type='range']::-webkit-slider-thumb,
	input[type='range']::-moz-range-thumb {
		appearance: none;
		border-radius: 0;
		width: 16px;
		height: 24px;
		border: 1px solid $clr-surface-300;
		background-color: $clr-brand-100;
	}

	input[type='range']::-webkit-slider-runnable-track,
	input[type='range']::-moz-range-track {
		appearance: none;
		height: 12px;
		outline: 3px solid $clr-brand-500;
		outline-offset: 2px;
		border-radius: 4px;
		background: linear-gradient(
			45deg,
			$clr-brand-400 33%,
			$clr-brand-500 33% 66%,
			$clr-brand-600 66% 100%
		);
	}
</style>
