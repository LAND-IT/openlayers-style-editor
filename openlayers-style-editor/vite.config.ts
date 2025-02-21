import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

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
                },
                cssCodeSplit: false
            },
        };
    }
})