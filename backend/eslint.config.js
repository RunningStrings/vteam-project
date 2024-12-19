import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
   {
       rules: {
           "no-unused-vars": "warn",
           "no-undef": "warn",
        //    "semi": ["error", "always"],
        //    "eqeqeq": ["error", "always"],
        //    "no-console": "warn",
        //    "quotes": ["error", "double"],
        //    "curly": ["error", "all"],
        //    "consistent-return": "error",
        //    "prefer-const": "error",
       },
       languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            }
        }
   }
];
