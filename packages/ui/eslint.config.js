// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'eslint/config';
import { svelteEslintConfig } from '@jvdv-portfolio/eslint-config/svelte';

export default defineConfig(...svelteEslintConfig);
