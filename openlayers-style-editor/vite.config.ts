import {defineConfig, UserConfig} from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import {fileURLToPath} from "node:url";
import {ModuleFormat} from "node:module";
import * as path from "node:path";

export default defineConfig(({command}) => {
    if (command === 'serve') {
        // Dev config
        return {
            plugins: [react()],
            server: {
                watch: {
                    usePolling: true
                }
            },
            resolve: {
                alias: {
                    "@": fileURLToPath(new URL('./src', import.meta.url)),
                },
            },
        } as UserConfig;
    } else {
        // Build config
        return {
            plugins: [
                react(),
                dts({
                    include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.d.ts'],
                    insertTypesEntry: true,
                }),
            ],
            build: {
                lib: {
                    entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
                    name: 'OpenLayers Style Editor',
                    fileName: (format: string) => `index.${format}.js`,
                    formats: ['es', 'umd'],
                },
                rollupOptions: {
                    external: ['react', 'react-dom'],
                    output: {
                        globals: {
                            react: 'React',
                            'react-dom': 'ReactDOM',
                        },
                        assetFileNames: (assetInfo) => {
                            if (assetInfo.name === 'style.css' || assetInfo.name?.endsWith('.css')) 
                                return 'openlayers-style-editor.css';
                            return assetInfo.name || '';
                        },
                    },
                },
                cssCodeSplit: false,
                ssr: true,
                ssrEmitAssets: true
            },
            resolve: {
                alias: {
                    "@": fileURLToPath(new URL('./src', import.meta.url)),
                },
            },
        } as UserConfig
    }
})