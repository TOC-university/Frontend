import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['toc-university.member.ce-nacl.com', 'toc-university.nmasang.member.ce-nacl.com']
  }
})
