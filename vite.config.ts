import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Opciones del servidor
  clearScreen: false, // 1. Evita que Vite oculte los errores de Rust
  server: {
    host: "127.0.0.1", // Cambiar a 127.0.0.1
    port: 5500,        // Cambiar al puerto 5500
    strictPort: true,  // Falla si el puerto no está disponible
    hmr: {
      protocol: "ws",
      host: "127.0.0.1", // Asegura que HMR use 127.0.0.1
      port: 5501,        // Puerto diferente para WebSocket
    },
    watch: {
      ignored: ["**/src-tauri/**"], // Ignorar cambios en `src-tauri`
    },
  },
}));
