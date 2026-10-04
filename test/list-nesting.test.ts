import Turnish from '@/index';
import { describe, it, expect } from 'vitest';

describe('List nesting', () => {
    const render = (html: string, options = {}) => new Turnish(options).render(html);

    describe('nested lists inside block wrappers', () => {
        const wrappers: Array<[string, string, string]> = [
            ['div', '<div>', '</div>'],
            ['styled div', '<div style="display: block;">', '</div>'],
            ['nested divs', '<div><div>', '</div></div>'],
            ['section', '<section>', '</section>'],
            ['div inside span', '<span><div>', '</div></span>'],
        ];

        const cases: Array<[string, (open: string, close: string) => string]> = [
            ['nested list after text', (o, c) => `<ul><li>T${o}<ul><li>a</li><li>b</li></ul>${c}</li><li>next</li></ul>`],
            ['nested list as the only child', (o, c) => `<ul><li>${o}<ul><li>a</li><li>b</li></ul>${c}</li><li>next</li></ul>`],
            ['nested list after a paragraph', (o, c) => `<ul><li><p>T</p>${o}<ul><li>a</li><li>b</li></ul>${c}</li><li><p>next</p></li></ul>`],
            ['nested ordered list', (o, c) => `<ol><li>T${o}<ol><li>a</li><li>b</li></ol>${c}</li><li>next</li></ol>`],
            ['three levels', (o, c) => `<ul><li>1${o}<ul><li>2${o}<ul><li>3</li></ul>${c}</li></ul>${c}</li></ul>`],
            ['nested list followed by a paragraph', (o, c) => `<ul><li>T${o}<ul><li>a</li></ul>${c}<p>after</p></li></ul>`],
        ];

        for (const [wrapperName, open, close] of wrappers) {
            for (const [caseName, build] of cases) {
                it(`renders ${caseName} wrapped in ${wrapperName} like an unwrapped one`, () => {
                    expect(render(build(open, close))).toBe(render(build('', '')));
                });
            }
        }

        it('nests a list wrapped in a div under its item', () => {
            expect(render('<ul><li>T<div><ul><li>a</li><li>b</li></ul></div></li><li>next</li></ul>'))
                .toBe('- T\n    - a\n    - b\n- next');
        });

        it('nests a list that follows a text wrapper', () => {
            expect(render('<ul><li><div>T</div><div><ul><li>a</li><li>b</li></ul></div></li><li>next</li></ul>'))
                .toBe('- T\n    - a\n    - b\n- next');
        });
    });

    describe('nested lists inside other blocks of an item', () => {
        it('indents a list that shares a wrapper with text', () => {
            const lines = render('<ul><li><div>T<ul><li>a</li><li>b</li></ul></div></li><li>next</li></ul>').split('\n');
            expect(lines.filter(line => line.trim() !== '')).toEqual(['- T', '    - a', '    - b', '- next']);
        });

        it('indents a list inside a blockquote', () => {
            expect(render('<ul><li>T<blockquote><ul><li>a</li><li>b</li></ul></blockquote></li></ul>'))
                .toBe('- T\n    \n    > - a\n    > - b');
        });

        it('indents every level by the configured indent', () => {
            expect(render('<ul><li>1<div><ul><li>2<div><ul><li>3</li></ul></div></li></ul></div></li></ul>', { listItemIndentSpaceCount: 2 }))
                .toBe('- 1\n  - 2\n    - 3');
            expect(render('<ul><li>1<div><ul><li>2</li></ul></div></li></ul>', { listItemIndent: 'tab' }))
                .toBe('- 1\n\t- 2');
        });
    });

    describe('item content that looks like a list marker', () => {
        it('indents code block lines that start with a list marker', () => {
            expect(render('<ul><li>T<pre><code>- x\n1. y\nz</code></pre></li></ul>'))
                .toBe('- T\n    \n    ```\n    - x\n    1. y\n    z\n    ```');
        });
    });

    describe('ordered list numbering', () => {
        it('counts only list items', () => {
            expect(render('<ol><li>a</li><template></template><li>b</li></ol>')).toBe('1. a\n2. b');
            expect(render('<ol><li>a</li><div>x</div><li>b</li></ol>')).toBe('1. a\n\nx\n\n2. b');
        });

        it('numbers items that are wrapped inside the list', () => {
            expect(render('<ol><span><li>a</li><li>b</li></span></ol>')).toBe('1. a\n2. b');
            expect(render('<ol><li>a</li><div><li>b</li><li>c</li></div></ol>')).toBe('1. a\n2. b\n3. c');
            expect(render('<ol><x-w style="display: contents;"><li>a</li></x-w><x-w style="display: contents;"><li>b</li></x-w></ol>'))
                .toBe('1. a\n2. b');
        });

        it('separates wrapped items of a bullet list', () => {
            expect(render('<ul><x-w style="display: contents;"><li>a</li></x-w><x-w style="display: contents;"><li>b</li></x-w></ul>'))
                .toBe('- a\n- b');
        });

        it('numbers nested lists independently', () => {
            expect(render('<ol><li>a<ol><li>x</li><li>y</li></ol></li><li>b</li></ol>'))
                .toBe('1. a\n    1. x\n    2. y\n2. b');
        });

        it('honors the start attribute', () => {
            expect(render('<ol start="3"><li>a</li><li>b</li></ol>')).toBe('3. a\n4. b');
            expect(render('<ol start="0"><li>a</li><li>b</li></ol>')).toBe('0. a\n1. b');
        });

        it('ignores an invalid start attribute', () => {
            expect(render('<ol start="x"><li>a</li><li>b</li></ol>')).toBe('1. a\n2. b');
        });

        it('honors the value attribute of items', () => {
            expect(render('<ol><li>a</li><li value="5">b</li><li>c</li></ol>')).toBe('1. a\n5. b\n6. c');
            expect(render('<ol><li value="x">a</li><li>b</li></ol>')).toBe('1. a\n2. b');
        });

        it('counts down in a reversed list', () => {
            expect(render('<ol reversed><li>a</li><li>b</li><li>c</li></ol>')).toBe('3. a\n2. b\n1. c');
            expect(render('<ol reversed start="10"><li>a</li><li>b</li></ol>')).toBe('10. a\n9. b');
        });

        it('uses bullets for items outside of a list', () => {
            expect(render('<div><li>a</li><li>b</li></div>')).toBe('- a\n- b');
        });
    });
});
