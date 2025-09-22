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
      '/api': {
        target: 'https://omkarpp.app.n8n.cloud',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log('Proxying request to n8n webhook:', path);
          // Map /api/leads to the n8n webhook
          if (path.startsWith('/api/leads')) {
            return '/webhook/a209c902-a436-48b5-bcdd-1ae79ae1a99b';
          }
          return path;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
            if (!res.headersSent) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
            }
            res.end(JSON.stringify({ error: 'Proxy error', details: err.message }));
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request to:', req.url);
            proxyReq.setHeader('Accept', 'application/json');
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
