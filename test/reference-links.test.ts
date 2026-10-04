import Turnish from '@/index';
import { describe, it, expect } from 'vitest';

describe('Reference links', () => {
    const referenced = () => new Turnish({ linkStyle: 'referenced' });

    it('does not carry references over from a conversion that failed', () => {
        const failing = referenced();
        failing.addRule('boom', {
            filter: ['mark'],
            replacement: () => {
                throw new Error('boom');
            },
        });
        expect(() => failing.render('<a href="https://a.example">a</a><mark>x</mark>')).toThrow('boom');

        expect(referenced().render('<a href="https://b.example">b</a>'))
            .toBe('[b][1]\n\n[1]: https://b.example');
    });

    it('keeps the references of a conversion that runs another conversion', () => {
        const inner = referenced();
        const outer = referenced();
        outer.addRule('nested', {
            filter: ['mark'],
            replacement: (_content: string, node: Element) => inner.render(node.getAttribute('data-html') ?? ''),
        });

        const nestedHtml = '&lt;a href=&quot;https://b.example&quot;&gt;b&lt;/a&gt;';
        expect(outer.render(`<p><a href="https://a.example">a</a></p><mark data-html="${nestedHtml}">x</mark><p><a href="https://c.example">c</a></p>`))
            .toBe('[a][1]\n\n[b][1]\n\n[1]: https://b.example\n\n[c][2]\n\n[1]: https://a.example\n[2]: https://c.example');
    });

    it('numbers references independently for each conversion', () => {
        const turnish = referenced();
        expect(turnish.render('<a href="https://a.example">a</a>')).toBe('[a][1]\n\n[1]: https://a.example');
        expect(turnish.render('<a href="https://b.example">b</a>')).toBe('[b][1]\n\n[1]: https://b.example');
    });
});
