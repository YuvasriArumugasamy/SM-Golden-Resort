import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    // Minify aggressively
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,      // remove console.log in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.warn"],
      },
    },
    rollupOptions: {
      output: {
        // Better code splitting — admin pages lazy loaded
        manualChunks(id) {
          // Core React
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router-dom/")) {
            return "vendor-react";
          }
          // Framer Motion
          if (id.includes("node_modules/framer-motion/")) {
            return "vendor-motion";
          }
          // Charts (recharts) — admin only
          if (id.includes("node_modules/recharts/") || id.includes("node_modules/d3-")) {
            return "vendor-charts";
          }
          // PDF generation — lazy, only on booking confirmation
          if (id.includes("node_modules/html2pdf") || id.includes("node_modules/jspdf") || id.includes("node_modules/html2canvas")) {
            return "html2pdf";
          }
          // Firebase — separate chunk, lazy loaded
          if (id.includes("node_modules/firebase/")) {
            return "vendor-firebase";
          }
          // Admin pages — separate chunk
          if (id.includes("/pages/admin/")) {
            return "admin-pages";
          }
          // Date picker
          if (id.includes("node_modules/react-datepicker/")) {
            return "vendor-datepicker";
          }
          // Lucide icons
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-icons";
          }
        },
        // Better cache busting
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
});
