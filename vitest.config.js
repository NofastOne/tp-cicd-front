import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ← permet d’utiliser @/ pour src/
    },
  },
  test: {
    globals: true, // Permet d’utiliser describe/it/expect sans les importer
    environment: 'jsdom', // Crucial pour les composants utilisant document/window
    setupFiles: './src/__tests__/vitest.setup.ts', // Optionnel : setup global
    include: ['src/__tests__/**/*.spec.ts'], // Où chercher les tests
    clearMocks: true, // Réinitialise les mocks entre tests
    coverage: {
      provider: 'c8', // Génération de couverture
      reporter: ['text', 'lcov'],
    },
  },
});
