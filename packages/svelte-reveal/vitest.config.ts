import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const internal = fileURLToPath(new URL('./src/internal', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@/types': `${internal}/types`,
      '@/styling': `${internal}/styling`,
      '@/default': `${internal}/default`,
      '@': internal
    }
  }
});
