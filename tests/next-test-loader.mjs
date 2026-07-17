import { register } from 'node:module'

register(new URL('./next-test-loader-hooks.mjs', import.meta.url), import.meta.url)
