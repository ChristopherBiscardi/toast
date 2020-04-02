---
"@sector/toast": patch
---

Process src/pages files _after_ all other src files. This is a hacky way to
maintain ordering. In the future we could make this a tree of promise awaits
ordered by import dependency.
