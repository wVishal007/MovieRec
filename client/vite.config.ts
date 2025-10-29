import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",        // listen on all IPv6 and IPv4
    port: 8080,        // Vite dev server port
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development
    configureServer(viteServer) {
      const app = createServer();

      // Wrap Express as Connect middleware for Vite
      // Use proper catch-all route
      app.all("/*", (req, res, next) => {
        next(); // let Vite handle SPA routes if needed
      });

      viteServer.middlewares.use(app);
    },
  };
}
