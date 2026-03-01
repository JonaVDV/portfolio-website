<script lang="ts">
</script>

<input type="range" name="" id="" />

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	input[type='range'] {
		appearance: none;
		container-type: inline-size;
		--range-slider-height: 12px;
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

	input[type='range']::-moz-range-progress,
	input[type='range']::-webkit-slider-runnable-track {
		height: var(--range-slider-height);
		width: 100cqi;
		background: linear-gradient(
			45deg,
			$clr-brand-400 33%,
			$clr-brand-500 33% 66%,
			$clr-brand-600 66% 100%
		);
	}

	input[type='range']::-webkit-slider-runnable-track,
	input[type='range']::-moz-range-track {
		appearance: none;
		outline: 3px solid $clr-brand-500;
		height: var(--range-slider-height);
		outline-offset: 2px;
		border-radius: 4px;
	}
</style>
