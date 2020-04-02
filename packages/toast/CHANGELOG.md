# @sector/toast

## 0.0.4

### Patch Changes

- 4ec3529: Process src/pages files _after_ all other src files. This is a hacky
  way to maintain ordering. In the future we could make this a tree of promise
  awaits ordered by import dependency.

## 0.0.3

### Patch Changes

- 782a867: Ship /static (and thus page-renderer) with npm package

## 0.0.2

### Patch Changes

- 60d78ad: Add initial incremental build command
