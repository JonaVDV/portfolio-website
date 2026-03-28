import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import svelte from 'eslint-plugin-svelte';
import oxlint from 'eslint-plugin-oxlint';
import ts from 'typescript-eslint';

const svelteConfig = await import(fileURLToPath(new URL('./svelte.config.js', import.meta.url)));

const gitignorePath = fileURLToPath(new URL('../../.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	// Disable ESLint rules already covered by oxlint
	...oxlint.configs['flat/all'],
	// Svelte template rules (no oxlint equivalent yet)
	svelte.configs.recommended,
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);
