import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Base dinamica per GitHub Pages:
// - in locale: '/'
// - su GitHub Actions: '/nome-repo/'
// - con dominio custom: imposta BASE_PATH=/ nel workflow o nel terminale
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.BASE_PATH || (repositoryName ? `/${repositoryName}/` : '/')

export default defineConfig({
  plugins: [vue()],
  base: '/nereto-beer-festival-menu/'
})
