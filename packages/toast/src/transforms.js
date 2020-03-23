const { transformAsync } = require("@babel/core");
const path = require("path");
// const WebdependenciesAliases = require("./babel/babel-plugin-webdependencies-aliases");

module.exports.transformComponentForBrowser = mod =>
  transformAsync(mod, {
    babelrc: false,
    presets: [`@babel/preset-react`],
    plugins: [
      `babel-plugin-preval`,
      `babel-plugin-transform-inline-environment-variables`,
      `@babel/plugin-proposal-class-properties`,
      [
        "snowpack/assets/babel-plugin.js",
        {
          importMap: path.resolve(
            process.cwd(),
            "public/web_modules/import-map.json"
          )
        }
      ]
    ]
  });

module.exports.transformComponentForNode = mod =>
  transformAsync(mod, {
    babelrc: false,
    presets: [
      [`@babel/preset-env`, { targets: { node: "current" } }],
      `@babel/preset-react`
    ],
    plugins: [`babel-plugin-preval`]
    // plugins: [WebdependenciesAliases]
  });
