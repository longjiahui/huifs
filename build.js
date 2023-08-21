import * as esbuild from 'esbuild'
// const esbuild = require('esbuild')

const entry = [
    'src/index.ts',
    'src/utils.ts',
    'src/file.ts',
    'src/datasource.ts',
    'src/error.ts',
]

;(async () => {
    await esbuild.build({
        entryPoints: [...entry],
        bundle: true,
        outdir: 'dist',
        format: 'esm',
        platform: 'node',
        minify: true,
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
        entryPoints: ['src/index.ts'],
        bundle: true,
        outfile: 'dist/index.cjs',
        format: 'cjs',
        platform: 'node',
    })
})()
