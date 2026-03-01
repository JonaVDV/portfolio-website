import type { Preview } from '@storybook/sveltekit';
import '../src/lib/styles/main.scss';

import polyfill from '@oddbird/css-anchor-positioning/fn';

// Initialize anchor positioning polyfill for Storybook

const preview: Preview = {
	beforeEach: async () => {
		if (!('anchorName' in document.documentElement.style)) {
			console.log('It seems anchor positioning is not supported here :( Loading polyfill...');
			polyfill().then(() => {
				console.log('Anchor positioning polyfill loaded!');
			});
		} else {
			console.log('Anchor positioning is supported! 🎉');
		}
	},
	parameters: {
		layout: 'fullscreen',
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo'
		}
	}
};

export default preview;
