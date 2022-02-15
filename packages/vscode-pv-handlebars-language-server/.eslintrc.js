/**@type {import('eslint').Linter.Config} */
// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parserOptions: {
    project: ["./tsconfig.json", "./server/tsconfig.json", "./client/tsconfig.json"],
  },
  extends: [
    // "pv/typescript",
    "pv/prettier",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
  },
};
