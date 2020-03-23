var moduleAlias = require("module-alias");

moduleAlias.addAliases({
  react: "preact/compat",
  "react-dom": "preact/compat"
  //   'create-react-class': path.resolve(__dirname, './create-preact-class')
});
