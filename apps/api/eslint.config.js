import { config as baseConfig } from "@repo/eslint-config/base";
import globals from "globals";

/**
 * ESLint configuration for the Hono API service.
 *
 * Extends the repo base config, adds Node.js globals, and whitelists the env
 * vars this service reads so the turbo rule doesn't complain about them.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    rules: {
      "turbo/no-undeclared-env-vars": [
        "warn",
        { allowList: ["^(PORT|NODE_ENV|DATABASE_URL)$"] },
      ],
    },
  },
  {
    ignores: ["dist/**", "coverage/**", "src/generated/**"],
  },
];