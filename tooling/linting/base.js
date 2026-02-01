import ts from "typescript-eslint";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import globals from "globals";

export const baseConfig = defineConfig(
  includeIgnoreFile(path.join(import.meta.dirname, "../../.gitignore")),
  {
    ignores: ["**/*.config.*"],
  },
  {
    files: ["**/*.ts", "**/*.js"],
    rules: {
      // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
      // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-misused-promises": [
        2,
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
    },
    extends: [
      js.configs.recommended,
      ...ts.configs.recommended,
      ...ts.configs.recommendedTypeChecked,
      ...ts.configs.stylisticTypeChecked,
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
