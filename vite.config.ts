import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig(({ command, mode }) => {
    if (command === 'serve') {
        // Dev config
        return {
            plugins: [react()],
            root: path.resolve(__dirname, 'dev'),
            build: {
                outDir: path.resolve(__dirname, 'dist'),
            },
        };
    } else {
        // Build config
        return {
            plugins: [react(), dts()],
            build: {
                lib: {
                    entry: path.resolve(__dirname, 'src/index.ts'),
                    name: 'OpenLayers Style Editor',
                    fileName: 'openlayers-style-editor',
                },
                rollupOptions: {
                    external: ['react', 'react-dom'],
                    output: {
                        globals: {
                            react: 'React',
                            'react-dom': 'ReactDOM'
                        }
                    }
                }
            }
        };
    }
});