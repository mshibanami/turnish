/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import type { LibraryFormats, UserConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

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
