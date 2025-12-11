import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Prefer VITE_API_KEY (standard), fallback to API_KEY, or empty string.
  const apiKey = env.VITE_API_KEY || env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY. We ensure it's a string.
      // We do not stringify inside the value to avoid double quoting if the user added quotes in .env
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});