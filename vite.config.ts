import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/leads': {
        target: 'https://omkarpp.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => {
          console.log('Proxying request to n8n webhook');
          return path.replace(/^\/api\/leads/, '/webhook/a209c902-a436-48b5-bcdd-1ae79ae1a99b');
        },
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending request to:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received response with status:', proxyRes.statusCode);
          });
        }
      }
    },
    cors: true
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
