// @ts-nocheck
import { defineConfig } from 'vitest/config'
import { svelteTesting } from '@testing-library/svelte/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const config = {
    plugins: [sveltekit()],

    test: {
      projects: [
        {
          extends: true,
          plugins: [svelteTesting()],
          test: {
            name: 'client',
            environment: 'jsdom',
            clearMocks: true,
            include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
            exclude: ['src/lib/server/**'],
            setupFiles: ['./vitest-setup-client.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'server',
            environment: 'node',
            include: ['src/**/*.{test,spec}.{js,ts}'],
            exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          },
        },
      ],
    },
  }

  if (env.BACKEND_URL) {
    config.server = {
      proxy: {
        '/api': {
          target: env.BACKEND_URL,
          changeOrigin: true,
        },
      },
    }
  }

  return config
})
