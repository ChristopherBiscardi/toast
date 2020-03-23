require("../module-aliases");
const { Command, flags } = require("@oclif/command");
const { existsSync, promises: fs } = require("fs");
const path = require("path");
const {
  transformComponentForBrowser,
  transformComponentForNode
} = require("../transforms");
const beeline = require("honeycomb-beeline")({
  writeKey: process.env.HONEYCOMB_WRITE_KEY || "no write key",
  dataset: "serverless"
  // transmission: process.env.HONEYCOMB_TRANSMISSION || null //"writer"
});

class ShakeCommand extends Command {
  constructor(argv, config) {
    super(argv, config);
    this.trace = beeline.startTrace({
      commandId: this.id
    });
  }
  async finally(err) {
    await super.finally(err);
    beeline.finishTrace(this.trace);
  }
  async run() {
    let span = beeline.startSpan();
    const { flags } = this.parse(ShakeCommand);
    beeline.addContext({ flags: flags });
    const siteDir = process.cwd();
    const cacheDir = path.resolve(siteDir, ".cache");
    const publicDir = path.resolve(siteDir, "public");
    // const pluginDir = path.resolve(siteDir, "public/data/sector");
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.mkdir(publicDir, { recursive: true });

    let pages = [];
    const createPage = async ({
      // actual code string
      module: mod,
      // resulting page slug
      slug,
      // data to insert into the html page
      data
    }) => {
      const browserComponentPath = path.resolve(publicDir, `${slug}.js`);
      const pageDataPath = path.resolve(publicDir, `${slug}.json`);
      const nodeComponentPath = path.resolve(cacheDir, `${slug}.js`);
      await Promise.all([
        fs.mkdir(path.dirname(browserComponentPath), { recursive: true }),
        fs.mkdir(path.dirname(pageDataPath), { recursive: true }),
        fs.mkdir(path.dirname(nodeComponentPath), { recursive: true })
      ]);
      // push created pages into the pages cache so we can operate on
      // them later in `bake`
      pages.push({
        slug,
        browserComponentPath,
        nodeComponentPath,
        pageDataPath
      });
      await Promise.all([
        // compile module and write out browserComponent to public/
        // browser-runnable JS, minus web module imports
        transformComponentForBrowser(mod).then(browserComponent =>
          fs.writeFile(browserComponentPath, browserComponent.code, "utf-8")
        ),

        // write out data file to public/
        fs.writeFile(pageDataPath, JSON.stringify(data), "utf-8"),

        // compile module and write out node component to cache
        // node-requireable component
        transformComponentForNode(mod).then(nodeComponent =>
          fs.writeFile(nodeComponentPath, nodeComponent.code, "utf-8")
        )
      ]);
      return {
        browserComponentPath,
        nodeComponentPath,
        pageDataPath
      };
    };

    // run a toast data processing lifecycle.
    const toastFile = path.resolve(siteDir, "toast.js");
    let toast = {};
    try {
      toast = require(toastFile);
    } catch (e) {
      console.log(e);
      this.log("no lifecycles found in", path.resolve(siteDir, "toast.js"));
      // no lifecycles defined
    }
    beeline.addContext({ lifecycles: Object.keys(toast) });

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
          return fetchPromise.then(data =>
            // yes we're writing files, we should probably be writing individual
            // nodes to a database to approximate a production dynamo instance
            fs.writeFile(dataFile, JSON.stringify(data), "utf-8")
          );
        }
      };

      const sourceDataSpan = beeline.startSpan({ lifecycle: "sourceData" });
      await toast.sourceData({ createPage, withCache }).then(() => {
        return fs.writeFile(
          path.resolve(cacheDir, "pages.json"),
          JSON.stringify(pages),
          "utf-8"
        );
      });
      beeline.finishSpan(sourceDataSpan);
    }

    this.log(`Shook.`);
    beeline.finishSpan(span);
  }
}

ShakeCommand.description = `The part before the bake.

* Fetch data
* Prepare dependencies (run snowpack)
`;

ShakeCommand.flags = {
  //   name: flags.string({ char: "n", description: "name to print" })
};

module.exports = ShakeCommand;
