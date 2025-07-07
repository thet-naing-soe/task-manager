module.exports = {
  // TypeScript files
  '**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],

  // JavaScript files
  '**/*.{js,jsx}': ['eslint --fix', 'prettier --write'],

  // JSON, CSS, MD files
  '**/*.{json,css,md}': ['prettier --write'],

  // Prisma files
  '**/*.prisma': ['prettier --write'],
};
