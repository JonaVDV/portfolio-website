import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import browerslist from 'browserslist';
import { browserslistToTargets, Features, type PseudoClasses } from 'lightningcss';

let targets = browserslistToTargets(browerslist('> 0.25%, not dead'));

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		transformer: 'lightningcss',

		lightningcss: {
			drafts: {
				customMedia: true
			},

			targets,
			// ignore svelte :global pseudo selector
			pseudoClasses: {} satisfies PseudoClasses
		}
	},
	build: {
		cssMinify: 'lightningcss'
	},
	optimizeDeps: {
		include: ['@oddbird/css-anchor-positioning']
	}
});
