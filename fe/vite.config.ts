import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import legacy from "@vitejs/plugin-legacy";
import deno from "@deno/vite-plugin";

const API_ORIGIN = process.env.API_ORIGIN || "http://localhost:3000";
const buildTime = Date.now();

export default defineConfig({
  root: import.meta.dirname,
  server: {
    proxy: {
      "/api/": {
        target: API_ORIGIN,
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    __APP_BUILD_TIME: JSON.stringify(buildTime),
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: false,
      addExtensions: true,
    }),
    react(),
    deno(),
    legacy({
      renderLegacyChunks: false,
      polyfills: false,

      renderModernChunks: true,
      modernPolyfills: true,
      modernTargets: "defaults",
    }),
  ],
  build: {
    manifest: true,
    minify: true,
    sourcemap: true,
    rolldownOptions: {
      output: {
        codeSplitting: {},
      },
    },
  },
});
