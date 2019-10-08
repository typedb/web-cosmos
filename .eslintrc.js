module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    "@nuxtjs",
    "plugin:nuxt/recommended",
    "@nuxtjs/eslint-config-typescript",
    "plugin:vue/recommended",
    "eslint:recommended",
    "prettier/vue",
    "plugin:prettier/recommended"
  ],
  // add your custom rules here
  rules: {
    "nuxt/no-cjs-in-config": "off",
    semi: ["error", "always"],
    quotes: ["error", "double"]
  }
};
