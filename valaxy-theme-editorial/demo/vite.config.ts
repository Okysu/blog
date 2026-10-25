import process from 'node:process'
import { defineConfig } from 'vite'

// BASE_URL=/journal/ pnpm build:demo (PowerShell: $env:BASE_URL='/journal/')
export default defineConfig({ base: process.env.BASE_URL || '/' })
