import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, it, expect } from 'vitest';

describe('Published package', () => {
    const root = path.resolve(__dirname, '..');
    const dist = (file: string) => readFileSync(path.join(root, 'dist', file), 'utf8');
    const runNode = (args: string[]) =>
        execFileSync(process.execPath, args, { cwd: root, encoding: 'utf8' }).trim();

    const script = `
        const turnish = new Turnish();
        console.log(JSON.stringify({
            markdown: turnish.render('<h1>Hello <b>world</b></h1>'),
            named: [typeof Rules, typeof NodeTypes, typeof isCodeBlock, typeof wrapInlineContent],
        }));
    `;
    const expected = { markdown: '# Hello **world**', named: ['function', 'object', 'function', 'function'] };

    it('provides the constructor as the default export for Node ESM', () => {
        const output = runNode(['--input-type=module', '-e',
            `import Turnish, { Rules, NodeTypes, isCodeBlock, wrapInlineContent } from 'turnish';${script}`]);
        expect(JSON.parse(output)).toEqual(expected);
    });

    it('provides the constructor as the module for require()', () => {
        const output = runNode(['--input-type=commonjs', '-e',
            `const Turnish = require('turnish'); const { Rules, NodeTypes, isCodeBlock, wrapInlineContent } = Turnish;${script}`]);
        expect(JSON.parse(output)).toEqual(expected);
    });

    it('keeps the default property for require() consumers that rely on it', () => {
        const output = runNode(['--input-type=commonjs', '-e',
            `const Turnish = require('turnish').default; const { Rules, NodeTypes, isCodeBlock, wrapInlineContent } = require('turnish');${script}`]);
        expect(JSON.parse(output)).toEqual(expected);
    });

    it.each(['index.iife.js', 'index.umd.js'])('exposes the constructor as the Turnish global in %s', (file) => {
        const sandbox: Record<string, any> = {};
        sandbox.window = sandbox;
        sandbox.self = sandbox;
        sandbox.globalThis = sandbox;
        vm.runInNewContext(dist(file), sandbox);
        expect(typeof sandbox.Turnish).toBe('function');
        expect(sandbox.Turnish.default).toBe(sandbox.Turnish);
        expect(typeof sandbox.Turnish.Rules).toBe('function');
    });

    it.each(['index.mjs', 'index.iife.js', 'index.umd.js'])('does not reference Node-only modules in the browser build %s', (file) => {
        const code = dist(file);
        expect(code).not.toMatch(/\brequire\(/);
        expect(code).not.toContain('@mixmark-io/domino');
    });

    it('declares exactly the packages the Node builds load at runtime as dependencies', () => {
        const { dependencies = {} } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
        const isPackage = (specifier: string) => !/^(node:|[./])/.test(specifier);
        const specifiers = (code: string, pattern: RegExp) =>
            [...new Set([...code.matchAll(pattern)].map((match) => match[1]).filter(isPackage))].sort();

        const declared = Object.keys(dependencies).sort();
        expect(specifiers(dist('index.node.mjs'), /\bfrom\s*["']([^"']+)["']/g)).toEqual(declared);
        expect(specifiers(dist('index.cjs'), /\brequire\(["']([^"']+)["']\)/g)).toEqual(declared);
    });

    it('does not use require() in the Node ESM build', () => {
        const code = dist('index.node.mjs');
        expect(code).not.toMatch(/\brequire\(/);
        expect(code).toContain('@mixmark-io/domino');
    });
});
