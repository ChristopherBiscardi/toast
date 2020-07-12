/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import { Helmet } from "react-helmet";
import { MDXProvider } from "@mdx-js/preact";
import { Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";

const maxWidth = "800px";
const textColor = "rgba(255, 255, 255, 0.86)";

const nav = [
  { displayName: "Garden", url: "/garden" },
  { displayName: "Party Corgi", url: "https://partycorgi.com" },
  { displayName: "Discord", url: "https://discord.gg/S9Gdagv" },
  {
    displayName: "Newsletter",
    url: "https://pages.convertkit.com/04c24646a3/c136f814fc",
  },
];

const navLinkStyles = {
  color: "#eef1f7",
  fontWeight: 250,
  fontSize: ".9rem",
  textDecoration: "none",
};

const prismTheme = {
  plain: {
    color: "#d6deeb",
    backgroundColor: "#011627",
  },
  styles: [
    {
      types: ["changed"],
      style: {
        color: "rgb(162, 191, 252)",
        fontStyle: "italic",
      },
    },
    {
      types: ["deleted"],
      style: {
        color: "rgba(239, 83, 80, 0.56)",
        fontStyle: "italic",
      },
    },
    {
      types: ["inserted", "attr-name"],
      style: {
        color: "rgb(173, 219, 103)",
        fontStyle: "italic",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "rgb(99, 119, 119)",
        fontStyle: "italic",
      },
    },
    {
      types: ["string", "url"],
      style: {
        color: "rgb(173, 219, 103)",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "rgb(214, 222, 235)",
      },
    },
    {
      types: ["number"],
      style: {
        color: "rgb(247, 140, 108)",
      },
    },
    {
      types: ["builtin", "char", "constant", "function"],
      style: {
        color: "rgb(130, 170, 255)",
      },
    },
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ["punctuation"],
      style: {
        color: "rgb(199, 146, 234)",
      },
    },
    {
      types: ["selector", "doctype"],
      style: {
        color: "rgb(199, 146, 234)",
        fontStyle: "italic",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "rgb(255, 203, 139)",
      },
    },
    {
      types: ["tag", "operator", "keyword"],
      style: {
        color: "rgb(127, 219, 202)",
      },
    },
    {
      types: ["boolean"],
      style: {
        color: "rgb(255, 88, 116)",
      },
    },
    {
      types: ["property"],
      style: {
        color: "rgb(128, 203, 196)",
      },
    },
    {
      types: ["namespace"],
      style: {
        color: "rgb(178, 204, 214)",
      },
    },
  ],
};

const Header = (props) => (
  <header
    css={{
      display: "flex",
      height: "75px",
      maxWidth,
      margin: "auto",
      marginTop: "30px",
      flexWrap: "wrap",
    }}
  >
    <div>
      <a href="/" css={{ display: "flex", flex: 1, marginTop: "7px" }}>
        <img src="/toast.jpg" />
      </a>
    </div>
    <nav css={{ display: "flex", flex: 1 }}>
      <ul
        css={{
          listStyleType: "none",
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
          flexWrap: "wrap",
          padding: 0,
          marginTop: "-2px",
        }}
      >
        {nav.map(({ displayName, url }) => {
          return (
            <li
              key={displayName + url}
              css={{ marginLeft: "2rem", marginTop: "18px" }}
            >
              <a href={url} css={navLinkStyles}>
                {displayName}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  </header>
);

const headingStyles = {
  gridColumn: 2,
  marginTop: "2rem",
  fontFamily: "Inter, system-ui, sans-serif", // "InterDisplay var",
  letterSpacing: "-1px",
  fontWeight: 700,
  color: "#eef1f7",
  position: "relative",
};

const ProgressBar = (props) => {
  const getIndicatorPercentageWidth = (currentPos, totalScroll) => {
    return (currentPos / totalScroll) * 100;
  };

  // find the total height of window
  const getScrollHeight = () => {
    // https://javascript.info/size-and-scroll-window#width-height-of-the-document
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  };

  const [scrollPositionPecentage, setScrollPositionPercentage] = useState(0);
  useEffect(() => {
    // add throttled listener to update on scroll
    let scrolling = false;
    window.addEventListener(`scroll`, () => {
      const currentPos = window.scrollY;
      const { innerHeight } = window;
      const scrollHeight = getScrollHeight();
      const scrollDistance = scrollHeight - innerHeight;

      if (!scrolling) {
        window.requestAnimationFrame(() => {
          const indicatorWidth = getIndicatorPercentageWidth(
            currentPos,
            scrollDistance
          );

          setScrollPositionPercentage(indicatorWidth);

          scrolling = false;
        });
        scrolling = true;
      }
    });

    const { innerHeight } = window;
    const scrollHeight = getScrollHeight();
    const scrollDistance = scrollHeight - innerHeight;
    const indicatorWidth = getIndicatorPercentageWidth(
      window.scrollY,
      scrollDistance
    );

    setScrollPositionPercentage(indicatorWidth);
  }, []);

  return (
    <progress
      css={{
        zIndex: 1,
        position: "fixed",
        top: 0,
        width: "100%",
        left: 0,
        height: 5,
        appearance: "none",
        background: "#11151da6",
        // "linear-gradient(124deg,#ff24004a,#e81d1d4a,#e8b71d4a,#e3e81d4a,#1de8404a,#1ddde84a,#2b1de84a,#dd00f34a,#dd00f34a)",
        opacity: 1,
        "&::-webkit-progress-value": {
          background:
            "linear-gradient(124deg,#ff2400,#e81d1d,#e8b71d,#e3e81d,#1de840,#1ddde8,#2b1de8,#dd00f3,#dd00f3)",
          backgroundSize: "100vw",
          opacity: 0.4,
        },
        "&::-webkit-progress-bar": {
          // background: "#11151d",
          background: "transparent",
          opacity: 1,
        },
        "&::-moz-progress-bar": {
          background:
            "linear-gradient(124deg,#ff2400,#e81d1d,#e8b71d,#e3e81d,#1de840,#1ddde8,#2b1de8,#dd00f3,#dd00f3)",
          backgroundSize: "100vw",
          opacity: 0.4,
        },
      }}
      value={scrollPositionPecentage}
      max="100"
    >
      70 %
    </progress>
  );
};

const CopyButton = (props) => {
  const [buttonText, setText] = useState("Copy");
  return (
    <button
      css={{
        color: textColor,
        backgroundColor: "#11151da6",
        transition: "background-color 1s cubic-bezier(.27,1.35,.83,.67)",
        float: "right",
        padding: "1rem",
        "&:hover": {
          backgroundColor: "rgba(51,183,255,.21)",
        },
      }}
      onClick={(e) => {
        navigator.clipboard.writeText(props.content);
        setText("Done");
        setTimeout(() => {
          setText("Copy");
        }, 1000);
      }}
    >
      {buttonText}
    </button>
  );
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `wait` milliseconds.
const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
const Tweetable = () => {
  const [tweetableText, setTweetableText] = useState();
  useEffect(() => {
    // event fires for every selection change
    document.onselectionchange = debounce(() => {
      // toString on the Selection object gives you the selected text
      const text = document.getSelection().toString();
      setTweetableText(text);
    }, 200);
  });
  return tweetableText ? (
    <div
      css={{
        zIndex: 1,
        position: "fixed",
        top: "5px",
        display: "flex",
        flex: 1,
        width: "100%",
        background: "#10151e",
        justifyContent: "center",
        color: "#eef1f7",
        borderBottom: "1px solid rgba(51,183,255,.21)",
      }}
    >
      <div css={{ maxWidth: 400, display: "flex", flexDirection: "column" }}>
        <p css={{ paddingTop: "1rem" }}>{tweetableText}</p>
        <a
          href={
            "https://twitter.com/intent/tweet?text=" +
            encodeURI(tweetableText + " " + window.location.href)
          }
          css={{ color: "#1DA1F2", alignSelf: "flex-end", padding: "1rem" }}
        >
          Tweet this
        </a>
      </div>
    </div>
  ) : null;
};
export default ({ children, ...props }) => {
  let title = "Chris Biscardi's Digital Garden";
  let description = "JAMStack, Serverless, MDX, and more";
  if (props.title) {
    title = props.title;
    description = "";
  }
  return (
    <div>
      <ProgressBar />
      <Tweetable />
      <Global
        styles={{
          "*": {
            boxSizing: "border-box",
            margin: 0,
            padding: 0,
            border: "0 solid #ffffff22",
          },

          html: {
            fontSize: 20,
            background: "#19202c",
            fontFamily: "Inter, system-ui, sans-serif",
          },
          "@media (max-width: 959px)": {
            html: {
              fontSize: 17,
            },
          },
          body: {
            minHeight: "100vh",
          },
        }}
      />
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>Chris Biscardi's Digital Garden</title>
        <meta name="twitter:title" content={title} />
        <meta name="og:title" content={title} />
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="og:type" content="website" />
        <meta name="twitter:site" content="@chrisbiscardi" />
        <meta name="twitter:creator" content="@chrisbiscardi" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:image"
          content={
            props.title
              ? encodeURI(
                  `https://opengraph.sector.tools/chris?title=${props.title}${
                    props.tags ? "&tags=" + props.tags.join(",") : ""
                  }${
                    props.contentType && props.contentType === "note"
                      ? "&budding=true"
                      : ""
                  }`
                )
              : encodeURI(
                  `https://opengraph.sector.tools/chris?title=Chris' Digital Garden`
                )
          }
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&amp;display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header />
      {props.title && (
        <div
          css={{
            maxWidth: "57ch",
            margin: "auto",
            "@media screen and (max-width: 57ch)": {
              marginLeft: "1rem",
              marginRight: "1rem",
            },
          }}
        >
          <h1
            css={{
              color: "rgba(255, 255, 255, 0.95)",
              fontSize: 48,
              marginTop: "2rem",
            }}
          >
            {props.title}
          </h1>
          <hr
            css={{
              height: 3,
              width: 60,
              marginTop: "2rem",
              border: "none",
              background: `linear-gradient(90deg, rgba(251,89,74,1) 0%,
            rgba(251,89,74,1)   25%, rgba(251,222,75,1)  25%,
            rgba(251,222,75,1)  50%, rgba(112,228,112,1) 50%,
            rgba(112,228,112,1) 75%, rgba(51,183,255,1)  75%)`,
            }}
          />
        </div>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 500 510"
        css={{ display: "none" }}
      >
        <defs>
          <g id="corgi">
            <g clip-path="url(#clip0)">
              <path
                fill="#C4C4C4"
                d="M448 272h-16v8h-8v8h8v8h8v8h8v-32zM96 48V24h8v16h8v8h8v8h8v16h8v8h8v16h8v8h8v8h-16v8h-8v8h-8v8h-8v8h-8v40h-8v-24h-8v-8H80v8h-8v8h-8v-16h8v-16h8v-16h16v-8h8V96h8V72h-8V48h-8zM168 128v-8h40v-8h16v-8h16v-8h24v-8h16v-8h16v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h8v8h16v24h8v40h8v16h-8v24h-8v8h-8v8h-8v8h-8v8h-16v8h-24v-8h-8v-32h-8v-16h-8v-8h-16v-8h-8v-8h-8v-56h8v-24h8v-8h8zM56 176h8v16h-8v8h24v8H64v8H48v16h-8v16h-8v-40h8v-16h8v-8h8v-8zM88 368h-8v16h8v16h32v-16h-8v-24H88v8z"
              />
              <path
                fill="#C4C4C4"
                d="M216 416h-8v-8h8v-8h8v-8h8v-8h8v-8h8v-16h8v-8h8v-16h8v-16h8v-24h8v-40h24v8h24v8h64v8h16v8h8v8h8v8h8v24h8v64h16v24h-8v8h-8v8h-8v8h-56v-16h-8v-64h-8v64H264v32h-24v8h-24v-48z"
              />
              <path
                fill="#7D261D"
                d="M296 192h8v8h-8zM304 184h8v8h-8zM312 176h8v8h-8zM312 168h8v8h-8zM320 160h8v8h-8zM320 152h8v8h-8zM328 144h8v8h-8zM328 136h8v8h-8zM336 128h8v8h-8zM336 120h8v8h-8zM336 112h8v8h-8zM336 104h8v8h-8zM344 96h8v8h-8zM344 88h8v8h-8zM344 80h8v8h-8zM344 72h8v8h-8zM336 64h8v8h-8zM328 64h8v8h-8zM320 64h8v8h-8zM312 64h8v8h-8zM312 72h8v8h-8zM304 72h8v8h-8zM304 64h8v8h-8zM296 72h8v8h-8zM296 80h8v8h-8zM288 88h8v8h-8zM280 96h8v8h-8zM272 104h8v8h-8zM264 112h8v8h-8zM256 120h8v8h-8zM248 128h8v8h-8zM240 136h8v8h-8zM248 144h8v8h-8zM256 144h8v8h-8zM264 152h8v8h-8zM264 160h8v8h-8zM264 168h8v8h-8zM272 176h8v8h-8zM272 184h8v8h-8zM272 192h8v8h-8zM272 200h8v8h-8zM272 208h8v8h-8zM288 208h8v8h-8zM280 216h8v8h-8zM280 224h8v8h-8zM280 232h8v8h-8zM288 240h8v8h-8zM296 248h8v8h-8zM304 248h8v8h-8zM312 256h8v8h-8zM320 256h8v8h-8zM328 256h8v8h-8zM336 264h8v8h-8zM344 264h8v8h-8zM352 264h8v8h-8zM360 264h8v8h-8zM368 264h8v8h-8zM376 264h8v8h-8zM384 264h8v8h-8zM392 264h8v8h-8zM400 272h8v8h-8zM408 272h8v8h-8zM416 272h8v8h-8zM424 272h8v8h-8zM432 264h8v8h-8zM440 264h8v8h-8zM448 272h8v8h-8zM448 280h8v8h-8zM448 288h8v8h-8zM448 296h8v8h-8zM416 280h8v8h-8zM424 288h8v8h-8zM432 296h8v8h-8zM440 304h8v8h-8zM440 312h8v8h-8zM440 320h8v8h-8zM448 328h8v8h-8zM448 336h8v8h-8zM448 344h8v8h-8zM448 352h8v8h-8zM448 360h8v8h-8zM448 368h8v8h-8zM448 376h8v8h-8zM448 384h8v8h-8zM456 384h8v8h-8zM464 392h8v8h-8zM464 400h8v8h-8zM464 408h8v8h-8zM464 416h8v8h-8zM464 424h8v8h-8zM464 432h8v8h-8zM464 440h8v8h-8zM464 448h8v8h-8zM464 456h8v8h-8zM456 464h8v8h-8zM448 464h8v8h-8zM440 464h8v8h-8zM432 456h8v8h-8zM424 448h8v8h-8zM424 440h8v8h-8zM416 440h8v8h-8zM408 440h8v8h-8zM400 440h8v8h-8zM392 440h8v8h-8zM384 440h8v8h-8zM376 432h8v8h-8zM376 424h8v8h-8zM368 416h8v8h-8zM360 424h8v8h-8zM352 424h8v8h-8zM344 424h8v8h-8zM336 424h8v8h-8zM328 424h8v8h-8zM320 424h8v8h-8zM312 424h8v8h-8zM304 424h8v8h-8zM296 424h8v8h-8zM288 424h8v8h-8zM280 424h8v8h-8zM272 424h8v8h-8zM264 424h8v8h-8zM264 432h8v8h-8zM264 440h8v8h-8zM264 448h8v8h-8zM264 456h8v8h-8zM264 464h8v8h-8zM264 472h8v8h-8zM264 480h8v8h-8zM256 488h8v8h-8zM248 496h8v8h-8zM240 496h8v8h-8zM232 496h8v8h-8zM224 488h8v8h-8zM216 480h8v8h-8zM216 472h8v8h-8zM208 464h8v8h-8zM208 456h8v8h-8zM208 448h8v8h-8zM208 440h8v8h-8zM208 432h8v8h-8zM208 424h8v8h-8zM208 416h8v8h-8zM200 424h8v8h-8zM192 424h8v8h-8zM184 424h8v8h-8zM176 424h8v8h-8zM168 424h8v8h-8zM160 416h8v8h-8zM152 416h8v8h-8zM144 408h8v8h-8zM136 408h8v8h-8zM128 400h8v8h-8zM120 400h8v8h-8zM120 392h8v8h-8zM120 384h8v8h-8zM112 376h8v8h-8zM112 368h8v8h-8zM112 360h8v8h-8zM112 352h8v8h-8zM112 344h8v8h-8zM112 336h8v8h-8zM112 328h8v8h-8zM104 328h8v8h-8zM96 328h8v8h-8zM88 320h8v8h-8zM80 312h8v8h-8zM72 304h8v8h-8zM64 296h8v8h-8zM56 288h8v8h-8zM48 280h8v8h-8zM40 272h8v8h-8zM40 264h8v8h-8zM32 256h8v8h-8zM32 248h8v8h-8zM56 224h8v8h-8zM56 232h8v8h-8zM56 240h8v8h-8zM64 248h8v8h-8zM72 248h8v8h-8zM80 248h8v8h-8zM80 256h8v8h-8zM80 264h8v8h-8zM80 272h8v8h-8zM80 280h8v8h-8zM80 288h8v8h-8zM88 296h8v8h-8zM96 304h8v8h-8zM104 304h8v8h-8zM112 296h8v8h-8zM120 288h8v8h-8zM128 280h8v8h-8zM128 272h8v8h-8zM128 264h8v8h-8zM136 264h8v8h-8zM144 264h8v8h-8zM152 256h8v8h-8zM160 256h8v8h-8zM168 256h8v8h-8zM168 248h8v8h-8zM168 240h8v8h-8zM168 208h8v8h-8zM168 200h8v8h-8zM168 192h8v8h-8zM168 184h8v8h-8zM176 176h8v8h-8zM176 184h8v8h-8zM176 192h8v8h-8zM176 200h8v8h-8zM176 208h8v8h-8zM176 216h8v8h-8zM184 216h8v8h-8zM192 216h8v8h-8zM192 224h8v8h-8zM200 224h8v8h-8zM200 216h8v8h-8zM208 224h8v8h-8zM208 216h8v8h-8zM208 208h8v8h-8zM208 200h8v8h-8zM208 192h8v8h-8zM200 192h8v8h-8zM200 184h8v8h-8zM192 176h8v8h-8zM184 176h8v8h-8zM120 256h8v8h-8zM112 256h8v8h-8zM104 248h8v8h-8zM96 240h8v8h-8zM88 240h8v8h-8zM88 232h8v8h-8zM88 224h8v8h-8zM88 216h8v8h-8zM64 224h8v8h-8zM24 240h8v8h-8zM24 232h8v8h-8zM24 224h8v8h-8zM24 216h8v8h-8zM24 208h8v8h-8zM32 200h8v8h-8zM32 192h8v8h-8zM40 184h8v8h-8zM48 176h8v8h-8zM56 168h8v8h-8zM64 168h8v8h-8zM64 176h8v8h-8zM64 184h8v8h-8zM64 192h8v8h-8zM72 192h8v8h-8zM80 192h8v8h-8zM88 184h8v8h-8zM96 184h8v8h-8zM96 176h8v8h-8zM96 168h8v8h-8zM96 160h8v8h-8zM88 160h8v8h-8zM88 152h8v8h-8zM80 152h8v8h-8zM80 160h8v8h-8zM72 160h8v8h-8zM56 192h8v8h-8zM56 160h8v8h-8zM56 152h8v8h-8zM64 144h8v8h-8zM64 136h8v8h-8zM56 128h8v8h-8zM72 128h8v8h-8zM72 120h8v8h-8zM80 112h8v8h-8zM88 112h8v8h-8zM96 104h8v8h-8zM96 96h8v8h-8zM104 88h8v8h-8zM104 80h8v8h-8zM104 72h8v8h-8zM96 64h8v8h-8zM96 56h8v8h-8zM96 48h8v8h-8zM88 40h8v8h-8zM88 32h8v8h-8zM88 24h8v8h-8zM56 120h8v8h-8zM56 112h8v8h-8zM56 104h8v8h-8zM56 96h8v8h-8zM56 88h8v8h-8zM56 80h8v8h-8zM56 72h8v8h-8zM64 64h8v8h-8zM64 56h8v8h-8zM64 48h8v8h-8zM64 40h8v8h-8zM72 32h8v8h-8zM72 24h8v8h-8zM80 16h8v8h-8zM88 16h8v8h-8zM96 16h8v8h-8zM104 24h8v8h-8zM104 32h8v8h-8zM112 40h8v8h-8zM120 48h8v8h-8zM128 56h8v8h-8zM128 64h8v8h-8zM136 72h8v8h-8zM144 80h8v8h-8zM144 88h8v8h-8zM152 96h8v8h-8zM160 104h8v8h-8zM168 104h8v8h-8zM176 104h8v8h-8zM184 112h8v8h-8zM192 112h8v8h-8zM200 112h8v8h-8zM208 104h8v8h-8zM216 104h8v8h-8zM224 96h8v8h-8zM232 96h8v8h-8zM240 88h8v8h-8zM248 88h8v8h-8zM256 88h8v8h-8zM264 80h8v8h-8zM272 80h8v8h-8zM280 72h8v8h-8zM288 72h8v8h-8zM112 400h8v8h-8zM104 400h8v8h-8zM96 400h8v8h-8zM88 400h8v8h-8zM80 408h8v8h-8zM72 408h8v8h-8zM64 408h8v8h-8zM56 408h8v8h-8zM48 408h8v8h-8zM40 400h8v8h-8zM40 392h8v8h-8zM40 384h8v8h-8zM40 376h8v8h-8zM48 368h8v8h-8zM56 368h8v8h-8zM64 360h8v8h-8zM72 360h8v8h-8zM80 360h8v8h-8zM88 352h8v8h-8zM96 352h8v8h-8zM104 352h8v8h-8zM368 408h8v8h-8zM368 400h8v8h-8zM368 392h8v8h-8zM368 384h8v8h-8zM368 376h8v8h-8zM368 368h8v8h-8zM368 360h8v8h-8zM288 200h8v8h-8z"
              />
              <path
                fill="#ED1C24"
                fill-rule="evenodd"
                d="M104 24h-8v24h8v24h8v8h8v-8h8V56h-8v-8h-8v-8h-8V24z"
                clip-rule="evenodd"
              />
              <path
                fill="#FF4726"
                fill-rule="evenodd"
                d="M128 72h-8v8h-8v16h-8v16h-8v8H80v16h-8v16h-8v16h8v-8h8v-8h16v8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h16v-8h-8v-8h-8V80h-8v-8h-8zM56 200h8v8h-8v8h-8v8h-8v16h-8v-32h8v-16h8v-8h8v-8h8v16h-8v8z"
                clip-rule="evenodd"
              />
              <path
                fill="#FF7F27"
                fill-rule="evenodd"
                d="M208 112h8v8h-8v-8zm0 8v8h-8v8h-8v8h-8v8h-8v8h-7v8h-8v8h-8v8h-8v-24h7v-24h8v-8h8v-8h40zm-104 32h8v32h-8v-32zm-48 56h8v8h-8v-8zm8 0v-8h16v8H64zm-16 16h-8v8h8v-8zm-16 16h8v8h-8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#FDB102"
                fill-rule="evenodd"
                d="M280 80h16v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h8v16h-8v8h-8v8h-8v8h-8v8h-8v-8h-8v-8h-24v8h-8v32h8v8h8v8h-24v-8h-8v-8h-8v-32h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h16v-8h24v-8h16v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#FFF200"
                fill-rule="evenodd"
                d="M264 152h-16v8h-8v8h-8v8h-8v8h-8v48h-24v-8h-8v8h-8v8h8v16h8v16h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-24h-8v-24zM104 360H88v8h-8v16h8v-8h8v-8h8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#DFEA1A"
                fill-rule="evenodd"
                d="M272 200h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v16h8v8h24v-8h16v-8h8v-8h8v-8h8v-8h8v-24h8v-16h-8v-16zM112 384h8v16H88v-24h8v-8h8v-8h8v24z"
                clip-rule="evenodd"
              />
              <path
                fill="#B5E61D"
                fill-rule="evenodd"
                d="M288 256h24v8h24v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v-24h8v-40zm-8 64v8h-8v-8h8z"
                clip-rule="evenodd"
              />
              <path
                fill="#01E791"
                fill-rule="evenodd"
                d="M328 272h72v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v-40h-8v-8h8v-8h8v-8h8v-8h8v-8h8v-16h8v-8h8v-16h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#00A2E8"
                fill-rule="evenodd"
                d="M394-554h-72v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8H2v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8H826v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8H394zm-82 914h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h24v8h8v8h8v8h8v24h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-8v-24h-8v40h-8v8h-8v8h-8v8h-80v32h-24v8h-24v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8zm128-56v-8h-8v-8h-8v-8h8v-8h16v32h-8zM250-546v-8H-38v288h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8z"
                clip-rule="evenodd"
              />
              <path
                fill="#7D27E7"
                fill-rule="evenodd"
                d="M432 328h16v64h-8v8h-8v8h-8v8h-8v8h-8v8h-8v8h-16v-16h-8v-40h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8h8v-8zm-88 88h8v-8h8v-8h8v24h-24v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#A349A4"
                fill-rule="evenodd"
                d="M464 392h-24v8h-8v8h-8v8h-8v8h-8v8h-8v8h40v-8h8v-8h8v-8h8v-24z"
                clip-rule="evenodd"
              />
              <path
                fill="#fff"
                fill-rule="evenodd"
                d="M144 112h40v8h-16v8h-8v8h-8v24h-8v56h8v8h8v8h16v8h-8v16h-16v8h-24v-8h-16v-8h-8v-8h-8v-24h24v-16h-8v-8h-8v-8h8v-40h8v-8h8v-8h8v-8h8v-8zm-40 80v8h-8v-8h8zm-40 56h24v-48h-8v8H64v8H48v16h-8v32h8v16h8v8h8v8h8v8h8v8h8v8h8v8h24v56h8v16h8v8h16v8h16v8h40v-16h8v-8h8v-8h8v-8h8v-8h8v-16h8v-8h8v-16h8v-16h8v-24h8v-40h8v-8h-8v-8h-8v-8h-8v24h-8v8h-8v8h-8v8h-8v8h-16v8h-24v-8h-8v-32h-8v-16h-8v24h-24v8h-16v16h-8v8h-8v8h-8v8H96v-8h-8v-8h-8v-40H64v-8zm0 0v-16h8v-8H56v24h8zm32-80H80v8h16v-8zm88 16h16v8h-16v-8zm80 272h-24v8h-24v8h8v16h8v8h24v-8h8v-32zM120 280h-8v8h8v-8zm-32 0h8v8h-8v-8zm-8 96v-8H64v8H48v32h40v-24h-8v-8zm384 40h-8v8h-8v8h-8v8h-8v16h8v8h24v-48z"
                clip-rule="evenodd"
              />
              <path
                fill="#F79893"
                fill-rule="evenodd"
                d="M288 104h-8v8h-8v8h-8v8h-8v8h-8v8h16v8h8v-8h8v-16h8v-24z"
                clip-rule="evenodd"
              />
              <path
                fill="#F69C97"
                fill-rule="evenodd"
                d="M296 88h8v24h-8v32h-8v16h-8v8h-8v-24h8v-16h8V96h8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#F6A39E"
                fill-rule="evenodd"
                d="M304 112h-8v24h8v-24zm-8 32h-8v8h8v-8zm-16 16h8v8h-8v-8zm0 8v8h-8v-8h8z"
                clip-rule="evenodd"
              />
              <path
                fill="#F5ADA9"
                fill-rule="evenodd"
                d="M304 80h8v40h-8V80zm0 56h-8v8h8v-8zm-16 16h8v16h-8v-16zm0 16v8h-8v-8h8z"
                clip-rule="evenodd"
              />
              <path
                fill="#F4BCB9"
                fill-rule="evenodd"
                d="M312 120h-8v8h8v-8zm-16 24h8v8h-8v-8zm0 24h-8v8h-8v8h8v-8h8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#F3CAC8"
                fill-rule="evenodd"
                d="M336 72h8v32h-8v32h-8v16h-8v16h-8v16h-8v8h-8v8h-8v16h-8v-32h8v-8h8v-24h8v-24h8V80h8v-8h16z"
                clip-rule="evenodd"
              />
              <path
                fill="#F79893"
                fill-rule="evenodd"
                d="M104 72H88v32h-8v8h16V96h8V72z"
                clip-rule="evenodd"
              />
              <path
                fill="#F69C97"
                fill-rule="evenodd"
                d="M96 64h-8v8h8v-8zm-8 32h-8v8h8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#F69C97"
                fill-rule="evenodd"
                d="M96 64h-8v8h8v-8zm-8 32h-8v8h8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#F6A39E"
                fill-rule="evenodd"
                d="M96 56h-8v8h8v-8zm-8 32h-8v8h8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#F5ADA9"
                fill-rule="evenodd"
                d="M96 48h-8v8h8v-8zM80 80h8v8h-8v-8zm-8 32h8v8h-8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#F4BCB9"
                fill-rule="evenodd"
                d="M88 72h-8v8h8v-8zm-8 32h-8v8h8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#F3CAC8"
                fill-rule="evenodd"
                d="M88 24h-8v16h-8v32h-8v64h8v-32h8V72h8V24z"
                clip-rule="evenodd"
              />
              <path
                fill="#CD5962"
                fill-rule="evenodd"
                d="M88 248h16v8h8v8h16v8h-16v8h-8v-8h-8v-8h-8v-16zm16 32v16h-8v-16h8z"
                clip-rule="evenodd"
              />
              <path
                fill="#ED8480"
                fill-rule="evenodd"
                d="M96 264h-8v16h16v16h-8v-8h-8v8h8v8h16v-8h8v-8h8v-16h-16v8h-8v-8h-8v-8zm16 16h8v8h-8v-8z"
                clip-rule="evenodd"
              />
              <path
                fill="#000"
                fill-rule="evenodd"
                d="M72 168h8v8h16v8h-8v8H72v-24zm24 32v-8h-8v24h32v-16h-8v-8h-8v8h-8zm104-8h-16v24h24v-16h-8v-8z"
                clip-rule="evenodd"
              />
              <mask id="a" fill="#fff">
                <path
                  fill-rule="evenodd"
                  d="M152 264h6c6.392 4.5 17.39 11.996 26.97 18.527l.004.002c7.24 4.935 13.67 9.318 16.69 11.438 1.696 1.191 3.252 2.165 4.677 3.057 5.941 3.72 9.583 6 11.464 16.537 2.031 11.371-3.08 24.228-4.499 27.796-.211.531-.34.856-.352.941l-.013.087c-.087.6-.14.96.572 1.406.374.233 7.181 4.639 13.991 9.047l.008.005c6.81 4.408 13.619 8.815 13.992 9.048l.297.19c.535.346.797.516 1.196.277.094-.056.315-.266.67-.604 1.42-1.348 4.988-4.735 11.179-8.54 7.745-4.758 15.302-6.158 20.62-5.598 4.857.511 22.179 12.349 35.576 21.504l3.703 2.529c3.196 2.177 7.91 5.358 13.295 8.993l.002.001c17.685 11.934 42.618 28.761 44.882 31.025 2.954 2.953 6.816 9.996 3.749 27.49-3.067 17.494-17.267 37.488-28.286 48.052-11.019 10.565-23.628 13.859-28.286 14.2-4.263.312-9.382-2.992-18.754-9.041l-.007-.005c-.866-.559-1.768-1.141-2.709-1.746-11.132-7.156-51.232-34.193-58.616-39.418a352.056 352.056 0 00-4.844-3.342c-7.125-4.862-15.752-10.748-18.217-14.948-3.067-5.225-2.953-12.836-1.59-22.378 1.275-8.927 5.416-16.613 6.78-19.147.095-.174.175-.324.241-.449 1.021-1.928.908-2.042 0-2.496-.45-.225-5.793-3.693-11.407-7.337-5.696-3.697-11.671-7.576-13.099-8.433-2.837-1.702-2.95-1.702-3.631-1.021l-.119.119-.094.094c-1.259 1.269-6.506 6.556-9.885 9.09-3.63 2.723-11.346 8.509-19.514 9.984-7.685 1.388-10.139-.136-15.607-3.533l-.003-.002c-.344-.214-.699-.435-1.069-.662-3.587-2.214-8.139-5.287-13.296-8.769-3.83-2.586-7.994-5.398-12.345-8.25-10.211-6.694-50.683-33.854-58.136-39.66l-.66-.514c-6.882-5.349-8.292-6.445-8.837-19.63-.562-13.598 6.467-27.46 14.808-40.5 6.673-10.432 15.353-18.645 18.86-21.416H104v8h8v8h16v8h24v-8zm-16.023 14.114c-3.592-2.489-11.516-7.713-14.472-8.698-3.695-1.232-4.773-1.463-11.855 1.154-7.082 2.618-14.003 10.776-18.714 18.534-4.71 7.758-5.472 16.556-4.988 21.751.485 5.196 4.78 8.452 6.235 9.491 1.455 1.039 23.861 16.869 36.975 25.444 13.114 8.574 22.865 14.879 25.051 14.711 2.186-.168 9.247-2.101 11.517-3.278 1.816-.942 3.446-2.354 4.035-2.943-1.233-.644-4.203-2.723-6.221-5.884-2.522-3.951-3.951-10.004 0-16.561s10.088-8.49 13.787-8.322c2.959.134 7.397 1.905 9.247 2.774.252-1.85.605-6.355 0-9.583-.757-4.036-3.531-6.558-8.659-10.088-2.504-1.725-8.304-5.674-14.239-9.716a5370.489 5370.489 0 01-15.463-10.551 866.922 866.922 0 00-12.236-8.235zm210.899 153.521c.444 7.252-4.378 16.588-6.845 20.35-3.577 5.673-10.545 12.271-12.95 14.121-2.405 1.85-6.289 3.946-10.976 4.131-3.929.155-6.385-1.337-11.91-4.694-1.065-.647-2.243-1.363-3.568-2.15-6.955-4.132-29.123-19.529-40.325-27.309-2.007-1.393-3.661-2.543-4.814-3.339-1.158-.8-2.134-1.449-2.963-2-4.602-3.056-4.704-3.124-6.533-9.655-1.985-7.088.933-13.759 1.654-15.41.063-.144.11-.25.134-.314.29-.752 1.557-.419 2.884-.069l.261.069c1.419.37 8.51-.185 13.073-3.638 4.563-3.454 5.797-10.175 5.735-12.272-.027-.908-.331-2.418-.633-3.913-.394-1.956-.783-3.887-.539-4.411.398-.851 1.578-1.128 4.406-1.792l.774-.182c3.392-.801 5.612-.74 6.845-.37 1.233.37 17.02 10.607 24.234 15.293 6.233 4.049 24.198 16.287 31.957 21.572l2.822 1.923c4.625 3.144 6.722 4.994 7.277 14.059z"
                  clip-rule="evenodd"
                />
              </mask>
              <path
                fill="url(#paint0_linear)"
                fill-rule="evenodd"
                d="M152 264h6c6.392 4.5 17.39 11.996 26.97 18.527l.004.002c7.24 4.935 13.67 9.318 16.69 11.438 1.696 1.191 3.252 2.165 4.677 3.057 5.941 3.72 9.583 6 11.464 16.537 2.031 11.371-3.08 24.228-4.499 27.796-.211.531-.34.856-.352.941l-.013.087c-.087.6-.14.96.572 1.406.374.233 7.181 4.639 13.991 9.047l.008.005c6.81 4.408 13.619 8.815 13.992 9.048l.297.19c.535.346.797.516 1.196.277.094-.056.315-.266.67-.604 1.42-1.348 4.988-4.735 11.179-8.54 7.745-4.758 15.302-6.158 20.62-5.598 4.857.511 22.179 12.349 35.576 21.504l3.703 2.529c3.196 2.177 7.91 5.358 13.295 8.993l.002.001c17.685 11.934 42.618 28.761 44.882 31.025 2.954 2.953 6.816 9.996 3.749 27.49-3.067 17.494-17.267 37.488-28.286 48.052-11.019 10.565-23.628 13.859-28.286 14.2-4.263.312-9.382-2.992-18.754-9.041l-.007-.005c-.866-.559-1.768-1.141-2.709-1.746-11.132-7.156-51.232-34.193-58.616-39.418a352.056 352.056 0 00-4.844-3.342c-7.125-4.862-15.752-10.748-18.217-14.948-3.067-5.225-2.953-12.836-1.59-22.378 1.275-8.927 5.416-16.613 6.78-19.147.095-.174.175-.324.241-.449 1.021-1.928.908-2.042 0-2.496-.45-.225-5.793-3.693-11.407-7.337-5.696-3.697-11.671-7.576-13.099-8.433-2.837-1.702-2.95-1.702-3.631-1.021l-.119.119-.094.094c-1.259 1.269-6.506 6.556-9.885 9.09-3.63 2.723-11.346 8.509-19.514 9.984-7.685 1.388-10.139-.136-15.607-3.533l-.003-.002c-.344-.214-.699-.435-1.069-.662-3.587-2.214-8.139-5.287-13.296-8.769-3.83-2.586-7.994-5.398-12.345-8.25-10.211-6.694-50.683-33.854-58.136-39.66l-.66-.514c-6.882-5.349-8.292-6.445-8.837-19.63-.562-13.598 6.467-27.46 14.808-40.5 6.673-10.432 15.353-18.645 18.86-21.416H104v8h8v8h16v8h24v-8zm-16.023 14.114c-3.592-2.489-11.516-7.713-14.472-8.698-3.695-1.232-4.773-1.463-11.855 1.154-7.082 2.618-14.003 10.776-18.714 18.534-4.71 7.758-5.472 16.556-4.988 21.751.485 5.196 4.78 8.452 6.235 9.491 1.455 1.039 23.861 16.869 36.975 25.444 13.114 8.574 22.865 14.879 25.051 14.711 2.186-.168 9.247-2.101 11.517-3.278 1.816-.942 3.446-2.354 4.035-2.943-1.233-.644-4.203-2.723-6.221-5.884-2.522-3.951-3.951-10.004 0-16.561s10.088-8.49 13.787-8.322c2.959.134 7.397 1.905 9.247 2.774.252-1.85.605-6.355 0-9.583-.757-4.036-3.531-6.558-8.659-10.088-2.504-1.725-8.304-5.674-14.239-9.716a5370.489 5370.489 0 01-15.463-10.551 866.922 866.922 0 00-12.236-8.235zm210.899 153.521c.444 7.252-4.378 16.588-6.845 20.35-3.577 5.673-10.545 12.271-12.95 14.121-2.405 1.85-6.289 3.946-10.976 4.131-3.929.155-6.385-1.337-11.91-4.694-1.065-.647-2.243-1.363-3.568-2.15-6.955-4.132-29.123-19.529-40.325-27.309-2.007-1.393-3.661-2.543-4.814-3.339-1.158-.8-2.134-1.449-2.963-2-4.602-3.056-4.704-3.124-6.533-9.655-1.985-7.088.933-13.759 1.654-15.41.063-.144.11-.25.134-.314.29-.752 1.557-.419 2.884-.069l.261.069c1.419.37 8.51-.185 13.073-3.638 4.563-3.454 5.797-10.175 5.735-12.272-.027-.908-.331-2.418-.633-3.913-.394-1.956-.783-3.887-.539-4.411.398-.851 1.578-1.128 4.406-1.792l.774-.182c3.392-.801 5.612-.74 6.845-.37 1.233.37 17.02 10.607 24.234 15.293 6.233 4.049 24.198 16.287 31.957 21.572l2.822 1.923c4.625 3.144 6.722 4.994 7.277 14.059z"
                clip-rule="evenodd"
              />
              <path
                fill="#000"
                fill-rule="evenodd"
                d="M152 264h6c6.392 4.5 17.39 11.996 26.97 18.527l.004.002c7.24 4.935 13.67 9.318 16.69 11.438 1.696 1.191 3.252 2.165 4.677 3.057 5.941 3.72 9.583 6 11.464 16.537 2.031 11.371-3.08 24.228-4.499 27.796-.211.531-.34.856-.352.941l-.013.087c-.087.6-.14.96.572 1.406.374.233 7.181 4.639 13.991 9.047l.008.005c6.81 4.408 13.619 8.815 13.992 9.048l.297.19c.535.346.797.516 1.196.277.094-.056.315-.266.67-.604 1.42-1.348 4.988-4.735 11.179-8.54 7.745-4.758 15.302-6.158 20.62-5.598 4.857.511 22.179 12.349 35.576 21.504l3.703 2.529c3.196 2.177 7.91 5.358 13.295 8.993l.002.001c17.685 11.934 42.618 28.761 44.882 31.025 2.954 2.953 6.816 9.996 3.749 27.49-3.067 17.494-17.267 37.488-28.286 48.052-11.019 10.565-23.628 13.859-28.286 14.2-4.263.312-9.382-2.992-18.754-9.041l-.007-.005c-.866-.559-1.768-1.141-2.709-1.746-11.132-7.156-51.232-34.193-58.616-39.418a352.056 352.056 0 00-4.844-3.342c-7.125-4.862-15.752-10.748-18.217-14.948-3.067-5.225-2.953-12.836-1.59-22.378 1.275-8.927 5.416-16.613 6.78-19.147.095-.174.175-.324.241-.449 1.021-1.928.908-2.042 0-2.496-.45-.225-5.793-3.693-11.407-7.337-5.696-3.697-11.671-7.576-13.099-8.433-2.837-1.702-2.95-1.702-3.631-1.021l-.119.119-.094.094c-1.259 1.269-6.506 6.556-9.885 9.09-3.63 2.723-11.346 8.509-19.514 9.984-7.685 1.388-10.139-.136-15.607-3.533l-.003-.002c-.344-.214-.699-.435-1.069-.662-3.587-2.214-8.139-5.287-13.296-8.769-3.83-2.586-7.994-5.398-12.345-8.25-10.211-6.694-50.683-33.854-58.136-39.66l-.66-.514c-6.882-5.349-8.292-6.445-8.837-19.63-.562-13.598 6.467-27.46 14.808-40.5 6.673-10.432 15.353-18.645 18.86-21.416H104v8h8v8h16v8h24v-8zm-16.023 14.114c-3.592-2.489-11.516-7.713-14.472-8.698-3.695-1.232-4.773-1.463-11.855 1.154-7.082 2.618-14.003 10.776-18.714 18.534-4.71 7.758-5.472 16.556-4.988 21.751.485 5.196 4.78 8.452 6.235 9.491 1.455 1.039 23.861 16.869 36.975 25.444 13.114 8.574 22.865 14.879 25.051 14.711 2.186-.168 9.247-2.101 11.517-3.278 1.816-.942 3.446-2.354 4.035-2.943-1.233-.644-4.203-2.723-6.221-5.884-2.522-3.951-3.951-10.004 0-16.561s10.088-8.49 13.787-8.322c2.959.134 7.397 1.905 9.247 2.774.252-1.85.605-6.355 0-9.583-.757-4.036-3.531-6.558-8.659-10.088-2.504-1.725-8.304-5.674-14.239-9.716a5370.489 5370.489 0 01-15.463-10.551 866.922 866.922 0 00-12.236-8.235zm210.899 153.521c.444 7.252-4.378 16.588-6.845 20.35-3.577 5.673-10.545 12.271-12.95 14.121-2.405 1.85-6.289 3.946-10.976 4.131-3.929.155-6.385-1.337-11.91-4.694-1.065-.647-2.243-1.363-3.568-2.15-6.955-4.132-29.123-19.529-40.325-27.309-2.007-1.393-3.661-2.543-4.814-3.339-1.158-.8-2.134-1.449-2.963-2-4.602-3.056-4.704-3.124-6.533-9.655-1.985-7.088.933-13.759 1.654-15.41.063-.144.11-.25.134-.314.29-.752 1.557-.419 2.884-.069l.261.069c1.419.37 8.51-.185 13.073-3.638 4.563-3.454 5.797-10.175 5.735-12.272-.027-.908-.331-2.418-.633-3.913-.394-1.956-.783-3.887-.539-4.411.398-.851 1.578-1.128 4.406-1.792l.774-.182c3.392-.801 5.612-.74 6.845-.37 1.233.37 17.02 10.607 24.234 15.293 6.233 4.049 24.198 16.287 31.957 21.572l2.822 1.923c4.625 3.144 6.722 4.994 7.277 14.059z"
                clip-rule="evenodd"
              />
              <path
                fill="#fff"
                d="M213.93 342.53l.014-.091-1.98-.283a2.494 2.494 0 01-.013.085l1.979.289zm14.125 9.473l-.003-.002-.005-.003-1.087 1.679.003.002.005.003 1.087-1.679zm-79.562 36.244l.004.002 1.065-1.693-.004-.002-1.065 1.693zm152.305 104.957l.004.003.003.002 1.084-1.681a.008.008 0 00-.004-.002l-.003-.002-1.084 1.68zM194.745 372.567l.094-.095-1.419-1.409-.094.095 1.419 1.409zm-9.207-90.863l-.003-.003-1.129 1.651.004.003 1.128-1.651zM158 264l1.151-1.635-.518-.365H158v2zm-6 0v-2h-2v2h2zm0 8v2h2v-2h-2zm-16.023 6.114l-1.139 1.644.019.013.019.013 1.101-1.67zm-14.472-8.698l-.633 1.897.633-1.897zm44.221 87.807l-.921-1.776.921 1.776zm4.035-2.943l1.414 1.415 1.925-1.926-2.413-1.261-.926 1.772zm-6.221-5.884l-1.686 1.076 1.686-1.076zm13.787-24.883l.091-1.998-.091 1.998zm9.247 2.774l-.85 1.81 2.464 1.158.368-2.698-1.982-.27zm0-9.583l1.966-.369-1.966.369zm-8.659-10.088l1.134-1.648-1.134 1.648zm-29.702-20.267l1.135-1.647-1.135 1.647zM128 272h-2v2h2v-2zm0-8h2v-2h-2v2zm-16 0h-2v2h2v-2zm0-8h2v-2h-2v2zm-8 0h-2v2h2v-2zm0-8h2v-2h-2v2zm-15.65 0v-2h-.694l-.546.431L88.35 248zm-18.86 21.416l1.686 1.077-1.685-1.077zm-14.807 40.5l1.998-.083-1.998.083zm9.497 20.144l-1.23 1.578 1.23-1.578zm58.136 39.66l1.097-1.673-1.097 1.673zm25.641 17.019l-1.05 1.702 1.05-1.702zm16.679 4.197l-.356-1.968.356 1.968zm19.514-9.984l1.2 1.6-1.2-1.6zm10.098-9.303l-1.414-1.415-.001.001 1.415 1.414zm3.631 1.021l1.029-1.715-1.029 1.715zm24.506 15.77l.895-1.788-.895 1.788zm0 2.496l1.768.936-1.768-.936zm-7.021 19.596l1.98.283-1.98-.283zm1.59 22.378l1.725-1.012-1.725 1.012zm23.061 18.29l1.155-1.633-1.155 1.633zm58.616 39.418l-1.081 1.683 1.081-1.683zm21.47 10.792l-.146-1.995.146 1.995zm52.823-89.742l-1.414 1.414 1.414-1.414zm-58.179-40.019l1.126-1.653-1.126 1.653zm-39.279-24.033l.21-1.989-.21 1.989zm-20.62 5.598l1.048 1.704-1.048-1.704zm-11.849 9.144l-1.029-1.715 1.029 1.715zm-1.493-.467l-1.06 1.696 1.06-1.696zm-27.991-18.1l-1.06 1.696 1.06-1.696zm-.559-1.493l1.979.286.001-.004-1.98-.282zm4.851-28.737l-1.969.351 1.969-.351zm-16.141-19.594l-1.149 1.637 1.149-1.637zM63.52 329.546l1.227-1.579-1.227 1.579zm71.141 48.424l-1.119 1.657 1.119-1.657zm14.368 9.433l-1.064 1.693.009.006 1.055-1.699zm45.006-15.541l-1.419-1.409v.001l1.419 1.408zm16.943 9.241l1.089-1.678-1.089 1.678zm11.166 10.282l-1.76-.948 1.76.948zm13.027 56.473l-1.127 1.652 1.127-1.652zm66.176 44.511l1.084-1.681-1.084 1.681zm26.693-111.727l-1.118 1.658.01.007.011.007 1.097-1.672zm-16.998-11.522l-1.129 1.652 1.129-1.652zm-67.375-7.366l1.378 1.45-1.378-1.45zm-1.866.327l-1.087 1.679h.001l1.086-1.679zm-14.289-9.238l-1.088 1.678.001.001 1.087-1.679zm-14.571-10.458l1.979.289v-.002l-1.979-.287zm.365-1.028l-1.859-.738 1.859.738zm-6.965-44.333l-1.062 1.695 1.062-1.695zm-21.371-14.497l1.129-1.651-.002-.002-1.127 1.653zM163.676 296.9l1.125-1.653-1.125 1.653zm176.355 155.085l-1.673-1.097-.009.015-.01.015 1.692 1.067zm6.845-20.35l-1.996.122 1.996-.122zm-7.277-14.059l1.125-1.654-1.125 1.654zm-34.779-23.495l-1.089 1.677 1.089-1.677zm-31.079-14.923l-.46-1.946.46 1.946zm-5.18 1.974l1.813.845-1.813-.845zm1.172 8.324l1.999-.058-1.999.058zm-18.808 15.91l.505-1.935-.505 1.935zm-3.145 0l-1.866-.718 1.866.718zm-1.788 15.724l1.926-.539-1.926.539zm9.496 11.655l-1.137 1.645 1.137-1.645zm45.139 30.648l-1.021 1.719 1.021-1.719zm15.478 6.844l.079 1.999-.079-1.999zM184.974 282.529l-1.129 1.651.003.002 1.126-1.653zm42.53 70.309l1.088-1.679h-.002l-1.086 1.679zm100.538 27.805l1.119-1.658-.011-.007-.011-.007-1.097 1.672zM301.34 492.364l-1.085 1.68.001.001 1.084-1.681zM194.129 371.768l-1.419-1.409 1.419 1.409zm-45.103 15.633l1.064-1.693-.009-.006-1.055 1.699zm155.169 78.142l1.039-1.71-1.039 1.71zm-43.893-29.459l1.141-1.642-1.141 1.642zm-7.777-5.339l1.106-1.666-1.106 1.666zm-4.879-25.065l1.833.802-1.833-.802zm3.018-.383l-.51 1.934.51-1.934zm18.436-19.754l1.961-.395-1.961.395zm3.867-6.203l.456 1.948h.001l-.457-1.948zm63.81 36.313l-1.126 1.653 1.126-1.653zM158 262h-6v4h6v-4zm-8 2v8h4v-8h-4zm-12.884 12.47a195.61 195.61 0 00-7.558-4.967c-2.749-1.709-5.676-3.403-7.421-3.985l-1.265 3.795c1.212.404 3.725 1.815 6.574 3.587a190.674 190.674 0 017.392 4.858l2.278-3.288zm-14.979-8.952c-1.841-.613-3.376-1.11-5.432-.963-1.937.138-4.226.838-7.748 2.139l1.386 3.752c3.56-1.315 5.351-1.809 6.647-1.901 1.178-.084 2.029.15 3.882.768l1.265-3.795zm-13.18 1.176c-3.94 1.457-7.688 4.386-10.996 7.83-3.327 3.464-6.321 7.567-8.734 11.542l3.419 2.076c2.297-3.783 5.119-7.639 8.2-10.847 3.102-3.23 6.356-5.687 9.497-6.849l-1.386-3.752zm-19.73 19.372c-4.989 8.216-5.784 17.472-5.27 22.975l3.983-.371c-.456-4.888.273-13.227 4.706-20.528l-3.42-2.076zm-5.27 22.975c.576 6.173 5.61 9.895 7.064 10.932l2.325-3.255c-1.457-1.04-5.013-3.83-5.406-8.048l-3.983.371zm7.064 10.932c1.457 1.041 23.891 16.892 37.042 25.491l2.189-3.348c-13.077-8.55-35.454-24.36-36.907-25.398l-2.325 3.255zm37.042 25.491c6.549 4.282 12.297 8.023 16.685 10.672 2.19 1.323 4.082 2.398 5.586 3.138.751.369 1.445.675 2.056.886.55.189 1.268.389 1.972.335l-.306-3.988c.157-.012.093.028-.361-.129a14.71 14.71 0 01-1.596-.693c-1.348-.664-3.124-1.669-5.284-2.973-4.313-2.605-9.997-6.303-16.563-10.596l-2.189 3.348zm26.299 15.031c1.315-.101 3.802-.681 6.114-1.329 2.314-.649 4.831-1.473 6.17-2.168l-1.841-3.551c-.93.483-3.079 1.214-5.409 1.868-2.333.654-4.469 1.125-5.34 1.192l.306 3.988zm12.284-3.497c2.05-1.063 3.844-2.618 4.529-3.303l-2.828-2.829c-.492.492-1.96 1.761-3.542 2.581l1.841 3.551zm4.041-6.49c-.996-.521-3.671-2.384-5.461-5.188l-3.372 2.152c2.245 3.517 5.51 5.813 6.98 6.581l1.853-3.545zm-5.461-5.188c-2.201-3.449-3.454-8.676.027-14.453l-3.426-2.064c-4.421 7.337-2.815 14.216.027 18.669l3.372-2.152zm.027-14.453c3.547-5.886 8.966-7.493 11.983-7.356l.182-3.996c-4.381-.199-11.236 2.06-15.591 9.288l3.426 2.064zm11.983-7.356c1.197.054 2.835.459 4.5 1.012a38.925 38.925 0 013.988 1.574l1.7-3.62a42.707 42.707 0 00-4.427-1.751c-1.757-.583-3.818-1.131-5.579-1.211l-.182 3.996zm11.32 1.046c.26-1.907.649-6.671-.016-10.222l-3.932.737c.545 2.905.228 7.153-.016 8.945l3.964.54zm-.016-10.222c-.923-4.918-4.379-7.847-9.491-11.367l-2.268 3.295c5.144 3.542 7.236 5.657 7.827 8.809l3.932-.737zm-39.192-31.633a859.102 859.102 0 00-12.27-8.257l-2.202 3.339a863.296 863.296 0 0112.203 8.212l2.269-3.294zM130 272v-8h-4v8h4zm-2-10h-16v4h16v-4zm-14 2v-8h-4v8h4zm-2-10h-8v4h8v-4zm-6 2v-8h-4v8h4zm-2-10H88.35v4H104v-4zm-16.89.431c-3.651 2.885-12.492 11.259-19.304 21.907l3.37 2.155c6.534-10.215 15.053-18.268 18.414-20.924l-2.48-3.138zm-19.304 21.907c-8.351 13.056-15.712 27.386-15.121 41.66l3.996-.165c-.534-12.92 6.164-26.316 14.495-39.34l-3.37-2.155zm-4.855 63.3c7.532 5.868 48.087 33.08 58.269 39.755l2.193-3.346c-10.241-6.713-50.63-33.82-58.004-39.565l-2.458 3.156zm102.04 61.267c8.708-1.573 16.789-7.675 20.359-10.353l-2.4-3.2c-3.691 2.768-11.04 8.239-18.67 9.616l.711 3.937zm30.671-19.842c.086-.086.106-.103.105-.103a1.076 1.076 0 01-.229.14 1.395 1.395 0 01-.516.123 1.002 1.002 0 01-.293-.028c-.006-.001.122.039.525.258.378.206.881.503 1.596.932l2.058-3.43a52.389 52.389 0 00-1.742-1.015c-.436-.238-.911-.474-1.385-.604-.556-.151-1.226-.187-1.912.128-.531.244-.912.647-1.035.77l2.828 2.829zm25.829 17.166c.115.058.17.087.204.106.035.02-.01-.002-.083-.064a1.513 1.513 0 01-.502-1.049c-.007-.167.02-.274.023-.289.004-.016-.002.012-.039.103-.079.192-.223.486-.476.965l3.535 1.871c.257-.485.482-.929.641-1.315.141-.345.34-.891.313-1.509a2.5 2.5 0 00-.895-1.817c-.345-.295-.762-.494-.932-.579l-1.789 3.577zm-8.107 20.02c-1.357 9.501-1.615 17.779 1.845 23.674l3.45-2.025c-2.674-4.556-2.704-11.5-1.335-21.083l-3.96-.566zm25.475 42.583c7.411 5.245 47.536 32.297 58.691 39.469l2.163-3.365c-11.11-7.142-51.186-34.162-58.543-39.369l-2.311 3.265zm81.388 50.573c5.08-.372 18.14-3.836 29.524-14.751l-2.768-2.887c-10.654 10.214-22.813 13.338-27.048 13.648l.292 3.99zm29.524-14.751c5.637-5.404 12.044-13.175 17.437-21.812 5.383-8.621 9.84-18.241 11.435-27.338l-3.94-.691c-1.472 8.397-5.649 17.521-10.888 25.911-5.228 8.374-11.43 15.882-16.812 21.043l2.768 2.887zm28.872-49.15c3.129-17.851-.717-25.663-4.305-29.251l-2.828 2.829c2.32 2.32 6.198 8.593 3.193 25.731l3.94.691zm-102.967-93.877c-5.813-.612-13.807.925-21.877 5.883l2.095 3.408c7.418-4.558 14.539-5.821 19.363-5.313l.419-3.978zM128 274h24v-4h-24v4zm-75.315 35.998c.27 6.551.753 10.535 2.247 13.558 1.524 3.081 4.016 4.97 7.36 7.57l2.455-3.159c-3.537-2.749-5.19-4.083-6.229-6.184-1.067-2.158-1.562-5.315-1.837-11.95l-3.996.165zm9.607 21.128l.659.512 2.458-3.156-.662-.515-2.455 3.159zm58.928 40.267c4.338 2.844 8.491 5.647 12.322 8.234l2.238-3.315c-3.828-2.585-8.003-5.404-12.367-8.265l-2.193 3.346zm12.322 8.234c5.144 3.473 9.735 6.573 13.365 8.814l2.101-3.405c-3.545-2.187-8.057-5.233-13.228-8.724l-2.238 3.315zm14.432 9.475c2.671 1.659 4.903 3.064 7.488 3.788 2.659.744 5.527.737 9.529.015l-.711-3.937c-3.683.665-5.883.59-7.739.07-1.931-.541-3.659-1.596-6.456-3.334l-2.111 3.398zm37.376-6.55c3.522-2.641 8.883-8.05 10.105-9.281l-2.839-2.817c-1.297 1.307-6.43 6.471-9.666 8.898l2.4 3.2zm11.5-8.167c1.388.833 7.315 4.68 13.039 8.395l2.178-3.355c-5.667-3.679-11.691-7.589-13.159-8.47l-2.058 3.43zm13.039 8.395c2.806 1.822 5.548 3.602 7.645 4.954 1.048.676 1.938 1.248 2.597 1.666.59.375 1.129.714 1.36.829l1.789-3.577c.005.002-.293-.177-1.006-.629-.646-.41-1.526-.975-2.572-1.65a3504.437 3504.437 0 01-7.635-4.948l-2.178 3.355zm10.729 7.221l-.234.436 3.521 1.897.248-.462-3.535-1.871zm-.234.436c-1.372 2.546-5.67 10.504-7 19.812l3.96.566c1.221-8.546 5.203-15.96 6.561-18.481l-3.521-1.897zm-5.155 43.486c1.452 2.472 4.523 5.203 7.86 7.793 3.412 2.648 7.404 5.371 10.955 7.794l2.254-3.304c-3.574-2.439-7.459-5.091-10.757-7.65-3.374-2.619-5.848-4.931-6.862-6.658l-3.45 2.025zm18.815 15.587c1.745 1.191 3.382 2.308 4.815 3.322l2.311-3.265c-1.467-1.038-3.134-2.175-4.872-3.361l-2.254 3.304zm66.218 44.539c4.653 3.003 8.37 5.405 11.459 7.002 3.076 1.591 5.829 2.551 8.526 2.354l-.292-3.99c-1.566.115-3.503-.421-6.396-1.917-2.879-1.489-6.408-3.764-11.128-6.81l-2.169 3.361zm28.897-115.065c-5.387-3.636-10.096-6.814-13.288-8.988l-2.252 3.306c3.201 2.18 7.919 5.364 13.303 8.998l2.237-3.316zm-13.288-8.988l-3.701-2.527-2.257 3.303 3.706 2.53 2.252-3.306zm-3.701-2.527c-6.69-4.572-14.403-9.843-21.052-14.034-3.324-2.095-6.413-3.94-8.997-5.3-1.291-.68-2.482-1.253-3.531-1.678-1.017-.411-2.026-.736-2.914-.83l-.419 3.978c.326.034.921.191 1.832.56.881.357 1.944.864 3.169 1.509 2.449 1.289 5.438 3.071 8.727 5.145 6.574 4.144 14.222 9.369 20.928 13.953l2.257-3.303zm-58.371-15.959c-6.36 3.908-10.042 7.401-11.509 8.794l2.755 2.9c1.372-1.303 4.825-4.585 10.849-8.286l-2.095-3.408zm-11.509 8.794c-.184.174-.311.295-.405.38a2.081 2.081 0 01-.074.067l.027-.021c.016-.012.062-.046.13-.087l2.058 3.43c.252-.151.483-.368.556-.434.13-.118.29-.271.463-.435l-2.755-2.9zm-.322.339a1.4 1.4 0 011.068-.116c.114.035.166.071.117.043a6.499 6.499 0 01-.265-.168l-2.173 3.358c.171.111.638.435 1.149.591.768.235 1.517.109 2.162-.278l-2.058-3.43zm.92-.24c-.089-.059-.2-.13-.324-.208l-2.12 3.392c.093.058.179.114.27.173l2.174-3.357zm-.324-.208c-.355-.222-7.139-4.612-13.965-9.031l-2.174 3.358c6.794 4.397 13.628 8.821 14.019 9.065l2.12-3.392zm-27.991-18.1c-.074-.047-.038-.036.034.045.086.097.182.248.239.441.052.176.045.302.045.311l.005-.047c.005-.043.012-.092.024-.171l-3.958-.577c-.026.176-.167.89.047 1.614.259.879.878 1.421 1.444 1.776l2.12-3.392zm.361.485a1.69 1.69 0 01-.046.22l-.009.03c.005-.015.018-.053.045-.124.054-.141.133-.338.24-.61l-3.717-1.477c-.103.259-.194.489-.261.665-.033.087-.068.179-.097.266-.012.035-.083.236-.115.465l3.96.565zm.23-.484c.716-1.801 2.395-6.02 3.632-11.251 1.231-5.207 2.062-11.568.978-17.636l-3.938.703c.948 5.304.238 11.057-.933 16.013-1.166 4.932-2.753 8.926-3.456 10.694l3.717 1.477zm4.61-28.887c-.974-5.458-2.447-9.02-4.619-11.725-2.136-2.661-4.837-4.329-7.753-6.155l-2.123 3.39c3.025 1.894 5.116 3.226 6.757 5.269 1.604 1.999 2.894 4.845 3.8 9.924l3.938-.703zm-12.372-17.88c-1.427-.893-2.941-1.842-4.589-2.999l-2.298 3.274c1.744 1.225 3.342 2.225 4.764 3.115l2.123-3.39zm-21.305-14.455c-9.587-6.535-20.57-14.02-26.946-18.509l-2.302 3.27c6.407 4.511 17.421 12.018 26.995 18.544l2.253-3.305zm-39.018 7.122c2.885 1.986 9.256 6.325 15.471 10.557l2.251-3.306c-6.22-4.236-12.58-8.567-15.453-10.545l-2.269 3.294zm15.471 10.557c5.938 4.044 11.732 7.99 14.231 9.71l2.268-3.295c-2.509-1.728-8.316-5.681-14.248-9.721l-2.251 3.306zm179.153 154.528c1.304-1.987 3.191-5.383 4.703-9.231 1.498-3.812 2.714-8.281 2.466-12.337l-3.992.244c.195 3.196-.778 7.021-2.197 10.63-1.404 3.574-3.161 6.727-4.325 8.501l3.345 2.193zm7.169-21.568c-.284-4.631-.971-7.742-2.385-10.143-1.424-2.417-3.461-3.883-5.763-5.448l-2.249 3.307c2.322 1.58 3.646 2.611 4.566 4.172.929 1.577 1.567 3.923 1.839 8.356l3.992-.244zm-42.962-39.109a2212.006 2212.006 0 00-14.374-9.274 495.287 495.287 0 00-6.611-4.159 99.45 99.45 0 00-2.242-1.345 21.108 21.108 0 00-.777-.43 4.462 4.462 0 00-.745-.323l-1.15 3.831c-.13-.039-.154-.066.047.039.15.078.359.194.63.35.539.31 1.266.747 2.144 1.286a494.423 494.423 0 016.553 4.123 2245.007 2245.007 0 0114.346 9.256l2.179-3.354zm-24.749-15.531c-1.718-.516-4.338-.498-7.88.339l.92 3.893c3.241-.766 5.062-.626 5.81-.401l1.15-3.831zm-13.427 12.642c.022.745-.21 2.694-1.012 4.879-.796 2.171-2.065 4.327-3.931 5.739l2.414 3.19c2.698-2.042 4.327-4.973 5.273-7.551.94-2.562 1.294-5.022 1.254-6.374l-3.998.117zm-4.943 10.618c-1.956 1.48-4.551 2.398-6.916 2.889a21.399 21.399 0 01-3.066.42c-.417.025-.762.027-1.022.017-.288-.011-.386-.036-.357-.028l-1.01 3.87c.682.178 1.664.19 2.62.135a25.614 25.614 0 003.65-.497c2.676-.557 5.908-1.643 8.515-3.616l-2.414-3.19zm53.393 72.103c5.227-.207 9.501-2.533 12.117-4.545l-2.439-3.17c-2.195 1.688-5.69 3.554-9.836 3.718l.158 3.997zm12.117-4.545c2.529-1.946 9.684-8.71 13.422-14.64l-3.384-2.133c-3.415 5.417-10.197 11.849-12.477 13.603l2.439 3.17zm-144.46-183.513l.004.002 2.258-3.302-.004-.002-2.258 3.302zm.007.004c7.247 4.94 13.661 9.312 16.667 11.422l2.298-3.274c-3.034-2.13-9.48-6.524-16.712-11.453l-2.253 3.305zm27.126 57.829l-.012.088 3.958.573.013-.088-3.959-.573zm1.479 3.476c.356.222 7.138 4.611 13.964 9.03l2.173-3.358c-6.793-4.397-13.626-8.82-14.017-9.064l-2.12 3.392zm13.962 9.029l.009.005 2.176-3.356-.008-.006-2.177 3.357zm100.528 27.798l.001.001 2.195-3.344-.001-.001-2.195 3.344zm-.02-.013c8.844 5.968 19.492 13.154 28.212 19.13 4.361 2.989 8.232 5.67 11.15 7.743a178.943 178.943 0 013.586 2.6c.957.718 1.474 1.143 1.639 1.308l2.828-2.829c-.401-.401-1.158-.997-2.067-1.679a180.826 180.826 0 00-3.67-2.661c-2.946-2.092-6.838-4.788-11.204-7.781-8.734-5.986-19.395-13.181-28.236-19.147l-2.238 3.316zm-24.492 108.387l-.007-.005-2.168 3.362.007.004 2.168-3.361zm-.007-.004c-.865-.559-1.769-1.142-2.711-1.748l-2.163 3.365c.939.603 1.839 1.185 2.705 1.743l2.169-3.36zM192.833 370.235l-.123.124 2.838 2.818.114-.114-2.829-2.828zm-.123.124l-.094.094 2.839 2.819.094-.095-2.839-2.818zm-42.616 15.351l-.004-.002-2.129 3.386.004.002 2.129-3.386zm-.013-.008l-1.073-.666-2.101 3.405c.367.226.719.445 1.063.659l2.111-3.398zm165.945 82.537c-3.22.127-5.147-.975-10.792-4.406l-2.078 3.419c5.405 3.284 8.389 5.167 13.028 4.984l-.158-3.997zm-10.792-4.406c-1.064-.646-2.251-1.367-3.586-2.16l-2.042 3.439a376.75 376.75 0 013.55 2.14l2.078-3.419zm-3.586-2.16c-6.875-4.084-28.957-19.419-40.205-27.231l-2.282 3.285c11.155 7.748 33.41 23.206 40.445 27.385l2.042-3.439zm-40.205-27.231c-2.006-1.393-3.663-2.544-4.818-3.342l-2.274 3.29c1.15.795 2.803 1.943 4.81 3.337l2.282-3.285zm-4.818-3.342c-1.175-.812-2.164-1.469-2.994-2.021l-2.213 3.332c.829.551 1.792 1.19 2.933 1.979l2.274-3.29zm-2.994-2.021c-2.416-1.604-3.2-2.163-3.761-2.985-.6-.88-1.001-2.145-1.952-5.543l-3.852 1.079c.877 3.132 1.442 5.167 2.5 6.718 1.098 1.609 2.667 2.612 4.852 4.063l2.213-3.332zm-5.713-8.528c-1.777-6.347.843-12.428 1.561-14.069l-3.665-1.603c-.726 1.659-3.94 8.921-1.748 16.751l3.852-1.079zm1.561-14.069c.052-.12.123-.28.168-.398l-3.733-1.436-.024.056-.076.175 3.665 1.603zm.168-.398a1.369 1.369 0 01-.765.772c-.206.079-.31.05-.177.058.11.007.287.034.556.093.264.059.553.135.893.224l1.019-3.868c-.595-.157-1.457-.392-2.213-.441-.385-.024-.943-.018-1.509.199a2.631 2.631 0 00-1.537 1.527l3.733 1.436zm.507 1.147l.266.07 1.01-3.87-.257-.068-1.019 3.868zm21.578-17.833c-.033-1.123-.387-2.843-.671-4.25l-3.921.79c.319 1.584.573 2.883.594 3.577l3.998-.117zm-.671-4.25c-.201-.995-.384-1.909-.491-2.637a7.612 7.612 0 01-.084-.802c-.002-.085.002-.111 0-.094-.002.01-.006.046-.019.101a1.41 1.41 0 01-.093.261l-3.625-1.691c-.279.597-.27 1.242-.261 1.539.011.398.062.838.124 1.265.126.857.334 1.887.528 2.848l3.921-.79zm-.687-3.171c-.138.295-.358.261.173.064.552-.204 1.404-.408 2.876-.753l-.913-3.895c-1.355.318-2.508.584-3.352.897-.865.32-1.875.851-2.409 1.996l3.625 1.691zm3.05-.689l.777-.183-.92-3.893-.771.181.914 3.895zm30.307 14.47c6.208 4.033 24.148 16.254 31.92 21.548l2.252-3.305c-7.746-5.277-25.737-17.533-31.993-21.597l-2.179 3.354zm31.92 21.548c1.223.833 2.193 1.495 2.824 1.923l2.249-3.307-2.821-1.921-2.252 3.305z"
                mask="url(#a)"
              />
            </g>
          </g>
          <linearGradient
            id="paint0_linear"
            x1="97.542"
            x2="334.47"
            y1="290.825"
            y2="448.777"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#7D27E7" />
            <stop offset=".271" stop-color="#00A2E8" />
            <stop offset=".516" stop-color="#01E791" />
            <stop offset=".75" stop-color="#B5E61D" />
            <stop offset="1" stop-color="#FFF200" />
          </linearGradient>
          <clipPath id="clip0">
            <path fill="#fff" d="M0 0h500v510H0z" />
          </clipPath>
        </defs>
      </svg>
      <MDXProvider
        components={{
          wrapper: (props) => (
            <div
              css={{
                display: "grid",
                color: "rgba(255, 255, 255, 0.86)",
                gridTemplateColumns:
                  "minmax(1.2rem, 1fr) minmax(auto, 57ch) minmax(1.2rem, 1fr)",
                "& > *": {
                  marginTop: "2rem",
                },
              }}
            >
              {props.children}
            </div>
          ),
          corgilink: (props) => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 500 510"
              class="corgi"
              css={{ width: 30 }}
            >
              <use href="#corgi" />
            </svg>
          ),
          Aside: (props) => (
            <div
              {...props}
              css={{
                gridColumn: 2,
                backgroundColor: "hsla(220, 26%, 18%, 1)",
                borderLeft: "2px solid rgba(51,183,255,.41)",
                padding: "1rem",
                paddingTop: 0,
                marginTop: "1rem",
                borderRight: "1px solid rgba(51,183,255,.41)",
              }}
            />
          ),
          hr: (props) => (
            <hr
              css={{
                height: "3px",
                marginTop: "2rem",
                border: "none",
                gridColumn: 2,
                background:
                  "linear-gradient(90deg,rgba(251,89,74,1) 0%, rgba(251,89,74,1) 25%,rgba(251,222,75,1) 25%, rgba(251,222,75,1) 50%,rgba(112,228,112,1) 50%, rgba(112,228,112,1) 75%,rgba(51,183,255,1) 75%);",
              }}
            />
          ),
          p: (props) => (
            <p
              css={{
                gridColumn: 2,

                fontSize: "22px",
                lineHeight: "32px",
                padding: "0.05px 0",
                ":before": {
                  content: "''",
                  marginTop: "-0.3659090909090909em",
                  display: "block",
                  height: 0,
                },
                ":after": {
                  content: "''",
                  marginBottom: "-0.3659090909090909em",
                  display: "block",
                  height: 0,
                },
              }}
              {...props}
            />
          ),
          img: (props) => (
            <img css={{ gridColumn: 2, width: "100%" }} {...props} />
          ),
          a: (props) => (
            <a
              css={{
                wordWrap: "break-word",
                backgroundImage: `linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%)`,
                "&[href^='/']": {
                  backgroundImage: `linear-gradient(90deg, rgba(251,89,74,1) 0%, rgba(251,222,75,1) 25%, rgba(112,228,112,1) 50%, rgba(51,183,255,1) 75%)`,
                },
                "-webkit-background-clip": `text`,
                "-webkit-text-fill-color": `rgba(255,255,255,0.46)`,
                display: "inline-block",
                "&:hover": {
                  "-webkit-text-fill-color": `rgba(255,255,255,.1)`,
                },
              }}
              {...props}
            />
          ),
          h1: (props) => <h1 css={headingStyles} {...props} />,
          h2: (props) => <h2 css={headingStyles} {...props} />,
          h3: (props) => <h3 css={headingStyles} {...props} />,
          h4: (props) => <h4 css={headingStyles} {...props} />,
          h5: (props) => <h5 css={headingStyles} {...props} />,
          h6: (props) => <h6 css={headingStyles} {...props} />,
          ul: (props) => (
            <ul
              css={{
                gridColumn: 2,
                marginTop: `1rem`,
                marginLeft: `calc(1rem + 4px)`,
                lineHeight: 1.3,
              }}
              {...props}
            />
          ),
          ol: (props) => (
            <ol
              css={{
                gridColumn: 2,
                marginTop: `1rem`,
                marginLeft: `calc(1rem + 4px)`,
                lineHeight: 1.3,
              }}
              {...props}
            />
          ),
          table: (props) => (
            <table css={{ gridColumn: 2, marginTop: "1rem" }} {...props} />
          ),
          thead: (props) => (
            <thead css={{ background: "#ffffff12" }} {...props} />
          ),
          th: (props) => (
            <th css={{ padding: ".5rem", textAlign: "left" }} {...props} />
          ),
          td: (props) => (
            <td
              css={{ padding: ".5rem", borderBottom: "1px solid #ffffff22" }}
              {...props}
            />
          ),
          inlineCode: (props) => <code css={{ color: "#31b7fe" }} {...props} />,
          pre: (props) => {
            const lang =
              props.children.props.class &&
              props.children.props.class.split("-")[1];
            const langMap = {
              graphql: "GraphQL",
              js: "JS",
            };

            return (
              <div
                css={{
                  gridColumn: 2,
                  background: "#11151d",
                  overflow: "auto",
                  borderRadius: 10,
                  position: "relative",
                  border: "1px solid rgba(51,183,255,.21)",
                  boxShadow: `inset 0 2.8px 2.2px rgba(0,0,0,0.02),
                      inset 0 6.7px 5.3px rgba(0,0,0,0.028),
                      inset 0 12.5px 10px rgba(0,0,0,0.035),
                      inset 0 22.3px 17.9px rgba(0,0,0,0.042),
                      inset 0 41.8px 33.4px rgba(0,0,0,0.05),
                      inset 0 100px 80px rgba(0,0,0,0.07)`,
                }}
              >
                <div
                  css={{
                    fontSize: `12px`,
                    display: `flex`,
                    justifyContent: `space-between`,
                    position: `sticky`,
                    left: 0,
                    borderBottom: "1px solid rgba(51,183,255,.21)",
                  }}
                >
                  <span css={{ padding: "1rem" }}>
                    {props.children.props.title}
                  </span>
                  <div css={{ display: "flex" }}>
                    <span css={{ padding: "1rem" }}>
                      {langMap[lang] || lang || ""}
                    </span>
                    <CopyButton content={props.children.props.codestring} />
                  </div>
                </div>
                <div
                  css={{ padding: "1rem 2rem" }}
                  dangerouslySetInnerHTML={{
                    __html: props.children.props.children,
                  }}
                />
              </div>
            );
          },
          blockquote: (props) => (
            <blockquote
              css={{
                gridColumn: 2,
                backgroundColor: "#1d2634",
                backgroundImage: `linear-gradient(180deg,rgba(251,89,74,.5) 0%,rgba(251,89,74,.5) 25%,rgba(251,222,75,.5) 25%,rgba(251,222,75,.5) 50%,rgba(112,228,112,.5) 50%,rgba(112,228,112,.5) 75%,rgba(51,183,255,.5) 75%)`,
                backgroundSize: "3px 100%",
                backgroundRepeat: "no-repeat",
                paddingLeft: "1rem",
                borderRight: `1px solid hsla(217, 28%, 26%, 1)`,
                paddingTop: `1rem`,
                paddingBottom: `1rem`,
                "&:hover": {
                  backgroundImage: `linear-gradient(180deg,rgba(251,89,74,1) 0%, rgba(251,89,74,1) 25%,rgba(251,222,75,1) 25%, rgba(251,222,75,1) 50%,rgba(112,228,112,1) 50%, rgba(112,228,112,1) 75%,rgba(51,183,255,1) 75%)`,
                },
              }}
              {...props}
            />
          ),
          "blockquote.p": (props) => (
            <p
              css={{
                fontSize: "22px",
                lineHeight: "32px",
                padding: "0.05px 0",
                ":before": {
                  content: "''",
                  marginTop: "-0.3659090909090909em",
                  display: "block",
                  height: 0,
                },
                ":after": {
                  content: "''",
                  marginBottom: "-0.3659090909090909em",
                  display: "block",
                  height: 0,
                },
              }}
              {...props}
            />
          ),
        }}
      >
        <Fragment>{children}</Fragment>
      </MDXProvider>
      <div css={{ height: "5rem" }} />

      <footer
        css={{
          background: "rgba(0,0,0,.1)",
          display: "grid",
          color: "rgba(255, 255, 255, 0.86)",
          padding: "2rem 0 5rem 0",
          borderTop: "1px solid rgba(51,183,255,.21)",
          gridTemplateColumns:
            "minmax(1.2rem, 1fr) minmax(auto, 400px) minmax(auto, 400px) minmax(1.2rem, 1fr)",
          "@media screen and (max-width: 800px)": {
            gridTemplateColumns:
              "minmax(1.2rem, 1fr) minmax(auto, 400px) minmax(auto, 400px) minmax(1.2rem, 1fr)",
          },
        }}
      >
        <div
          css={{
            gridColumn: "2/4",
            display: "flex",
            justifyContent: "space-between",
            "& a": {
              color: "rgba(51,183,255,.91)",
              fontSize: ".8rem",
              fontWeight: 500,
              textDecoration: "none",
            },
          }}
        >
          <div>
            <h2
              css={{
                fontSize: "1rem",
                fontFamily: "Inter, system-ui, sans-serif", // "InterDisplay var",
                letterSpacing: "-1px",
                color: "#add5eb",
                position: "relative",
                borderBottom: "3px solid rgba(51,183,255,.21)",
                paddingBottom: 3,
              }}
            >
              Projects
            </h2>
            <ul css={{ listStyleType: "none" }}>
              <li>
                <a href="https://sector.tools">Sector Tools</a>
              </li>
              <li>
                <a href="https://toast.dev">Toast</a>
              </li>
            </ul>
          </div>
          <div>
            <h2
              css={{
                fontSize: "1rem",
                fontFamily: "Inter, system-ui, sans-serif", // "InterDisplay var",
                letterSpacing: "-1px",
                color: "#add5eb",
                position: "relative",
                borderBottom: "3px solid rgba(51,183,255,.21)",
                paddingBottom: 3,
              }}
            >
              Social
            </h2>
            <ul css={{ listStyleType: "none" }}>
              <li>
                <a href="https://twitter.com/chrisbiscardi">Twitter</a>
              </li>
              <li>
                <a href="https://github.com/christopherbiscardi">GitHub</a>
              </li>
              <li>
                <a href="https://pages.convertkit.com/04c24646a3/c136f814fc">
                  Newsletter
                </a>
              </li>
              <li>
                <a href="https://discord.gg/S9Gdagv">Discord</a>
              </li>
            </ul>
          </div>
          <div>
            <h2
              css={{
                fontSize: "1rem",
                fontFamily: "Inter, system-ui, sans-serif", // "InterDisplay var",
                letterSpacing: "-1px",
                color: "#add5eb",
                position: "relative",
                borderBottom: "3px solid rgba(51,183,255,.21)",
                paddingBottom: 3,
              }}
            >
              -
            </h2>
            <ul css={{ listStyleType: "none" }}>
              <li>
                <a href="https://blacklivesmatters.carrd.co/">
                  Black Lives Matter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
