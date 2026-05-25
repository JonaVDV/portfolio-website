import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import browerslist from 'browserslist';
import icons from 'unplugin-icons/vite';
import { browserslistToTargets, Features, type PseudoClasses } from 'lightningcss';

let targets = browserslistToTargets(browerslist('> 0.25%, not dead'));

export default defineConfig({
	plugins: [
		sveltekit(),
		icons({
			compiler: 'svelte'
		})
	],

	css: {
		// transformer: 'lightningcss',
		// lightningcss: {
		// 	drafts: {
		// 		customMedia: true,
		// 	},
		// 	targets,
		// 	// ignore svelte :global pseudo selector
		// 	pseudoClasses: {} satisfies PseudoClasses
		// }
	},
	optimizeDeps: {
		include: ['@oddbird/css-anchor-positioning']
	}
});
