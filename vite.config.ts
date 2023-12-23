import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts({
            entryRoot: './lib',
            include: './lib',
            tsconfigPath: './tsconfig.json',
        }) as any,
        visualizer(),
    ],
    build: {
        lib: {
            entry: './lib/index.ts',
            name: pkg.name,
            fileName: pkg.name,
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: Object.keys(pkg.devDependencies),
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                @import './node_modules/bem2/dist/bem.scss';
                `,
            },
        },
    },
});
