import { readFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    return nextResolve('next/server.js', context)
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !specifier.match(/\.[a-z0-9]+$/i)) {
    return nextResolve(`${specifier}.ts`, context)
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.ts')) {
    const source = await readFile(new URL(url), 'utf8')
    return {
      format: 'module',
      shortCircuit: true,
      source: stripTypeScriptTypes(source, { mode: 'strip' }),
    }
  }
  return nextLoad(url, context)
}
