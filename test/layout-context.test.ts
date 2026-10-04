import Turnish from '@/index';
import { describe, it, expect } from 'vitest';

describe('Layout Context', () => {
    it('handles flex-flow: row on a display: block container (should be line-broken)', () => {
        const turnish = new Turnish();
        const html = `
            <div style="display: block; flex-flow: row;">
                <div style="display: block;">Item 1</div>
                <div style="display: block;">Item 2</div>
            </div>
        `;
        const result = turnish.render(html);
        expect(result).toBe('Item 1\n\nItem 2');
    });

    it('handles inline-block parent making children non-block', () => {
        const turnish = new Turnish();
        const html = `
            <div style="display: inline-block;">
                <div style="display: block;">Sub Item</div>
            </div>
        `;
        const result = turnish.render(html);
        expect(result).toBe('Sub Item');
    });

    it('handles the user reported case (UL with flex-flow and LI with inline-block)', () => {
        const turnish = new Turnish();
        const html = `
            <ul style="display: block; flex-flow: row; list-style-type: none;">
                <li style="display: inline-block;"><label style="display: block;">ポスト</label></li>
                <li style="display: inline-block;"><label style="display: block;">シェア</label></li>
            </ul>
        `;
        const result = turnish.render(html);
        expect(result).toBe('ポスト シェア');
    });

    describe('blocks inside inline wrappers', () => {
        const wrappers: Array<[string, string, string]> = [
            ['unstyled span', '<span>', '</span>'],
            ['display:inline span', '<span style="display: inline;">', '</span>'],
            ['display:contents element', '<x-wrap style="display: contents;">', '</x-wrap>'],
            ['nested spans', '<span><span style="display: inline;">', '</span></span>'],
        ];

        const cases: Array<[string, (open: string, close: string) => string]> = [
            ['nested list after text', (o, c) => `<ul><li><strong>T</strong>${o}<ul><li>a</li><li>b</li></ul>${c}</li><li>next</li></ul>`],
            ['nested list as the only child', (o, c) => `<ul><li>${o}<ul><li>a</li><li>b</li></ul>${c}</li></ul>`],
            ['nested list after a paragraph', (o, c) => `<ul><li><p>T</p>${o}<ul><li>a</li><li>b</li></ul>${c}</li><li><p>next</p></li></ul>`],
            ['nested ordered list', (o, c) => `<ol><li>T${o}<ol start="3"><li>a</li><li>b</li></ol>${c}</li><li>next</li></ol>`],
            ['nested list followed by another element', (o, c) => `<ul><li>T${o}<ul><li>a</li></ul>${c}<em>tail</em></li></ul>`],
            ['three levels', (o, c) => `<ul><li>1${o}<ul><li>2${o}<ul><li>3</li></ul>${c}</li></ul>${c}</li></ul>`],
            ['whitespace around the wrapper', (o, c) => `<ul>\n<li>T\n${o}\n<ul>\n<li>a</li>\n<li>b</li>\n</ul>\n${c}\n</li>\n</ul>`],
        ];

        for (const [wrapperName, open, close] of wrappers) {
            for (const [caseName, build] of cases) {
                it(`renders ${caseName} wrapped in ${wrapperName} like an unwrapped one`, () => {
                    const turnish = new Turnish();
                    expect(turnish.render(build(open, close))).toBe(turnish.render(build('', '')));
                });
            }
        }

        it('renders a nested list wrapped in an inline span as nested items', () => {
            const turnish = new Turnish();
            const html = '<ul><li><strong>T</strong><span style="display: inline;"><ul><li>a</li><li>b</li></ul></span></li></ul>';
            expect(turnish.render(html)).toBe('- **T**\n    - a\n    - b');
        });

        it('renders a nested list in a styled inline wrapper (Gmail-like markup)', () => {
            const turnish = new Turnish();
            const html = `
                <div style="display: block;">
                    <h2 style="display: block;">Still failing</h2>
                    <ul style="display: block; list-style-type: disc;">
                        <li style="display: list-item; list-style-type: disc;">
                            <strong style="display: inline;">Parent
                                item</strong><span class="im" style="display: inline;">
                                <ul style="display: block; list-style-type: circle;">
                                    <li style="display: list-item; list-style-type: circle;">
                                        first</li>
                                    <li style="display: list-item; list-style-type: circle;">
                                        second</li>
                                </ul>
                            </span></li>
                    </ul>
                    <p style="display: block;">Footer</p>
                </div>
            `;
            expect(turnish.render(html)).toBe('## Still failing\n\n- **Parent item**\n    - first\n    - second\n\nFooter');
        });

        it('keeps paragraphs inside an inline wrapper as blocks', () => {
            const turnish = new Turnish();
            const html = '<div>before <span><p>A</p><p>B</p></span> after</div>';
            expect(turnish.render(html)).toBe('before\n\nA\n\nB\n\nafter');
        });

        it('keeps a heading and a blockquote inside an inline wrapper as blocks', () => {
            const turnish = new Turnish();
            const html = '<span style="display: inline;"><h2>Title</h2><blockquote>Quote</blockquote></span>';
            expect(turnish.render(html)).toBe('## Title\n\n> Quote');
        });

        it('keeps children of an inline-block inside an inline wrapper inline', () => {
            const turnish = new Turnish();
            const html = '<div style="display: inline-block;"><span><div style="display: block;">A</div><div style="display: block;">B</div></span></div>';
            expect(turnish.render(html)).toBe('AB');
        });

        it('keeps children of a flex row item inline even when the item is a span', () => {
            const turnish = new Turnish();
            const html = '<div style="display: flex; flex-flow: row;"><span><div>A</div><div>B</div></span><div>C</div></div>';
            expect(turnish.render(html)).toBe('ABC');
        });

        it('keeps children of a button inline', () => {
            const turnish = new Turnish();
            const html = '<button><div>A</div><div>B</div></button>';
            expect(turnish.render(html)).toBe('AB');
        });
    });
});
