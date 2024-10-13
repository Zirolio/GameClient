/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [],
    build: {
        assetsInlineLimit: 0,
        outDir: 'dist',
        assetsDir: '.',
        emptyOutDir: false,
        rollupOptions: {
            input: {
                main: 'src/main.ts'
            },
            output: {
                entryFileNames: 'main.js'
            }
        }
    }
});