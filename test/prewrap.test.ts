import { describe, it, expect } from 'vitest';
import Turnish from '../src/index';

describe('white-space property handling', () => {
  it('should preserve newlines for elements with white-space: pre-wrap', () => {
    const turnish = new Turnish();
    const html = '<div style="white-space: pre-wrap;">line1\nline2</div>';
    const markdown = turnish.render(html);
    expect(markdown).toContain('line1\nline2');
  });

  it('should preserve newlines for multiple properties', () => {
    const turnish = new Turnish();
    const html = '<div style="color: red; white-space: break-spaces; font-weight: bold;">line1\nline2</div>';
    const markdown = turnish.render(html);
    expect(markdown).toContain('line1\nline2');
  });

  it('should preserve whitespace for uppercase styling properties', () => {
    const turnish = new Turnish();
    const html = '<div style="WHITE-SPACE: PRE;">  line1  \n   line2  </div>';
    const markdown = turnish.render(html);
    expect(markdown).toContain('  line1  \n   line2'); // Post-processing trims trailing whitespace across the document
  });

  it('should collapse whitespace if white-space value is unrelated', () => {
    const turnish = new Turnish();
    const html = '<div style="white-space: pre-wrap-foo;">  line1  \n   line2  </div>';
    const markdown = turnish.render(html);
    expect(markdown).not.toContain('  line1  \n   line2  ');
    expect(markdown).toContain('line1 line2');
  });

  it('should collapse whitespace if white-space value is normal', () => {
    const turnish = new Turnish();
    const html = '<div style="white-space: normal;">  line1  \n   line2  </div>';
    const markdown = turnish.render(html);
    expect(markdown).not.toContain('  line1  \n   line2  ');
    expect(markdown).toContain('line1 line2');
  });
});
