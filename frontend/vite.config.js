import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true, // Listen on all addresses
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
    },
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            // Suppress connection refused errors - they're handled by the client
            if (err.code === 'ECONNREFUSED') {
              console.warn('⚠️ Backend server not running. Some API calls may fail.');
              // Don't log the full error stack for connection refused
              return;
            }
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Optional: Log proxy requests in development
            if (process.env.NODE_ENV === 'development') {
              console.log(`🔄 Proxying ${req.method} ${req.url} to backend`);
            }
          });
        },
      },
    },
  },
  optimizeDeps: {
    exclude: [],
  },
});
