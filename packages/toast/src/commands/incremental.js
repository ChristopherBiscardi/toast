require("../module-aliases");
const { Command, flags } = require("@oclif/command");
const { existsSync, promises: fs } = require("fs");
const path = require("path");
const globby = require("globby");
const {
  transformComponentForBrowser,
  transformComponentForNode,
} = require("../transforms");
const { render } = require("../page-renderer-pre");
const beeline = require("honeycomb-beeline")({
  writeKey: process.env.HONEYCOMB_WRITE_KEY || "no write key",
  dataset: "serverless",
  // transmission: process.env.HONEYCOMB_TRANSMISSION  || null
});

class IncrementalCommand extends Command {
  constructor(argv, config) {
    super(argv, config);
    this.trace = beeline.startTrace({
      commandId: this.id,
    });
  }
  async finally(err) {
    await super.finally(err);
    beeline.finishTrace(this.trace);
  }
  async run() {
    // const { flags } = this.parse(IncrementalCommand);
    beeline.addContext({ flags: flags });
    const siteDir = process.cwd();
    const cacheDir = path.resolve(siteDir, ".cache");
    const publicDir = path.resolve(siteDir, "public");
    // const pluginDir = path.resolve(siteDir, "public/data/sector");
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.mkdir(publicDir, { recursive: true });

    const pageWrapperPath = path.resolve(cacheDir, "src/page-wrapper");
    // require user's page wrapper component
    let pageWrapper;
    const browserPageWrapperPath = "/src/page-wrapper.js";
    // const PageWrapper = require("./.cache/page-wrapper");

    // require the user's toastFile. TBD what is included in this file
    const toastFile = path.resolve(siteDir, "toast.js");
    let toast = {};
    try {
      toast = require(toastFile);
    } catch (e) {
      // if we didn't find toast.js, that's fine we don't technically need one
      // and should still inform the user we didn't find one in case they
      // were expecting one to be found.
      if (e.code === "MODULE_NOT_FOUND" && e.message.endsWith("toast.js'")) {
        console.log("No toast.js file detected");
      } else {
        // if the problem is anything else, throw it so the user knows
        throw e;
      }
    }
    beeline.addContext({ lifecycles: Object.keys(toast) });

    const srcFiles = await globby(["src/**/*.js"]);
    beeline.addContext({ numSrcFiles: srcFiles.length });
    const files = await Promise.all(
      srcFiles.map(async (filepath) => {
        const fullFilePath = path.resolve(siteDir, filepath);
        const fileContents = await fs.readFile(fullFilePath, "utf-8");
        const browserComponent = await transformComponentForBrowser(
          fileContents
        );
        const browserComponentPath = path.resolve(publicDir, filepath);
        // make sure directory to put file in exists
        // then put file there
        await fs
          .mkdir(path.dirname(browserComponentPath), { recursive: true })
          .then(() =>
            fs.writeFile(browserComponentPath, browserComponent.code, "utf-8")
          );

        const nodeComponent = await transformComponentForNode(fileContents);
        const nodeComponentPath = path.resolve(cacheDir, filepath);
        await fs
          .mkdir(path.dirname(nodeComponentPath), { recursive: true })
          .then(() =>
            fs.writeFile(nodeComponentPath, nodeComponent.code, "utf-8")
          );

        return { filepath, nodeComponentPath, browserComponentPath };
      })
    );
    try {
      pageWrapper = require(pageWrapperPath).default;
    } catch (e) {
      this.log("no user pagewrapper supplied");
    }

    const createPage = async ({
      // actual code string
      module: mod,
      // resulting page slug
      slug,
      // data to insert into the html page
      data = {},
    }) => {
      const browserComponentPath = path.resolve(publicDir, `${slug}.js`);
      const pageDataPath = path.resolve(publicDir, `${slug}.json`);
      const nodeComponentPath = path.resolve(cacheDir, `${slug}.js`);
      await Promise.all([
        fs.mkdir(path.dirname(browserComponentPath), { recursive: true }),
        fs.mkdir(path.dirname(pageDataPath), { recursive: true }),
        fs.mkdir(path.dirname(nodeComponentPath), { recursive: true }),
      ]);

      await Promise.all([
        // compile module and write out browserComponent to public/
        // browser-runnable JS, minus web module imports
        transformComponentForBrowser(mod).then((browserComponent) =>
          fs.writeFile(browserComponentPath, browserComponent.code, "utf-8")
        ),

        // write out data file to public/
        fs.writeFile(pageDataPath, JSON.stringify(data), "utf-8"),

        // compile module and write out node component to cache
        // node-requireable component
        transformComponentForNode(mod).then((nodeComponent) =>
          fs.writeFile(nodeComponentPath, nodeComponent.code, "utf-8")
        ),
      ]);

      return render({
        component: require(nodeComponentPath).default,
        pageWrapper,
        browserPageWrapperPath,
        data,
        browserComponentPath: browserComponentPath.replace(
          path.resolve(process.cwd(), "public/"),
          ""
        ),
        browserDataPath:
          browserComponentPath.replace(
            path.resolve(process.cwd(), "public/"),
            ""
          ) + "on",
      }).then((html) => {
        const htmlFilePath = path.resolve(publicDir, `${slug}.html`);
        return fs.writeFile(htmlFilePath, html);
      });
    };

    if (toast.sourceData) {
      const withCache = async (namespace, fetchPromise) => {
        const dataFile = path.resolve(cacheDir, `${namespace}.json`);
        const exists = existsSync(dataFile);
        if (exists) {
          this.log("exists for", namespace);
          return undefined;
        } else {
          this.log("fetching", namespace);
          // fetchPromise is where createPage calls happen in user/plugin land
          return fetchPromise.then((data) =>
            // yes we're writing files, we should probably be writing individual
            // nodes to a database to approximate a production dynamo instance
            fs.writeFile(dataFile, JSON.stringify(data), "utf-8")
          );
        }
      };

      const sourceDataSpan = beeline.startSpan({ lifecycle: "sourceData" });
      await toast.sourceData({ createPage, withCache });
      beeline.finishSpan(sourceDataSpan);
    }

    // Bake start

    if (toast.prepData) {
      await toast.prepData({ cacheDir, publicDir });
    }

    // do additional processing for src/pages
    await Promise.all(
      files
        .filter(({ filepath }) => filepath.startsWith("src/pages"))
        .map(({ filepath, nodeComponentPath, browserComponentPath }) => {
          // read in page data json file if it exists
          const dataPath = path.resolve(publicDir, `${filepath}on`);
          let data = {};
          try {
            data = require(dataPath);
            // this.log("required dataPath:", dataPath);
          } catch (e) {
            // data path doesn't exist. Some things won't have data, it's fine.
          }

          // write html out for page

          return render({
            component: require(nodeComponentPath).default,
            pageWrapper,
            data,
            browserPageWrapperPath,
            browserComponentPath: browserComponentPath.replace(
              path.resolve(process.cwd(), "public/"),
              ""
            ),
            browserDataPath:
              browserComponentPath.replace(
                path.resolve(process.cwd(), "public/"),
                ""
              ) + "on",
          }).then((html) => {
            // write HTML file out for page
            const htmlFilePath = path.resolve(
              publicDir,
              filepath.replace("src/pages/", "").replace(".js", ".html")
            );
            return fs.writeFile(htmlFilePath, html);
          });
        })
    );

    // copy page-renderer client into public/
    await fs
      .mkdir(path.resolve(publicDir, "toast"), { recursive: true })
      .then(() =>
        fs.copyFile(
          path.resolve(
            path.dirname(path.dirname(require.resolve("toast"))),
            "static/toast/page-renderer.js"
          ),
          path.resolve(publicDir, "toast/page-renderer.js")
        )
      );

    const staticFiles = await globby(["static/**/*.*"]);
    beeline.addContext({ numStaticFiles: staticFiles.length });
    await Promise.all(
      staticFiles.map(async (filepath) => {
        const destPath = filepath.replace("static/", "public/");
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(filepath, destPath);
        return filepath;
      })
    );

    this.log(`Baked`);
  }
}

IncrementalCommand.description = `Incremental your application

* Don't bundle
* Render HTML
`;

IncrementalCommand.flags = {
  // name: flags.string({ char: "n", description: "name to print" })
};

module.exports = IncrementalCommand;
