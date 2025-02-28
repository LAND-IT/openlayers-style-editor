import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import {fileURLToPath} from "node:url";
import {ModuleFormat} from "node:module";

export default defineConfig(({command}) => {
    if (command === 'serve') {
        // Dev config
        return {
            plugins: [react()],
            server: {
                watch: {
                    usePolling: true
                }
            }
        };
    } else {
        // Build config
        return {
            plugins: [
                react(),
                dts({
                    include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.d.ts'],
                    insertTypesEntry: true,
                }),
                cssInjectedByJsPlugin()
            ],
            build: {
                lib: {
                    entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
                        // fileURLToPath(new URL('./src/rendererUtils.ts', import.meta.url))],
                    name: 'OpenLayers Style Editor',
                    fileName: (format: ModuleFormat, entryName: string) => `${entryName}.${format}.js`,
                },
                rollupOptions: {
                    external: ['react', 'react-dom', 'ol'],
                    output: {
                        format: ["es", "umd"],
                        globals: {
                            react: 'React',
                            'react-dom': 'ReactDOM',
                        },
                    },
                },
                cssCodeSplit: false,
                ssr: true
            },
        }
    }
})