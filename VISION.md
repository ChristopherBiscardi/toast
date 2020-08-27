# Toast Vision

Toast is

- Understandable
- JAMStack/Serverless

### Understandable

We are moving away from leaning heavily on webpack and other systems that can be
so complex as to be very intimidating. Toast code should be well-commented,
preferring simplicity to complexity, and when we require complexity it should be
adequately abstracted.

### JAMStack/Serverless

We view JAMStack and Serverless as operationalized approaches to building
products that are very similar in nature. We don't think of either as a specific
stack or technology but rather the processes by which results are achieved. This
informs our view of Devops later in this document.

## Assumptions the project makes:

The future is

- [ESModules](#esmodules)
- [Serverless](#serverless)
- [Unbundled-by-default](#unbundled-by-default)

### ESModules

Tools like Rollup, Snowpack, Deno, and others have adopted ESModules as their
default over CommonJS. Modern browsers already support ESModules and dynamic
imports natively. HTTP2 introduced "multiple files down one pipe" and is widely
supported while HTTP3 will improve upon this and has started making it's way
into browsers (Chrome and Firefox).

### Serverless

While there are complex and powerful tools that exist

Serverless itself doesn't necessarily refer to functions and lambdas alone, but
rather extends the philosophy that leads to a low-ops approach to building and
maintaining production infrastructure. This is a particularly good fit for the
JAMStack community, which often

### Unbundled by default

Tools like webpack are powerful and complex. There are meta-frameworks that
choose to lean heavily into taking advantage of these tools, which adds more
complexity on top. We feel that end of the spectrum is well occupied and
seek to come at the problem of shipping JS performantly from the other
perspective: Unbundled by default.

This approach allows us to take advantage of the browser's native ESModule
support, dynamic imports, and other features in a way that reduces the overall
complexity of the applications we ship.

## What we believe

- **Build performance is table-stakes** JS by nature tends to have longer builds
  than other ecosystems. The more you publish and push the more slow builds
  hurt. Therefore build performance is not an "add on", it is table stakes.
- **Dev ops practices are critical** The continuous delivery of both code _and_
  data is critical to supporting high-performing teams with stable production
  environments that can ship on a Friday without fear.
- **Building together is better than building apart** There are a great many
  projects and products in the ecosystem. From Vue and Gridsome to Svelte and
  Sapper, React has many too. We believe that there is enough room for everyone.
  Similar to how Rome can build opinionated tooling because Babel exists, we are
  not the first meta-framework and won't be the last. As a restult, we may point
  you to a project better suited for your needs. We also hope that the work we
  do will help provide other projects with more room to focus on their
  differentiating factors

## What are we _not_ doing?

Toast is a JAMStack meta-framework. This means we will not:

- implement our own React/Vue/Svelte/etc
- implement our own serverless deployment solution
