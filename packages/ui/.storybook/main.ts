import { mergeConfig } from 'vite-plus';
import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-svelte-csf',
		'@storybook/addon-docs',
		'@storybook/addon-a11y',
		'@storybook/addon-vitest'
	],
	staticDirs: ['../static'],
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	},
	viteFinal: async (config) => {
		return mergeConfig(config, {
			// Vite 8's Rolldown dep scanner can't resolve relative imports from
			// Storybook's virtual modules (PreviewRender.svelte -> ./DecoratorHandler.svelte).
			// Setting entries:[] disables the upfront scan; deps are optimized on-demand instead.
			optimizeDeps: { entries: [] }
		});
	}
};
export default config;
