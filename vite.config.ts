import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is '/assumption-inspector/' for the GitHub Pages backup deploy,
// and '/' for local dev. See .github/workflows/deploy.yml.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/assumption-inspector/' : '/',
}))
