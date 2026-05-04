import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5174,
        strictPort: true,
        origin: 'http://localhost:5174',
        watch: {
            usePolling: true,
            interval: 1000,
        },
        cors: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        hmr: {
            host: 'localhost',
            protocol: 'ws',
            port: 5174,
        },
    },
});
