<script lang="ts">
</script>

<div class="switch">
	<input type="checkbox" />
	<div class="switch-thumb"></div>
</div>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.switch {
		--switch-width: 2.5em;
		--switch-height: 1.25em;
		--switch-border-radius: 2px;
		--switch-border-color: #{$clr-surface-100};
		--switch-background-color: #{$clr-surface-000};

		--switch-thumb-offset-sides: 2px;
		--switch-thumb-color: #{$clr-surface-100};
		--switch-thumb-border-color: #{$clr-surface-200};
		--switch-thumb-decor-color: #{$clr-surface-200};

		--switch-thumb-decor-width: 7px;
		--switch-thumb-decor-height: 2px;

		--_switch-thumb-size: calc(var(--switch-height) - var(--switch-thumb-offset-sides) * 2);
		anchor-scope: --switch;
		width: fit-content;
		container-type: inline-size;
	}

	input[type='checkbox'] {
		appearance: none;
		anchor-name: --switch;

		width: var(--switch-width);
		height: var(--switch-height);
		border: 1px solid var(--switch-border-color);
		background-color: var(--switch-background-color);
		border-radius: var(--switch-border-radius);
	}

	@property --switch-checked-background-position {
		syntax: '<length> | <percentage>';
		initial-value: 0cqi;
		inherits: false;
	}

	input[type='checkbox']:checked {
		background-image: radial-gradient(
			circle,
			$clr-brand-400 33%,
			$clr-brand-500 33% 66%,
			$clr-brand-600 66% 100%
		);
		animation: switch-checked 0.4s forwards ease-in;
		background-repeat: no-repeat;
		background-position: center;
		// background-position: var(--switch-checked-background-position);
		background-size: var(--switch-checked-background-position);
	}

	@keyframes switch-checked {
		to {
			--switch-checked-background-position: 100cqi;
		}
	}

	input[type='checkbox']:checked ~ .switch-thumb {
		--switch-thumb-color: #{$clr-surface-100};
		--switch-thumb-border-color: #{$clr-surface-200};
		inset-inline-start: calc(
			var(--switch-width) - (var(--_switch-thumb-size) / 2) + var(--switch-thumb-offset-sides) * 2
		);
	}

	.switch-thumb {
		position: absolute;
		background-color: var(--switch-thumb-color);
		border: 1px solid var(--switch-thumb-border-color);
		position-anchor: --switch;
		top: calc(anchor(top) + var(--switch-thumb-offset-sides));
		inset-inline-start: var(--_switch-thumb-size);
		width: var(--_switch-thumb-size);
		interpolate-size: allow-keywords;
		transition: inset-inline-start 0.2s ease-in-out;
		aspect-ratio: 1/1;
		pointer-events: none;

		&::after {
			content: '';
			position: absolute;
			inset: calc(var(--switch-thumb-decor-height)) calc(var(--switch-thumb-decor-width));
			background-color: var(--switch-thumb-decor-color);
		}
	}
</style>
