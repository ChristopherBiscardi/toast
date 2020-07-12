const renderToString = require("preact-render-to-string");
const preact = require("preact");
const { h } = preact;
const Highlight = require("prism-react-renderer");
const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/index");
const prismComponents = require("prismjs/components");
const visit = require("unist-util-visit");
const rangeParser = require("parse-numeric-range");

try {
  // meta doesn't exist in the prismjs package and thus will *FAIL* because it's a FAILURE
  loadLanguages(
    Object.keys(prismComponents.languages).filter(v => v !== "meta")
  );
} catch (e) {
  // this is here in case prismjs ever removes a language, so we can easily debug
  console.log(e);
}

const prismTheme = {
  plain: {
    color: "#d6deeb",
    backgroundColor: "#011627"
  },
  styles: [
    {
      types: ["changed"],
      style: {
        color: "rgb(162, 191, 252)",
        fontStyle: "italic"
      }
    },
    {
      types: ["deleted"],
      style: {
        color: "rgba(239, 83, 80, 0.56)",
        fontStyle: "italic"
      }
    },
    {
      types: ["inserted", "attr-name"],
      style: {
        color: "rgb(173, 219, 103)",
        fontStyle: "italic"
      }
    },
    {
      types: ["comment"],
      style: {
        color: "rgb(99, 119, 119)",
        fontStyle: "italic"
      }
    },
    {
      types: ["string", "url"],
      style: {
        color: "rgb(173, 219, 103)"
      }
    },
    {
      types: ["variable"],
      style: {
        color: "rgb(214, 222, 235)"
      }
    },
    {
      types: ["number"],
      style: {
        color: "rgb(247, 140, 108)"
      }
    },
    {
      types: ["builtin", "char", "constant", "function"],
      style: {
        color: "rgb(130, 170, 255)"
      }
    },
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ["punctuation"],
      style: {
        color: "rgb(199, 146, 234)"
      }
    },
    {
      types: ["selector", "doctype"],
      style: {
        color: "rgb(199, 146, 234)",
        fontStyle: "italic"
      }
    },
    {
      types: ["class-name"],
      style: {
        color: "rgb(255, 203, 139)"
      }
    },
    {
      types: ["tag", "operator", "keyword"],
      style: {
        color: "rgb(127, 219, 202)"
      }
    },
    {
      types: ["boolean"],
      style: {
        color: "rgb(255, 88, 116)"
      }
    },
    {
      types: ["property"],
      style: {
        color: "rgb(128, 203, 196)"
      }
    },
    {
      types: ["namespace"],
      style: {
        color: "rgb(178, 204, 214)"
      }
    }
  ]
};

const RE = /{([\d,-]+)}/;
const calculateLinesToHighlight = meta => {
  if (RE.test(meta)) {
    const strlineNumbers = RE.exec(meta)[1];
    const lineNumbers = rangeParser(strlineNumbers);
    // console.log(lineNumbers);
    return index => lineNumbers.includes(index + 1);
  } else {
    return () => false;
  }
};

module.exports = options => ast => {
  visit(ast, "element", tree => {
    if (tree.tagName === "code") {
      // store codestring for later
      tree.properties.codestring = tree.children[0].value;
      const shouldHighlightLine = calculateLinesToHighlight(
        tree.properties.metastring
      );

      const lang =
        tree.properties.className &&
        tree.properties.className[0] &&
        tree.properties.className[0].split("-")[1];
      const highlightedCode = renderToString(
        h(
          Highlight.default,
          {
            ...Highlight.defaultProps,
            ...{
              code: tree.children[0].value.trim(),
              language: lang,
              theme: prismTheme,
              Prism
            }
          },
          ({ className, style, tokens, getLineProps, getTokenProps }) =>
            h(
              "pre",
              {
                className: className,
                style: { ...style, "background-color": "transparent" }
              },
              tokens.map((line, i) =>
                h(
                  "div",

                  getLineProps({
                    line,
                    key: i,
                    style: shouldHighlightLine(i)
                      ? {
                          borderLeft: "1px solid red",
                          backgroundColor: "hsla(220, 26%, 13%, 1)",
                          margin: "0 -2rem",
                          padding: "0 2rem",
                          borderLeft: "1px solid rgba(51,183,255,.41)"
                        }
                      : {}
                  }),

                  line.map((token, key) =>
                    h(
                      "span",
                      getTokenProps({
                        token,
                        key
                      })
                    )
                  )
                )
              )
            )
        )
      );
      // console.log(highlightedCode);
      // render code to string
      tree.children = [
        {
          value: highlightedCode,
          type: "text"
        }
      ];
      // console.log(tree);
    }
    // console.log(tree);
    // tree.type = "codeblock";
  });
  // return ast;
};
