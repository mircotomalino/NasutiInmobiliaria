import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // Configuración para manejar rutas de SPA en desarrollo
    historyApiFallback: true,
    // Proxy para servir imágenes desde el backend
    proxy: {
      "/uploads": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Reducir tamaño para producción
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Configuración para manejar rutas
  base: "/",
  // Configuración para el servidor de desarrollo
  preview: {
    port: 3000,
  },
});
