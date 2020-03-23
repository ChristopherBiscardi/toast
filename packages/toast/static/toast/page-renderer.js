/* @jsx jsx */

async function renderPage() {
  const promises = [
    import(window.componentPath),
    window.wrapperComponentPath
      ? import(window.wrapperComponentPath)
      : undefined,
    window.dataPath
      ? fetch(window.dataPath).then(response => {
          return response.json();
        })
      : {},
    import("/web_modules/preact.js")
  ];

  let pageWrapper = ({ children }) => h("div", null, children);
  const [
    PageModule,
    PageWrapperModule,
    pageData,
    { render, h }
  ] = await Promise.all(promises);
  const Page = PageModule.default;
  pageWrapper = PageWrapperModule ? PageWrapperModule.default : undefined;

  render(
    h(pageWrapper, pageData, h(Page, pageData)),
    document.getElementById("toast-page-section")
  );
}

renderPage();
