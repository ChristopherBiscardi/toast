# toast

## 0.2.9

### Patch Changes

- 09163cd: convert windows paths when using in the browser

## 0.2.8

### Patch Changes

- 111f4ab: Make a better error message when a toastfile isn't found (or is)

## 0.2.7

### Patch Changes

- d232208: fix import in bake temporarily

## 0.2.6

### Patch Changes

- 8f87f57: switch to sector/babel plugin

## 0.2.5

### Patch Changes

- df2b7ed: Temporarily re-order src/\*_/_.js files to be handled before any rendering
  happens

## 0.2.4

### Patch Changes

- c69206d: Require pageWrapper when it's actually required

## 0.2.3

### Patch Changes

- 7a9179d: only glob for files with extensions

## 0.2.2

### Patch Changes

- 6e724d8: remove references to old packagename

## 0.2.1

### Patch Changes

- d1c72fc: Takeover the toast package name

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
