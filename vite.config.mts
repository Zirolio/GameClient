/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    server: { port: 3000 },
    plugins: [tsconfigPaths()]
});
