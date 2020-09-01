const fs = require("fs").promises;
const slugify = require("@sindresorhus/slugify");
const mdx = require("@mdx-js/mdx");
const util = require("util");
const vm = require("vm");
const {
  transformComponentForBrowser,
  transformComponentForNode
} = require("toast/src/transforms");

exports.sourceData = async ({ createPage, ...options }) => {
  const files = await fs.readdir("./src/pages");

  return Promise.all(
    files
      .filter(name => name.endsWith("mdx"))
      .map(async filename => {
        const file = await fs.readFile(`./src/pages/${filename}`, "utf-8");
        let compiledMDX;
        try {
          compiledMDX = await mdx(file, {});
        } catch (e) {
          console.log(e);
          throw e;
        }
        const component = await transformComponentForNode(compiledMDX);
        const context = { exports: {} };
        vm.createContext(context);
        const script = new vm.Script(component.code);
        script.runInNewContext(context);
        const meta = (context.exports && context.exports.meta) || {};
        console.log(meta, context);

        meta.slug = filename.replace(/\.mdx$/, "");
        // remove leading and trailing slashes
        meta.slug = meta.slug.replace(/^\//, "").replace(/\/$/, "");

        await createPage({
          module: `/** @jsx mdx */
            import {mdx} from '@mdx-js/preact';
            ${compiledMDX}`,
          slug: meta.slug,
          data: { ...meta }
        });
        // console.log(meta);
        // writeDataFile
        return {
          // id,
          // content,
          ...meta
        };
      })
  );
};
