// import * as esbuild from 'esbuild'
const esbuild = require('esbuild')

;(async () => {
    await esbuild.build({
        entryPoints: ['main.ts'],
        bundle: true,
        outfile: 'dist/main.js',
        format: 'esm',
        target: 'esnext',
        platform: 'node',
        banner: {
            js: `
// BANNER START
const require = (await import("node:module")).createRequire(import.meta.url);
const __filename = (await import("node:url")).fileURLToPath(import.meta.url);
const __dirname = (await import("node:path")).dirname(__filename);
// BANNER END
        `,
        },
    })

    await esbuild.build({
        entryPoints: ['main.ts'],
        bundle: true,
        outfile: 'dist/main.cjs',
        format: 'cjs',
        target: 'esnext',
        platform: 'node',
    })
})()
