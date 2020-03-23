const declare = require(`@babel/helper-plugin-utils`).declare;

module.exports = declare((api, options) => {
  api.assertVersion(7);
  const importMap = options.importMap || { react: "preact/compat" };
  return {
    visitor: {
      ImportDeclaration(path) {
        if (importMap[path.node.source.value]) {
          path.node.source.value = importMap[path.node.source.value];
        }
      }
    }
  };
});
