/** @type {import("eslint").Linter.FlatConfig} */
module.exports = [
  {
    ignores: ["dist/**", "**/*.min.js", "**/test*.html", "**/demo*.html"],
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Browser globals
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

        // Audio API globals
        Audio: "readonly",
        AudioContext: "readonly",
        webkitAudioContext: "readonly",

        // Browser function globals
        alert: "readonly",

        // Node.js globals (for testing)
        global: "readonly",
        module: "readonly",
        exports: "readonly",
        require: "readonly",
      },
    },
    rules: {
      camelcase: ["warn", { properties: "never" }],
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
