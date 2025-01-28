import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        rules: {
            // Consistent Formatting
            "semi": ["warn", "always"],
            "quotes": ["warn", "double"],
            "indent": ["warn", 4],
            // Error Prevention
            "eqeqeq": ["warn", "always"],
            "no-unused-vars": "warn",
            "no-undef": "warn",
            // // Code Quality
            // // "no-console": "warn",
            "curly": ["warn", "all"],
            "consistent-return": "warn",
            "prefer-const": "warn",
            "complexity": ["error", { "max": 15 }],
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            }
        }
    }
];