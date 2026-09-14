import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    plugins: { "@stylistic": stylistic },
    rules: {
      curly: ["error", "all"],
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: ["const", "let"], next: "*" },
        { blankLine: "any", prev: ["const", "let"], next: ["const", "let"] },
        { blankLine: "always", prev: "*", next: ["return", "throw", "function"] },
        { blankLine: "always", prev: "block-like", next: "*" },
        { blankLine: "always", prev: "*", next: "block-like" },
        { blankLine: "always", prev: "export", next: "export" },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "next-env.d.ts", "playwright-report/**", "test-results/**"]),
]);
