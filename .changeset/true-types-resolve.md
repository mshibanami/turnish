---
"turnish": patch
---

Fix the type declarations for TypeScript projects that do not use `moduleResolution: "bundler"`: they now resolve under `node16`/`nodenext` and the classic `node` resolution, and `require('turnish')` is typed as the constructor it returns
