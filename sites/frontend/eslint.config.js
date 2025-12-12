import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import svelte from '@jvdv-portfolio/eslint-config/svelte';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(includeIgnoreFile(gitignorePath), ...svelte);
