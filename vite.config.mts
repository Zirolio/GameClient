/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';

import fs from 'node:fs';

const addErudaShell = createHtmlPlugin({
    inject: {
        tags: [
            { tag: 'script', attrs: { src: '/.eruda.js', onload: 'window.eruda.init();' }, injectTo: 'head' }
        ]
    }
});

export default defineConfig({
    server: { port: 3000 },
    plugins: [
        tsconfigPaths(),
        fs.existsSync('./public/.eruda.js') && addErudaShell
    ]
});
