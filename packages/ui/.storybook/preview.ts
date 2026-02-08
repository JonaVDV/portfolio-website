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
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	}
};

export default preview;
