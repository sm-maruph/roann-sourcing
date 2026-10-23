import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  server: { proxy: { '/api': 'http://127.0.0.1:4000', '/media': 'http://127.0.0.1:4000' } },
  resolve: { alias: { '@roann/i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)) } },
  optimizeDeps: { exclude: ['@roann/i18n/jsx-runtime', '@roann/i18n/jsx-dev-runtime'] },
  build: { rollupOptions: { output: { manualChunks(id) {
    if (/\/i18n\/(es|ja|de)\.json$/.test(id)) return 'translations';
  } } } },
  plugins: [react({ jsxImportSource: '@roann/i18n' }), {
    name: 'local-translation-runtime',
    configResolved(config) {
      // Local runtimes must share the app's language store, rather than bundle a copy.
      config.optimizeDeps.include = config.optimizeDeps.include?.filter(id => !id.startsWith('@roann/i18n'));
    },
  }],
});
