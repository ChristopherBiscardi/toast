# Toast Architecture

Toast's mental model is best thought of as "many small apps". Compared to other approaches that are a monolithic JS bundles that need to be split, Toast JavaScript is naturally split by default due to the nature of ESModules. This leads to an interesting mental model where we can individually build a single HTML file from a single piece of data or code change without needing to create "choke points" like wrapping everything up in a single giant bundle.

Toast is roughly split into the following phases, which are representated by corresponding CLI commands.

- Shake
- Bake

These are not the final names of these phases. I needed something to name them that wouldn't convey any information other than: first you shake, then you bake. Shake and Bake.

## Shake

`toast shake` is a command that triggers the fetching of remote data. This is where sources for Sector, Airtable, wherever, are triggered. Fetching data should be side-effect free (no writing to the filesystem, etc). This is because it is easier to parallelize and queue pure operations (more on pipelines in the [Pipelines RFC doc](./rfc/001-pipelines.md)).

## Bake

`toast bake` takes the data fetched by Shake and handles creating page-specific JS entries, page data JSON files, and rendering out HTML files. Bake runs a process that uses preact currently, but there is no reason that we have to make everyone use preact in the future.

## Effects on Performance

Toast can be used with or without a client-side JS "bundle" on any given page. Without any additional JS, you're serving an HTML page and the performance is based on the size and resources embedded and linked to from that page. The performance profile of a Toast site's client-side JS is determined mainly by the depth of the import tree. This is notably different than the performance profile of bundled applications, which focus a lot more of the size of the total bundle.

Since the depth of the import tree is important, a user can use link rel=preload to chop the import tree depth at a specific point in the tree, reducing the impact of many serial imports.
