# turnish

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
