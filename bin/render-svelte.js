#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { renderSvelte } from '../src/lib/export.js'

const [, , inputPath] = process.argv

if (!inputPath) {
  console.error('Usage: ./bin/render-svelte.js <design.json>')
  process.exit(1)
}

const resolvedInputPath = path.resolve(process.cwd(), inputPath)

let payload
try {
  payload = JSON.parse(fs.readFileSync(resolvedInputPath, 'utf8'))
} catch (error) {
  console.error(`Failed to read or parse JSON from ${resolvedInputPath}`)
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}

if (!Array.isArray(payload?.design)) {
  console.error('Invalid design JSON: top-level "design" must be an array.')
  process.exit(1)
}

process.stdout.write(renderSvelte(payload.design, payload.theme || {}, payload.document || null))
