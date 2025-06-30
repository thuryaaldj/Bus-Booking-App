import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // ← مهم عشان نستخدم path.resolve

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ← هذا هو alias المطلوب

    },
  },
})

