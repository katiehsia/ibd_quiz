import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ibd-quiz/',  // 👈 your repo name here (with slashes)
})
