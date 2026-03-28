import IconsRolldown from 'unplugin-icons/rolldown';
import IconsVite from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import { defineConfig } from 'vite-plus';

const iconsOptions = {
	compiler: 'svelte',
	customCollections: {
		portfolio: FileSystemIconLoader('./src/icons/')
	}
} satisfies Parameters<typeof IconsVite>[0];

export default defineConfig({
	// plugins: [IconsVite(iconsOptions)],
	pack: {
		exports: true,
		plugins: [IconsRolldown(iconsOptions)]
	}
});
