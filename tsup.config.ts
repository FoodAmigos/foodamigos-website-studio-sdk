import { defineConfig } from "tsup"
import { readFileSync, writeFileSync } from "fs"

const sharedOptions = {
  format: ["esm", "cjs"] as const,
  dts: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  esbuildOptions(options: import("esbuild").BuildOptions) {
    options.jsx = 'automatic'
  },
}

export default defineConfig([
  {
    ...sharedOptions,
    entry: ["src/index.ts"],
    clean: true,
  },
  {
    ...sharedOptions,
    entry: ["src/client.ts"],
    clean: false,
    async onSuccess() {
      for (const file of ["dist/client.js", "dist/client.mjs"]) {
        const content = readFileSync(file, "utf-8")
        writeFileSync(file, `'use client';\n${content}`)
      }
    },
  },
])
