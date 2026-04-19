#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'
import { createHtmlImporter } from '../src/lib/import-html.js'

const [, , inputPath, outputPathArg] = process.argv

if (!inputPath) {
  console.error('Usage: ./bin/import-html.js <input.html> [output.json]')
  process.exit(1)
}

const resolvedInputPath = path.resolve(process.cwd(), inputPath)
const outputPath = outputPathArg
  ? path.resolve(process.cwd(), outputPathArg)
  : path.resolve(
      process.cwd(),
      `${path.basename(resolvedInputPath, path.extname(resolvedInputPath))}.json`,
    )

let html
try {
  html = fs.readFileSync(resolvedInputPath, 'utf8')
} catch (error) {
  console.error(`Failed to read HTML from ${resolvedInputPath}`)
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}

const dom = new JSDOM(html)
const payload = createHtmlImporter(dom.window.document)

fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`)
