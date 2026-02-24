import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite'; // Removed loadEnv

export default defineConfig(({mode}) => {
  return {
    base: '/crossclimb-unlimited/', // MAKE SURE THIS MATCHES YOUR REPO NAME
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // Server block can stay or go, it doesn't affect the production build
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});