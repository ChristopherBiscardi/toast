const fs = require("fs").promises;
const fsReg = require("fs");
const slugify = require("@sindresorhus/slugify");
const mdx = require("@mdx-js/mdx");
const util = require("util");
const vm = require("vm");
const rehypePrism = require("rehype-prism-mdx");
const rehypeSlug = require("rehype-slug");
const rehypeLink = require("rehype-autolink-headings");
const parse = require("rehype-parse");
const unified = require("unified");

const {
  transformComponentForBrowser,
  transformComponentForNode
} = require("toast/src/transforms");

const corgi = fsReg.readFileSync("./corgi.svg");

const parseSvg = unified().use(parse, {
  emitParseErrors: true,
  duplicateAttribute: false
});

// { [Function: processor]
//   data: [Function: data],
//   freeze: [Function: freeze],
//   attachers: [ [ [Function: parse], [Object] ] ],
//   use: [Function: use],
//   parse: [Function: parse],
//   stringify: [Function: stringify],
//   run: [Function: run],
//   runSync: [Function: runSync],
//   process: [Function: process],
//   processSync: [Function: processSync] }

let parsedCorgi;
try {
  parsedCorgi = parseSvg.runSync(parseSvg.parse(corgi)).children[0].children[1]
    .children;
} catch (e) {
  console.log(e);
}

exports.sourceData = async ({ createPage, ...options }) => {
  // console.log("sourceData");
  const files = await fs.readdir("../../content/posts");

  return Promise.all(
    files
      .filter(name => name.endsWith("mdx"))
      .map(async filename => {
        // console.log("filename", filename);
        const file = await fs.readFile(
          `../../content/posts/${filename}`,
          "utf-8"
        );
        let compiledMDX;
        // console.log("compiled");
        try {
          compiledMDX = await mdx(file, {
            // remarkPlugins: [codeblocks],
            rehypePlugins: [
              rehypePrism,
              rehypeSlug,
              [
                rehypeLink,
                {
                  properties: {
                    style: "position: absolute; right: calc(100% + 5px);"
                  },
                  content: {
                    type: "element",
                    tagName: "corgilink",
                    properties: { className: ["corgi-heading-link"] },
                    children: []
                    // children: [parsedCorgi]
                  }
                }
              ]
            ]
          });
        } catch (e) {
          console.log(e);
          throw e;
        }
        const component = await transformComponentForNode(compiledMDX);
        const context = { exports: {} };
        vm.createContext(context);
        const script = new vm.Script(component.code);
        script.runInNewContext(context);
        const { meta } = context.exports || {};
        //   let slug;
        if (!meta.slug && meta.title) {
          meta.slug = slugify(meta.title);
        }
        if (!meta.slug) {
          throw new Error("No slug found for", filename);
        }

        // remove leading and trailing slashes
        meta.slug = meta.slug.replace(/^\//, "").replace(/\/$/, "");
        if (!meta.slug.match(/^\d\d\d\d/)) {
          // console.log("replacing");
          meta.slug = "post/" + meta.slug;
          // console.log(meta.slug);
        }

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
