import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
import { afterAll, beforeAll, describe, it, expect } from 'vitest';

describe('Published type declarations', () => {
    const root = path.resolve(__dirname, '..');
    const tsc = createRequire(__filename).resolve('typescript/bin/tsc');
    let project: string;

    beforeAll(() => {
        project = mkdtempSync(path.join(os.tmpdir(), 'turnish-types-'));
        mkdirSync(path.join(project, 'node_modules'));
        symlinkSync(root, path.join(project, 'node_modules', 'turnish'), 'dir');
    });

    afterAll(() => {
        rmSync(project, { recursive: true, force: true });
    });

    const usage = `
        const options: Partial<TurnishOptions> = { headingStyle: 'atx' };
        const turnish: Turnish = new Turnish(options);
        const rule: Rule = { filter: 'p', replacement: (content: string) => content };
        const plugin: Plugin = (service) => { service.addRule('paragraph', rule); };
        const markdown: string = turnish.use(plugin).render('<p>Hello</p>');
        const rules: Rules = turnish.rules;
        const element: 1 = NodeTypes.Element;
        const isCode: boolean = isCodeBlock({} as Node);
        const wrapped: string = wrapInlineContent('a', (text) => '*' + text + '*');
        export { markdown, rules, element, isCode, wrapped };
    `;

    const esmSyntax = `
        import Turnish, { Rules, NodeTypes, isCodeBlock, wrapInlineContent } from 'turnish';
        import type { Plugin, Rule, TurnishOptions } from 'turnish';
        ${usage}
    `;

    const requireSyntax = `
        import Turnish = require('turnish');
        import Rules = Turnish.Rules;
        type Plugin = Turnish.Plugin;
        type Rule = Turnish.Rule;
        type TurnishOptions = Turnish.TurnishOptions;
        const { NodeTypes, isCodeBlock, wrapInlineContent } = Turnish;
        const viaDefault: Turnish = new Turnish.default();
        ${usage}
        export { viaDefault };
    `;

    const check = (name: string, file: string, source: string, compilerOptions: Record<string, unknown>) => {
        const dir = path.join(project, name);
        mkdirSync(dir);
        writeFileSync(path.join(dir, file), source);
        writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({
            compilerOptions: {
                target: 'es2020',
                strict: true,
                noEmit: true,
                skipLibCheck: false,
                types: [],
                ...compilerOptions,
            },
            files: [file],
        }));
        try {
            return execFileSync(process.execPath, [tsc, '-p', dir], { encoding: 'utf8' });
        } catch (error: any) {
            return `${error.stdout}${error.stderr}`;
        }
    };

    it('type-checks an ES module under node16 resolution', () => {
        expect(check('node16-esm', 'index.mts', esmSyntax, { module: 'node16' })).toBe('');
    }, 60_000);

    it('type-checks a CommonJS module under node16 resolution', () => {
        expect(check('node16-cjs', 'index.cts', requireSyntax, { module: 'node16' })).toBe('');
    }, 60_000);

    it('type-checks a CommonJS module under node10 resolution', () => {
        expect(check('node10-cjs', 'index.ts', requireSyntax, {
            module: 'commonjs', moduleResolution: 'node10', ignoreDeprecations: '5.0',
        })).toBe('');
    }, 60_000);

    it('type-checks default and named imports with esModuleInterop under node10 resolution', () => {
        expect(check('node10-interop', 'index.ts', esmSyntax, {
            module: 'commonjs', moduleResolution: 'node10', ignoreDeprecations: '5.0', esModuleInterop: true,
        })).toBe('');
    }, 60_000);

    it('declares the same exports for the CommonJS build as for the ES module builds', () => {
        const types = (file: string) => path.join(root, 'dist', 'types', file);
        const program = ts.createProgram([types('index.d.ts'), types('index.default-export.d.cts')], {
            module: ts.ModuleKind.Node16, target: ts.ScriptTarget.ES2020,
        });
        const checker = program.getTypeChecker();
        const exportsOf = (file: string) => {
            const module = checker.getSymbolAtLocation(program.getSourceFile(types(file))!)!;
            return checker.getExportsOfModule(module).map((symbol) => symbol.name)
                .filter((name) => name !== 'prototype').sort();
        };
        expect(exportsOf('index.default-export.d.cts')).toEqual(exportsOf('index.d.ts'));
    }, 60_000);

    it('type-checks an ES module under bundler resolution', () => {
        expect(check('bundler', 'index.ts', esmSyntax, { module: 'esnext', moduleResolution: 'bundler' })).toBe('');
    }, 60_000);
});
