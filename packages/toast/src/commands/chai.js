require("../module-aliases");
const { Command, flags } = require("@oclif/command");
const { existsSync, promises: fs } = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { init, parse } = require("es-module-lexer");
const beeline = require("honeycomb-beeline")({
  writeKey: process.env.HONEYCOMB_WRITE_KEY,
  dataset: "serverless"
  // transmission: "writer"
});
const WebdependenciesAliases = require("../babel/babel-plugin-webdependencies-aliases");

class ChaiCommand extends Command {
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
    const { flags } = this.parse(ChaiCommand);
    beeline.addContext({ flags: flags });
    const siteDir = process.cwd();
    const cacheDir = path.resolve(siteDir, ".cache");
    const publicDir = path.resolve(siteDir, "public");
    const srcDir = path.resolve(siteDir, "src");
    // const pluginDir = path.resolve(siteDir, "public/data/sector");
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.mkdir(publicDir, { recursive: true });
    // await es-module-lexer wasm boot
    await init;
    // run a toast data processing lifecycle.
    const toastFile = path.resolve(siteDir, "toast.js");
    let toast = {};
    try {
      toast = require(toastFile);
    } catch (e) {
      // no lifecycles defined
    }
    beeline.addContext({ lifecycles: Object.keys(toast) });

    this.log("Starting Watcher...");
    // { /public/src/pages/index.js: hash}
    const fileHashes = {};
    const watcher = chokidar.watch(
      [path.resolve(siteDir, "src/pages") /*cacheDir, publicDir, srcDir*/],
      {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
      }
    );
    watcher
      .on("add", async (path, stats) => {
        console.log(stats);
        this.log(`${path.replace(process.cwd(), "")} has been added`);
        if (path.endsWith(".js") && path.includes("src/pages")) {
          const contents = await fs.readFile(path, "utf-8");
          console.log(contents);
          const [imports, exports] = parse(`import one from 'two'`);
          console.log(imports);
        }
      })
      .on("change", (path, stats) =>
        this.log(`File ${path} has been changed`, stats)
      )
      .on("unlink", path => this.log(`File ${path} has been removed`));

    // More possible events.
    watcher
      .on("addDir", path => this.log(`Directory ${path} has been added`))
      .on("unlinkDir", path => this.log(`Directory ${path} has been removed`))
      .on("error", error => this.log(`Watcher error: ${error}`))
      .on("ready", () => this.log("Initial scan complete. Ready for changes"));
    beeline.finishSpan(span);
  }
}

ChaiCommand.description = `Brew some chai and get developing.

* watches files, does stuff
`;

ChaiCommand.flags = {
  //   name: flags.string({ char: "n", description: "name to print" })
};

module.exports = ChaiCommand;
