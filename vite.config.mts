/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';

const addErudaShell = createHtmlPlugin({
    inject: {
        tags: [
            { tag: 'script', attrs: { src: '/.eruda.js', onload: 'window.eruda.init();' }, injectTo: 'head' }
        ]
    }
});

export default defineConfig(({ mode }) => ({
    server: { port: 3000 },
    plugins: [
        tsconfigPaths(),
        mode == 'development' ? addErudaShell : undefined
    ]
}));
