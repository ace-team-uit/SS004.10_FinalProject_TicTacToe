/** @type {import("eslint").Linter.FlatConfig} */
module.exports = [
  {
    ignores: ["dist/**", "**/*.min.js"],
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        location: "readonly",
        Navigation: "readonly",
        Components: "readonly",
        ASSETS: "readonly",
        loadScreen: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
      },
    },
    rules: {
      camelcase: ["warn", { properties: "never" }],
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
