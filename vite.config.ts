import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        importers: [
          {
            findFileUrl(url: string, context: any) {
              // Handle relative paths like '../../../scss/spaces'
              if (url.includes('/scss/')) {
                const fileName = url.split('/scss/')[1];
                const scssPath = path.resolve(__dirname, 'scss', `_${fileName}.scss`);
                return new URL(`file://${scssPath}`);
              }
              // Handle non-relative paths
              if (!url.startsWith('~') && !url.startsWith('.')) {
                const scssPath = path.resolve(__dirname, 'scss', `_${url}.scss`);
                return new URL(`file://${scssPath}`);
              }
              return null;
            }
          }
        ],
      },
    },
  },
}));
