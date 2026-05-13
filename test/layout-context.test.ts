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
});
