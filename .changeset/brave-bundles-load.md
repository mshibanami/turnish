---
"turnish": patch
---

Fix the documented ways of loading the package: `require('turnish')`, `import Turnish from 'turnish'` in Node ESM and the `Turnish` browser global now all provide the constructor, and the ES module builds no longer call `require()`
