require("../module-aliases");
const { Command, flags } = require("@oclif/command");
const fs = require("fs").promises;
const path = require("path");
const globby = require("globby");
const {
  transformComponentForBrowser,
  transformComponentForNode
} = require("../transforms");
const { render } = require("../page-renderer-pre");
const beeline = require("honeycomb-beeline")({
  writeKey: process.env.HONEYCOMB_WRITE_KEY || "no write key",
  dataset: "serverless"
  // transmission: process.env.HONEYCOMB_TRANSMISSION  || null
});

class BakeCommand extends Command {
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
    // const { flags } = this.parse(BakeCommand);
    const siteDir = process.cwd();
    const cacheDir = path.resolve(siteDir, ".cache");
    const publicDir = path.resolve(siteDir, "public");

    const pageWrapperPath = path.resolve(cacheDir, "src/page-wrapper");
    // require user's page wrapper component
    let pageWrapper;
    try {
      pageWrapper = require(pageWrapperPath).default;
    } catch (e) {
      this.log("no user pagewrapper supplied");
    }
    const browserPageWrapperPath = "/src/page-wrapper.js";
    const pages = require(path.resolve(cacheDir, "pages.json"));
    beeline.addContext({ numPages: pages.length });
    // const PageWrapper = require("./.cache/page-wrapper");

    // run a toast data processing lifecycle.
    // TBD: how do we know that people have done processing here
    // so that we can track it back to build individual data bundles...
    // or do we yeet it and just re-run this processing step every time
    // then check the data files after.
    const toastFile = path.resolve(siteDir, "toast.js");
    let toast = {};
    try {
      toast = require(toastFile);
    } catch (e) {
      // no lifecycles defined
    }

    if (toast.prepData) {
      await toast.prepData({ cacheDir, publicDir });
    }

    const srcFiles = await globby(["src/**/*.js"]);
    beeline.addContext({ numSrcFiles: srcFiles.length });
    const files = await Promise.all(
      srcFiles.map(async filepath => {
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
    const srcPagesFiles = files.filter(({ filepath }) =>
      filepath.startsWith("src/pages")
    );
    beeline.addContext({ numSrcPages: srcPagesFiles.length });
    await Promise.all(
      srcPagesFiles.map(
        async ({ filepath, nodeComponentPath, browserComponentPath }) => {
          // read in page data json file if it exists
          const dataPath = path.resolve(publicDir, `${filepath}on`);
          let data = {};
          try {
            data = require(dataPath);
            this.log("required dataPath:", dataPath);
          } catch (e) {
            // data path doesn't exist. Some things won't have data, it's fine.
          }

          // write HTML file out for page
          const htmlFilePath = path.resolve(
            publicDir,
            filepath.replace("src/pages/", "").replace(".js", ".html")
          );

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
              ) + "on"
          }).then(html => fs.writeFile(htmlFilePath, html));
        }
      )
    );

    // render pages from pages.json
    await Promise.all(
      pages.map(
        async ({
          slug,
          browserComponentPath,
          nodeComponentPath,
          pageDataPath
        }) => {
          // read in page data json file if it exists
          let data = {};
          try {
            data = require(pageDataPath);
          } catch (e) {
            // data path doesn't exist. Some things won't have data, it's fine.
          }
          const htmlFilePath = path.resolve(publicDir, `${slug}.html`);

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
              ) + "on"
          }).then(html => fs.writeFile(htmlFilePath, html));
        }
      )
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

    const staticFiles = await globby(["static/**/*"]);
    beeline.addContext({ numStaticFiles: staticFiles.length });
    await Promise.all(
      staticFiles.map(async filepath => {
        const destPath = filepath.replace("static/", "public/");
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(filepath, destPath);
        return filepath;
      })
    );

    this.log(`Baked`);
  }
}

BakeCommand.description = `Bake your application

* Don't bundle
* Render HTML
`;

BakeCommand.flags = {
  // name: flags.string({ char: "n", description: "name to print" })
};

module.exports = BakeCommand;
