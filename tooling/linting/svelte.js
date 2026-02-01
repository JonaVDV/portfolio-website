import prettier from "eslint-config-prettier";
import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import { defineConfig } from "eslint/config";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";
import { baseConfig } from "./base.js";

const svelteConfig = await import(
  fileURLToPath(new URL("./svelte.config.js", import.meta.url))
);

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export const svelteEslintConfig = defineConfig(
  includeIgnoreFile(gitignorePath),
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
        svelteConfig,
      },
    },
  },
);
