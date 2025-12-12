import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";
import { baseConfig } from "./base.js";

export const svelteEslintConfig = defineConfig(
  ...baseConfig,
  svelte.configs.recommended,
  prettier,
  ...svelte.configs.prettier,
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
      },
    },
  },
);

export default svelteEslintConfig;
