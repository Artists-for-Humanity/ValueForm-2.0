import { isInViewport } from "./script.js";

function containsElementWithId(elements, id) {
  if (Array.isArray(elements) || NodeList.prototype.isPrototypeOf(elements)) {
    return Array.from(elements).some((el) => el.id === id);
  }
  return false;
}

// =============================================================
// Handle navigation logic for the rest of the page
// =============================================================
export function handleNavigation(fadeInUpElements) {
  const navLinks = document.querySelectorAll("nav a");
  const logoLinks = document.querySelectorAll("header a img");
  const footerLinks = document.querySelectorAll("footer a img");
  const headerLinks = document.querySelectorAll("header a");
  const asideLinks = document.querySelectorAll("aside a");
  const linkBack = document.querySelectorAll(".link-back");
  const clickMe = document.querySelectorAll(".click-me");
  const linkBackNews = document.querySelectorAll(".link-back-news");
  const newsPageMain = document.getElementById("news_page_main");
  const topBannerMain = document.getElementById("top_banner_main");
  const pinnedFilePath = localStorage.getItem("pinnedFilePath");
  const articleTitle = document.getElementById("article_title");
  const articleTitleBlock = document.getElementById("article_title_block");
  const articleTop = document.getElementById("article_top");

  const allLinks = [
    ...clickMe,
    ...navLinks,
    ...logoLinks,
    ...footerLinks,
    ...headerLinks,
    ...asideLinks,
    ...linkBack,
    ...linkBackNews,
  ];

  allLinks.forEach((element) => {
    const isAnchor = element.tagName.toLowerCase() === "a";
    const anchor = isAnchor ? element : element.closest("a") || element;

    if (anchor.classList.contains("disabled")) return;

    anchor.addEventListener("click", (e) => {
      const isPureAnchor =
        anchor.host === window.location.host &&
        anchor.pathname === window.location.pathname;

      if (isPureAnchor) {
        return;
      }

      e.preventDefault();
      const targetUrl = anchor.getAttribute("href");
      let delayCounter = 0;

      fadeInUpElements
        .filter(isInViewport)
        .reverse()
        .forEach((element, index) => {
          element.classList.replace("fadeInUp", "fadeOutDown");
          element.style.animationDelay = `${index * 600}ms`;
          delayCounter++;
        });

      const currentPage = window.location.pathname;
      const isNewsPageMainInViewport =
        newsPageMain && isInViewport(newsPageMain);
      const isTopBannerMainInViewport =
        topBannerMain && isInViewport(topBannerMain);
      const footer = document.querySelector("footer");
      const footerInViewport = isInViewport(footer);
      const isArticleTitleInViewport =
        articleTitle && isInViewport(articleTitle);
      const isArticleTopInViewport = articleTop && isInViewport(articleTop);

      // from pinned article to non-news pages
      if (
        currentPage === "/pages/articles/" + pinnedFilePath &&
        targetUrl !== "../../news.html"
      ) {
        if (isNewsPageMainInViewport) {
          if (footerInViewport) {
            console.log("footer is in viewport");
            // delayCounter--;
          }

          if (isArticleTitleInViewport) {
            delayCounter++;

            setTimeout(() => {
              // console.log("delayCounter = " + delayCounter);

              newsPageMain.classList.add("fadeOutDown");
            }, (delayCounter - 1) * 600);
          }
        }

        if (isTopBannerMainInViewport) {
          delayCounter++;
          setTimeout(() => {
            topBannerMain.classList.add("fadeOutDown");
          }, (delayCounter - 1) * 600);
        }
      }

      // from news to non-pinned articles
      if (
        currentPage === "/pages/news.html" &&
        targetUrl.startsWith("./articles/") &&
        targetUrl !== "./articles/" + pinnedFilePath
      ) {
        // console.log("from news to non-pinned article page 1.5");

        // for (let i = 0; i < fadeInUpElements.length; i++) {
        //   console.log(`fadeInUpElements[${i}].id = ${fadeInUpElements[i].id}`);
        // }

        if (containsElementWithId(fadeInUpElements, "top_banner_main")) {
          // console.log("fadeInUpElements contains element with ID 'top_banner_main'");
          delayCounter--;
          if (footerInViewport) {
            delayCounter++;
            // console.log("footer is in viewport");
          }
        }

        if (isNewsPageMainInViewport) {
          if (
            topBannerMain.classList.contains("animated") ||
            newsPageMain.classList.contains("animated")
          ) {
            delayCounter--;
          }

          delayCounter++;
          setTimeout(() => {
            newsPageMain.classList.add("fadeOutDown");
          }, (delayCounter - 1) * 600);
        }
        // delayCounter--;
      }

      // From news to non-news pages
      if (
        currentPage === "/pages/news.html" &&
        (
          targetUrl.startsWith("./our-approach.html") ||
          targetUrl === "./leadership.html" ||
          targetUrl === "../index.html"
        )
      ) {
        console.log("from news to non-news page 2.3");
        console.log(`fadeInUpElements = ${fadeInUpElements.length}`);

        if (!isNewsPageMainInViewport) return;

        let localDelay = delayCounter;

        // Adjust delay if "news_page_main" is not part of fadeInUpElements
        if (!containsElementWithId(fadeInUpElements, "news_page_main")) {
          localDelay++;
        }

        setTimeout(() => {
          console.log("topBannerMain animation Delay A = " + topBannerMain.style.animationDelay);
          console.log("newsPageMain animation Delay A = " + newsPageMain.style.animationDelay);
          console.log("article-title-block animation Delay A = " + articleTitleBlock.style.animationDelay);
          newsPageMain.classList.add("fadeOutDown");
        }, (localDelay - 2) * 600);

        // Adjust delay if "top_banner_main" is not part of fadeInUpElements
        if (!containsElementWithId(fadeInUpElements, "top_banner_main")) {
          localDelay++;
        }

        // If footer is visible, stagger animations with delay
        if (footerInViewport) {
          setTimeout(() => {
            if (!isTopBannerMainInViewport){
              newsPageMain.style.animationDelay = `${(localDelay - 1) * 600}ms`;
            articleTitleBlock.style.animationDelay = `${(localDelay - 2) * 600}ms`;
            }
          console.log("topBannerMain animation Delay B = " + topBannerMain.style.animationDelay);
            console.log("newsPageMain animation Delay B = " + newsPageMain.style.animationDelay);
            console.log("article-title-block animation Delay B = " + articleTitleBlock.style.animationDelay);
            topBannerMain.classList.add("fadeOutDown");
          }, 0);
        } else {
          // No footer: fire immediately but with correct delay
          setTimeout(() => {
            newsPageMain.style.animationDelay = `${(localDelay - 2) * 600}ms`;
            topBannerMain.style.animationDelay = `${(localDelay - 1) * 600}ms`;
          console.log("topBannerMain animation Delay C = " + topBannerMain.style.animationDelay);
            console.log("newsPageMain animation Delay C = " + newsPageMain.style.animationDelay);
            console.log("article-title-block animation Delay C = " + articleTitleBlock.style.animationDelay);
            topBannerMain.classList.add("fadeOutDown");
          }, 0);

        }

        console.log("delayCounter Final = " + localDelay);
      }


      // // from news to non-news pages
      // if (
      //   currentPage === "/pages/news.html" &&
      //   (targetUrl.startsWith("./our-approach.html") ||
      //     targetUrl === "./leadership.html" ||
      //     targetUrl === "../index.html")
      // ) {
      //   console.log("from news to non-news page 2.3");
      //   console.log(`fadeInUpElements = ${fadeInUpElements.length}`);

      //   if (isNewsPageMainInViewport) {
      //     if (!containsElementWithId(fadeInUpElements, "news_page_main")) {
      //       // console.log("reachme A0")
      //       delayCounter++;
      //     }
      //     setTimeout(() => {
      //     // newsPageMain.style.animationDelay = `${(delayCounter - 2) * 600}ms`;

      //     console.log("newsPageMain animation Delay = " + newsPageMain.style.animationDelay)

      //       newsPageMain.classList.add("fadeOutDown");
      //     }, (delayCounter - 2) * 600);
      //     // topBannerMain.style.animationDelay = `${(delayCounter - 1) * 600}ms`;
      //     if (!containsElementWithId(fadeInUpElements, "top_banner_main")) {
      //       delayCounter++;
      //     }
      //     if (footerInViewport) {
      //       // console.log("footer is in viewport");
      //       setTimeout(() => {
      //     // console.log("article-title-block animation Delay A = " + articleTitleBlock.style.animationDelay);
      //     newsPageMain.style.animationDelay = `${(delayCounter - 1) * 600}ms`;
      //     articleTitleBlock.style.animationDelay = `${(delayCounter - 2) * 600}ms`;
      //     // newsPageMain.style.animationDelay = `${(delayCounter + 1) * 600}ms`;
      //     console.log("article-title-block animation Delay B = " + articleTitleBlock.style.animationDelay);
      //         topBannerMain.classList.add("fadeOutDown");
      //       }, (delayCounter - 1) * 600);
      //       // delayCounter++;
      //     } else {
      //       setTimeout(() => {
      //     newsPageMain.style.animationDelay = `${(delayCounter - 2) * 600}ms`;
      //     topBannerMain.style.animationDelay = `${(delayCounter - 1) * 600}ms`;
      //     console.log("topBannerMain animation Delay = " + topBannerMain.style.animationDelay)
      //         topBannerMain.classList.add("fadeOutDown");
      //       }, (delayCounter) * 0);
      //     }
      //     console.log("delayCounter Final = " + delayCounter);
      //   }
      // }

      // From articles to approach or leadership
      if (
        (currentPage.startsWith("/pages/articles/") &&
          targetUrl !== "./articles/" + pinnedFilePath &&
          (targetUrl === "../leadership.html" ||
            targetUrl === "../../index.html")) ||
        targetUrl.startsWith("../our-approach.html")
      ) {
        if (isArticleTitleInViewport || isArticleTopInViewport) {
          delayCounter++;
        }

        delayCounter--;

        if (isTopBannerMainInViewport) {
          if (topBannerMain.classList.contains("animated")) {
            delayCounter--;
          } else {
            // delayCounter++;
          }
          delayCounter++;

          setTimeout(() => {
            topBannerMain.classList.add("fadeOutDown");
          }, (delayCounter - 1) * 600);
        }
      }

      // From News to pinned article
      if (
        currentPage === "/pages/news.html" &&
        // targetUrl === "./articles/pinned.html"
        targetUrl === "./articles/" + pinnedFilePath
      ) {
        console.log("from news to pinned page 1.2");
        if (localStorage.getItem("newsFade") === "true") {
          if (delayCounter <= 1) {
          } else {
            delayCounter--;
            // delayCounter--;

            if (footerInViewport) {
              delayCounter++;
              console.log("footer is in viewport");
            }
          }
        }
        localStorage.setItem("newsFade", false);
      }

      setTimeout(() => {
        console.log(
          `Redirecting to ${targetUrl} after a delay of ${delayCounter * 600 + 800
          } ms`
        );
        window.location.href = targetUrl;
      }, delayCounter * 600 + 800);
    });
  });
}
