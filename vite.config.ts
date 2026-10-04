/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import type { LibraryFormats, UserConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import dts from 'vite-plugin-dts';

const withExtension = (declarations: string, extension: string) =>
    declarations.replace(/(\bfrom\s*|\bimport\(\s*|\brequire\(\s*)(['"])(\.{1,2}\/[^'"]+)\2/g,
        (_match, keyword, quote, specifier) => `${keyword}${quote}${specifier}${extension}${quote}`);

const commonJsEntryTypes = 'index.default-export.d.cts';

function writeCommonJsDeclarations(emittedFiles: Map<string, string>) {
    for (const [filePath, content] of emittedFiles) {
        if (!filePath.endsWith('.d.ts')) continue;
        const target = filePath.replace(/\.d\.ts$/, '.d.cts');
        if (path.basename(target) === commonJsEntryTypes) continue;
        fs.writeFileSync(target, content.replace(/(['"])(\.{1,2}\/[^'"]+)\.js\1/g, '$1$2.cjs$1'));
    }
    fs.copyFileSync(path.resolve(__dirname, 'src', commonJsEntryTypes), path.resolve(__dirname, 'dist/types', commonJsEntryTypes));
}

interface BuildTarget {
    entry: string;
    formats: LibraryFormats[];
    fileNames: Partial<Record<LibraryFormats, string>>;
    exports: 'named' | 'default';
    browser: boolean;
}

const buildTargets: Record<string, BuildTarget> = {
    'browser-esm': {
        entry: 'src/index.ts',
        formats: ['es'],
        fileNames: { es: 'index.mjs' },
        exports: 'named',
        browser: true,
    },
    'browser-global': {
        entry: 'src/index.default-export.ts',
        formats: ['umd', 'iife'],
        fileNames: { umd: 'index.umd.js', iife: 'index.iife.js' },
        exports: 'default',
        browser: true,
    },
    'node-esm': {
        entry: 'src/index.ts',
        formats: ['es'],
        fileNames: { es: 'index.node.mjs' },
        exports: 'named',
        browser: false,
    },
    'node-cjs': {
        entry: 'src/index.default-export.ts',
        formats: ['cjs'],
        fileNames: { cjs: 'index.cjs' },
        exports: 'default',
        browser: false,
    },
};

const firstBuildTarget = Object.keys(buildTargets)[0];

export default defineConfig(({ mode }): UserConfig => {
    const target = buildTargets[mode];
    const srcAlias = { find: '@', replacement: path.resolve(__dirname, './src') };

    if (!target) {
        return {
            resolve: { alias: [srcAlias] },
            test: {
                include: ['test/**/*.test.ts'],
            },
        };
    }

    return {
        plugins: mode === firstBuildTarget
            ? [
                dts({
                    outDir: './dist/types',
                    entryRoot: './src',
                    include: ['src/**/*.ts'],
                    beforeWriteFile: (filePath, content) => ({ filePath, content: withExtension(content, '.js') }),
                    afterBuild: writeCommonJsDeclarations,
                }),
            ]
            : [],
        build: {
            sourcemap: true,
            emptyOutDir: mode === firstBuildTarget,
            lib: {
                entry: target.entry,
                name: 'Turnish',
                formats: target.formats,
                fileName: (format: string) => target.fileNames[format as LibraryFormats] ?? `index.${format}.js`,
            },
            rollupOptions: {
                // Externalize dependencies that shouldn't be bundled
                external: target.browser ? [] : ['@mixmark-io/domino'],
                output: {
                    exports: target.exports,
                }
            },
        },
        resolve: {
            alias: [
                ...(target.browser
                    ? [{ find: '@/dom-fallback', replacement: path.resolve(__dirname, './src/dom-fallback.browser.ts') }]
                    : []),
                srcAlias,
            ],
        },
    };
});
