import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './',
    server: {
      host: "::",
      port: 8080,
      fs: {
        strict: false
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 8080
      },
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
      }
    },
    plugins: [
      react(),
      mode === "development" && componentTagger()
    ].filter(Boolean),
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['@tanstack/react-query']
          }
        }
      }
    }
  };
});
