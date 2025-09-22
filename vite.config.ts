import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
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
        ...(mode === 'production' ? {
          'Content-Security-Policy': [
            `default-src 'self'`,
            `base-uri 'self'`,
            `connect-src 'self' https://lead-three-pi.vercel.app https://omkarpp.app.n8n.cloud`,
            `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
            `style-src 'self' 'unsafe-inline'`,
            `img-src 'self' data: https:`,
            `font-src 'self' data:`,
            `frame-src 'self'`,
            `media-src 'self'`,
            `object-src 'none'`,
            `worker-src 'self' blob:`
          ].join('; ')
        } : {
          'Content-Security-Policy-Report-Only': [
            `default-src 'self'`,
            `connect-src 'self' ws://localhost:8080 http://localhost:8080`,
            `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
            `style-src 'self' 'unsafe-inline'`,
            `img-src 'self' data: https:`,
            `font-src 'self' data:`,
            `frame-src 'self'`,
            `media-src 'self'`,
            `object-src 'none'`,
            `worker-src 'self' blob:`
          ].join('; ')
        })
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
      // Use default React plugin with automatic JSX runtime
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            csp: mode === 'production' ? `
              <meta http-equiv="Content-Security-Policy" content="
                default-src 'self';
                base-uri 'self';
                connect-src 'self' https://lead-three-pi.vercel.app https://omkarpp.app.n8n.cloud;
                script-src 'self' 'unsafe-inline' 'unsafe-eval';
                script-src-attr 'none';
                style-src 'self' 'unsafe-inline';
                img-src 'self' data: https:;
                font-src 'self' data:;
                frame-src 'self';
                media-src 'self';
                object-src 'none';
                worker-src 'self' blob:;
              ">
            `.replace(/\s+/g, ' ').trim() : ''
          }
        },
        template: 'index.html',
      }),
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
      rollupOptions: {
        output: {
          // Let Vite handle chunking automatically
          manualChunks: undefined,
        },
      },
      // Enable dynamic imports for better code splitting
      dynamicImportVarsOptions: {
        exclude: []
      }
    },
  };
});
