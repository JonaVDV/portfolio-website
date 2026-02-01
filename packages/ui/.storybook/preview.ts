import type { Preview } from '@storybook/sveltekit';
import '../src/lib/styles/main.scss';

import polyfill from '@oddbird/css-anchor-positioning/fn';

// Initialize anchor positioning polyfill for Storybook

const preview: Preview = {
	beforeEach: () => {
		if (typeof window !== 'undefined' && !('anchorName' in document.documentElement.style)) {
			polyfill();
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
