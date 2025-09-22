import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: '/',
    esbuild: {
      target: 'es2020',
      supported: { 
        'top-level-await': true
      },
      jsx: 'automatic'
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
        supported: { 
          'top-level-await': true,
          'dynamic-import': true
        },
        // Ensure proper JSX handling
        jsx: 'automatic'
      },
      // Force dependency pre-bundling
      include: ['react', 'react-dom', 'react-router-dom']
    },
    server: {
      host: "::",
      port: 8080,
      strictPort: true,
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
        'Content-Security-Policy': [
          "default-src 'self';",
          `connect-src 'self' ${process.env.DEV ? 'ws://localhost:8080 ' : ''}https://lead-three-pi.vercel.app https://omkarpp.app.n8n.cloud`,
          "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
          "style-src 'self' 'unsafe-inline';",
          "img-src 'self' data: https:;",
          "font-src 'self';",
          "frame-src 'self';",
          "media-src 'self'"
        ].join(' ')
      },
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
      },
      // Ensure proper extension resolution
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      manifest: true,
      minify: 'esbuild',
      modulePreload: {
        polyfill: true
      },
      commonjsOptions: {
        transformMixedEsModules: true,
        esmExternals: true
      },
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        external: ['react', 'react-dom'],
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
