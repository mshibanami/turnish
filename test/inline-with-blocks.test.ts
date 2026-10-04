import Turnish from '@/index';
import { describe, it, expect } from 'vitest';

describe('Inline elements containing blocks', () => {
    const card = '<a href="https://example.com"><div>Title</div><div>Description</div></a>';

    describe('links', () => {
        it('keeps an inlined link on one line', () => {
            const turnish = new Turnish();
            expect(turnish.render(card)).toBe('[Title Description](https://example.com)');
        });

        it('keeps a full reference link and its definition on one line', () => {
            const turnish = new Turnish({ linkStyle: 'referenced' });
            expect(turnish.render(card)).toBe('[Title Description][1]\n\n[1]: https://example.com');
        });

        it('keeps a collapsed reference link and its definition on one line', () => {
            const turnish = new Turnish({ linkStyle: 'referenced', linkReferenceStyle: 'collapsed' });
            expect(turnish.render(card)).toBe('[Title Description][]\n\n[Title Description]: https://example.com');
        });

        it('keeps a shortcut reference link and its definition on one line', () => {
            const turnish = new Turnish({ linkStyle: 'referenced', linkReferenceStyle: 'shortcut' });
            expect(turnish.render(card)).toBe('[Title Description]\n\n[Title Description]: https://example.com');
        });

        it('separates a link wrapping a block from the surrounding text', () => {
            const turnish = new Turnish();
            const input = 'before <a href="https://example.com"><div>Title</div></a> after';
            expect(turnish.render(input)).toBe('before\n\n[Title](https://example.com)\n\nafter');
        });

        it('separates adjacent links wrapping blocks', () => {
            const turnish = new Turnish();
            const input = '<a href="https://example.com/1"><div>A</div></a><a href="https://example.com/2"><div>B</div></a>';
            expect(turnish.render(input)).toBe('[A](https://example.com/1)\n\n[B](https://example.com/2)');
        });

        it('separates a reference link wrapping a block from the surrounding text', () => {
            const turnish = new Turnish({ linkStyle: 'referenced' });
            const input = 'before <a href="https://example.com"><div>Title</div></a> after';
            expect(turnish.render(input)).toBe('before\n\n[Title][1]\n\nafter\n\n[1]: https://example.com');
        });
    });

    describe('emphasis', () => {
        it('emphasizes each paragraph separately', () => {
            const turnish = new Turnish();
            expect(turnish.render('<strong><div>a</div><div>b</div></strong>')).toBe('**a**\n\n**b**');
            expect(turnish.render('<em><p>a</p><p>b</p></em>')).toBe('*a*\n\n*b*');
        });

        it('separates an emphasized block from the surrounding text', () => {
            const turnish = new Turnish();
            expect(turnish.render('before <strong><div>a</div></strong> after')).toBe('before\n\n**a**\n\nafter');
            expect(turnish.render('before <em><div>a</div></em> after')).toBe('before\n\n*a*\n\nafter');
        });

        it('keeps inline text before a block emphasized on its own line', () => {
            const turnish = new Turnish();
            expect(turnish.render('<b>lead<p>a</p></b> after')).toBe('**lead**\n\n**a**\n\nafter');
        });

        it('emphasizes list items after their markers', () => {
            const turnish = new Turnish();
            expect(turnish.render('<b><ul><li>a</li><li>b</li></ul></b>')).toBe('- **a**\n- **b**');
            expect(turnish.render('<b><ol><li>a<ul><li>b</li></ul></li></ol></b>')).toBe('1. **a**\n    - **b**');
        });

        it('emphasizes headings and blockquotes after their markers', () => {
            const turnish = new Turnish();
            expect(turnish.render('<i><h2>Title</h2><blockquote>Quote</blockquote></i>')).toBe('## *Title*\n\n> *Quote*');
        });

        it('leaves fenced code blocks untouched', () => {
            const turnish = new Turnish();
            expect(turnish.render('<b><p>a</p><pre><code>x\ny</code></pre></b>')).toBe('**a**\n\n```\nx\ny\n```');
        });

        it('keeps a hard line break inside a single emphasis', () => {
            const turnish = new Turnish();
            expect(turnish.render('<strong>a<br>b</strong>')).toBe('**a  \nb**');
        });

        it('does not mistake inline text for block structure', () => {
            const turnish = new Turnish();
            expect(turnish.render('<strong>| a | b</strong>')).toBe('**| a | b**');
            expect(turnish.render('<strong><em>a</em> b</strong>')).toBe('***a* b**');
        });

        it('keeps plain inline emphasis unchanged', () => {
            const turnish = new Turnish();
            expect(turnish.render('before <strong>a</strong> after')).toBe('before **a** after');
        });
    });

    describe('code', () => {
        it('joins blocks with a single space', () => {
            const turnish = new Turnish();
            expect(turnish.render('<code><div>a</div><div>b</div></code>')).toBe('`a b`');
        });
    });
});
