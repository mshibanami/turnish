# turnish

## 1.13.0

### Minor Changes

- [`f1db375`](https://github.com/mshibanami/turnish/commit/f1db3753586c39ea993b4e5d4169c8dbe7c9839c) Thanks [@mshibanami](https://github.com/mshibanami)! - Export `wrapInlineContent`, which lets rules for inline elements (such as strikethrough) stay valid when the element contains block content

### Patch Changes

- [`967aaf1`](https://github.com/mshibanami/turnish/commit/967aaf1649c699dea406f47df5762d6e7ad4cfa7) Thanks [@mshibanami](https://github.com/mshibanami)! - Fix the documented ways of loading the package: `require('turnish')`, `import Turnish from 'turnish'` in Node ESM and the `Turnish` browser global now all provide the constructor, and the ES module builds no longer call `require()`

- [`8b2215c`](https://github.com/mshibanami/turnish/commit/8b2215c63cef9537a7f46455f6ea3f2efd6ab4e4) Thanks [@mshibanami](https://github.com/mshibanami)! - Fix links, emphasis and inline code that contain block elements producing broken Markdown (multi-line reference links, emphasis spanning paragraphs, text glued to neighbours)

- [`4d0d580`](https://github.com/mshibanami/turnish/commit/4d0d5800a8a18b0c9a0c3921f5d4fc12cce1f258) Thanks [@mshibanami](https://github.com/mshibanami)! - Fix reference-style links leaking their collected references into the next conversion after a failed conversion, or mixing them up when a rule runs another conversion

- [`2e992c2`](https://github.com/mshibanami/turnish/commit/2e992c2ff9a56491421fe8a0bded173bc89e349f) Thanks [@mshibanami](https://github.com/mshibanami)! - Number ordered list items the way browsers do: only list items are counted, items wrapped inside the list are numbered and separated correctly, and the `start`, `reversed` and `value` attributes are honored (an invalid `start` no longer yields `NaN.`)

- [`99b2bdb`](https://github.com/mshibanami/turnish/commit/99b2bdbb23023d77ad2fe1b5c86d1b0d11e32278) Thanks [@mshibanami](https://github.com/mshibanami)! - Resolve repeated declarations in a `style` attribute like the CSS cascade does (the last one wins unless an earlier one is `!important`)

- [`92d04f9`](https://github.com/mshibanami/turnish/commit/92d04f91f348315b7396ab04deca6088faa108f7) Thanks [@mshibanami](https://github.com/mshibanami)! - Stop installing `@adobe/css-tools` alongside the package: it is already compiled into every build, so the separately installed copy was never loaded

- [`5d5be35`](https://github.com/mshibanami/turnish/commit/5d5be35c3c9f478c11605326bcd2525d59023dc9) Thanks [@mshibanami](https://github.com/mshibanami)! - Declare the package as side-effect free so bundlers can drop it when nothing imported from it is used

- [`314a602`](https://github.com/mshibanami/turnish/commit/314a6021fc7af77dd1631d3f97ea8e818270f862) Thanks [@mshibanami](https://github.com/mshibanami)! - Fix block elements inside inline wrappers (e.g. `<li><span><ul>…</ul></span></li>`) being flattened into inline text, and keep such lists nested

- [`68e3350`](https://github.com/mshibanami/turnish/commit/68e335068fed855a6843ff2ef0f8b44cdf7a2237) Thanks [@mshibanami](https://github.com/mshibanami)! - Speed up conversion of documents with `style` attributes by parsing each attribute once and remembering block detection results during a conversion

- [`bd68c57`](https://github.com/mshibanami/turnish/commit/bd68c57794045af69fc7f3c9ad583eb691d065d2) Thanks [@mshibanami](https://github.com/mshibanami)! - Fix nested lists losing their indentation when wrapped in a block element (e.g. `<li><div><ul>…</ul></div></li>`), and indent list-item lines that merely look like list markers (e.g. inside code blocks)

- [`ca2f8d9`](https://github.com/mshibanami/turnish/commit/ca2f8d9d0980ab40fd5dc16aae2bb20c672db1be) Thanks [@mshibanami](https://github.com/mshibanami)! - Fix the type declarations for TypeScript projects that do not use `moduleResolution: "bundler"`: they now resolve under `node16`/`nodenext` and the classic `node` resolution, and `require('turnish')` is typed as the constructor it returns

## 1.12.2

### Patch Changes

- 8a78a6b: Fixed Turnish not working in Node

## 1.12.1

### Patch Changes

- 4df21e0: Improve compact paragraph rendering in list items with nested structures

## 1.12.0

### Minor Changes

- 2e91992: Compact paragraph rendering if it's more natural

### Patch Changes

- 9914f42: Update dependencies

## 1.11.1

### Patch Changes

- 48ddcb5: Align Markdown output with browser visual rendering for inline elements

## 1.11.0

### Minor Changes

- e47f5ff: Improve inline/block node detection

## 1.10.0

### Minor Changes

- Support white-space CSS property to preserve new lines and whitespaces
- Simplify package exports by removing redundant `node` and `default` fields

## 1.9.0

### Minor Changes

- Improve package exports for better bundler and Node.js compatibility

- Point "browser" export condition to ESM instead of UMD to fix compatibility with modern bundlers like Vite
- Reorder exports conditions for better Node.js interop
- Add unpkg and jsdelivr fields for CDN support

## 1.8.0

### Minor Changes

## Bug fixes

- Escape HTML attribute values in retained HTML ([#2](https://github.com/mshibanami/turnish/pull/2))
- Avoid array allocations in process ([#7](https://github.com/mshibanami/turnish/pull/7))
- Avoid document.write when parsing HTML ([#4](https://github.com/mshibanami/turnish/pull/4))

Thanks to [@Olyno](https://github.com/Olyno) for reporting and fixing all of the above issues!

## Documentation

- Updated README

## 1.7.1

### Patch Changes

- Remove jsdom dependency from unit test

## 1.7.0

### Minor Changes

- use turnish-plugin-gfm

## 1.6.2

### Patch Changes

- Export isCodeBlock for turnish-plugin-gfm

## 1.6.1

### Patch Changes

- Export types

## 1.6.0

### Minor Changes

- Add isCodeBlock() method to Turnish class for compatibility with Turndown

## 1.5.0

### Minor Changes

- Update the default behavior of `pre` tag without `code`

## 1.4.0

### Minor Changes

- 9c2b00c: Fix linked image sanitization

## 1.3.0

### Minor Changes

- Modified the default options

## 1.2.0

### Minor Changes

- Fixed extra spacing caused by GFM plugin

## 1.1.0

### Minor Changes

- Added options:
  - `listItemIndent`: Choose 'tab' or 'space' for list-item indentation.
  - `listItemIndentSpaceCount`: Specify the number of spaces (1–4) to use for space indentation.
  - `listMarkerSpaceCount`: Specify the number of spaces (1–4) placed after the list marker.
- Fixed handling of nested lists to ensure correct indentation.

## 1.0.0

### Major Changes

- Initial Release
