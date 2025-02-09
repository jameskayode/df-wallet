import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" }
  },
  {
    languageOptions: { globals: globals.node } 
  },
  pluginJs.configs.recommended,
  {
    env: {
      node: true,  
      es6: true
    },
    rules: {
     
    }
  }
];
