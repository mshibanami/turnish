import Turnish from '@/index';
import { describe, it, expect } from 'vitest';
import { sanitizedHtmlAttribute } from '@/utilities';

describe('Sanitization', () => {
    describe('sanitizedHtmlAttribute unit tests', () => {
        it('escapes special HTML characters', () => {
            expect(sanitizedHtmlAttribute('&')).toBe('&amp;');
            expect(sanitizedHtmlAttribute('"')).toBe('&quot;');
            expect(sanitizedHtmlAttribute('<')).toBe('&lt;');
            expect(sanitizedHtmlAttribute('>')).toBe('&gt;');
            expect(sanitizedHtmlAttribute("'")).toBe('&#39;');
        });

        it('escapes multiple characters in a string', () => {
            const input = '<div title="test & \'example\'">内容</div>';
            const expected = '&lt;div title=&quot;test &amp; &#39;example&#39;&quot;&gt;内容&lt;/div&gt;';
            expect(sanitizedHtmlAttribute(input)).toBe(expected);
        });

        it('handles empty strings', () => {
            expect(sanitizedHtmlAttribute('')).toBe('');
        });

        it('does not escape alphanumeric characters', () => {
            const input = 'abcABC123';
            expect(sanitizedHtmlAttribute(input)).toBe(input);
        });
    });

    describe('Integration with htmlRetentionMode option', () => {
        it('escapes attributes in markdownIncludingHtml mode', () => {
            const turnish = new Turnish({ htmlRetentionMode: 'markdownIncludingHtml' });
            const input1 = '<div title=\'"><script>alert(1)</script>\'>content</div>';
            const output1 = turnish.render(input1);
            expect(output1).toContain('title="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;"');
            expect(output1).not.toContain('"><script>');
            const input2 = '<span data-info="A & B < C > D \' E">text</span>';
            const output2 = turnish.render(input2);
            expect(output2).toContain('data-info="A &amp; B &lt; C &gt; D &#39; E"');
        });

        it('escapes attributes when preserving unsupported elements (preserveAll mode)', () => {
            const turnish = new Turnish({ htmlRetentionMode: 'preserveAll' });
            const inputSafe = '<custom-tag attr=\'& < > " \'>content</custom-tag>';
            const output = turnish.render(inputSafe);
            expect(output).toContain('attr="&amp; &lt; &gt; &quot; "');
        });

        it('handles attributes with no values', () => {
            const turnish = new Turnish({ htmlRetentionMode: 'markdownIncludingHtml' });
            const input = '<div disabled>content</div>';
            const output = turnish.render(input);
            expect(output).toContain('disabled=""');
        });
    });
});
