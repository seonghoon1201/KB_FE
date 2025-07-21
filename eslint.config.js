import js from "@eslint/js";
import globals from "globals";
import vuePlugin from "eslint-plugin-vue";
import jsonPlugin from "@eslint-community/eslint-plugin-jsonc";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // JS & Vue
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...vuePlugin.configs["flat/recommended"].rules,
      "prettier/prettier": "warn", // prettier 형식 위반 시 경고
    },
  },

  // JSON
  {
    files: ["**/*.json"],
    plugins: {
      json: jsonPlugin,
    },
    languageOptions: {
      parser: jsonPlugin.parsers.json,
    },
    rules: jsonPlugin.configs["recommended"].rules,
  },

  // prettier 설정 무시 규칙 세트 적용 (Vue 룰과 충돌 방지)
  prettierConfig,
]);
