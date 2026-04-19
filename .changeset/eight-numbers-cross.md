---
"turnish": minor
---

Improve package exports for better bundler and Node.js compatibility

- Point "browser" export condition to ESM instead of UMD to fix compatibility with modern bundlers like Vite
- Reorder exports conditions for better Node.js interop
- Add unpkg and jsdelivr fields for CDN support
