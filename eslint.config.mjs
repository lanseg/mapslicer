// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended
    ],
    files: ["src/**/*.{js,mjs,cjs,ts,mts,jsx,tsx}"],
    rules: {
      "sort-imports": ["error", {
        "ignoreCase": false,
        "ignoreDeclarationSort": false,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
        "allowSeparatedGroups": true
      }],
    },
  },
);