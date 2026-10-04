---
"turnish": patch
---

Fix block elements inside inline wrappers (e.g. `<li><span><ul>…</ul></span></li>`) being flattened into inline text, and keep such lists nested
