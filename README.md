# Toast

The best place to stack your JAM.

---

Current stability status: somewhere between a yeet and a yolo

---

## About Toast

Toast is a modern, ESModules-first, site compiler. It avoids bundlers completely
by default (although you can integrate bundlers if you need to).

You can read about the high level [vision](./VISION.md) or the current
[goals](./GOALS.md) of the project.

##### What types of sites is Toast useful for?

We don't know yet. It's mostly being used for blogs currently.

##### What browsers does Toast support?

Notably the use of browser-native features like ESModules in the default
client-side JavaScript
[means no IE 11 support](https://caniuse.com/#feat=es6-module).

## Getting Started

The following command will bootstrap a new toast app for you.

```sh
yarn create toast
```

## Thanks

- [Rust](https://www.rust-lang.org/)
  - for their [RFC process](https://github.com/rust-lang/rfcs), which heavily
    informed ours
- [John Otander](https://twitter.com/4lpine)
  - for their work on MDX
- [Fred Schott](https://twitter.com/FredKSchott)
  - for their work on [Snowpack](https://www.snowpack.dev/)
- [Preact](https://preactjs.com/)
- [Rollup](https://github.com/rollup)
