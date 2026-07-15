import { FlatCompat } from '@eslint/eslintrc';

// eslint-config-next ainda é eslintrc; o FlatCompat traduz pro flat config do
// ESLint 9. Quando o Next publicar flat config nativo, isso vira um import só.
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default config;
