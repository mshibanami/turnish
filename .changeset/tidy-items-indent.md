---
"turnish": patch
---

Fix nested lists losing their indentation when wrapped in a block element (e.g. `<li><div><ul>…</ul></div></li>`), and indent list-item lines that merely look like list markers (e.g. inside code blocks)
