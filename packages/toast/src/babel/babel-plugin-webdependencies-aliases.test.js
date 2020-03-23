const Plugin = require(`./babel-plugin-webdependencies-aliases`);

const babel = require(`@babel/core`);

const testContents = `import React from "react";`;

describe(`babel-plugin-pluck-imports`, () => {
  test(`plucks imports`, () => {
    const instance = new Plugin();
    const result = babel.transform(testContents, {
      configFile: false,
      plugins: [instance.plugin]
    });

    expect(result.code).toEqual(`import React from "preact/compat";`);
  });
});
