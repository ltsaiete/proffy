import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    projects: [
      {
        plugins: [tsConfigPaths()],
        test: {
          name: 'unit',
          include: ['src/**/*.spec.ts', '!src/http/controllers/**/*.spec.ts'],
        },
      },
      {
        plugins: [tsConfigPaths()],
        test: {
          name: 'e2e',
          include: ['src/http/controllers/**/*.spec.ts'],
          environment: 'prisma',
        },
      },
    ],
  },
})
