/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import * as path from 'path';

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'dist/*',
                    dest: path.join(__dirname, '../dist/client')
                }
            ]
        })
    ],
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