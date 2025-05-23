import { isInViewport } from "./script.js";
// console.log("running navigation script")
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

      // sessionStorage.setItem("nextTargetPath", anchor.getAttribute("href"));
      sessionStorage.setItem("currentPagePath", window.location.pathname);

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
          }

          if (isArticleTitleInViewport) {
            delayCounter++;

            setTimeout(() => {
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
        const hasTopBannerInList = containsElementWithId(
          fadeInUpElements,
          "top_banner_main"
        );

        // Calculate delay adjustments
        let delayAdjustment = 0;

        // If top_banner_main is not in the list and is visible, increment delay
        if (!hasTopBannerInList && isTopBannerMainInViewport) {
          delayAdjustment++;
        }

        // If newsPageMain is in the viewport, apply additional adjustments
        if (isNewsPageMainInViewport) {
          if (
            topBannerMain.classList.contains("animated") ||
            newsPageMain.classList.contains("animated")
          ) {
            delayAdjustment--;
          }
          if (isTopBannerMainInViewport && footerInViewport) {
            delayAdjustment--;
          }
          if (!footerInViewport && hasTopBannerInList) {
            delayAdjustment--;
          }
          delayAdjustment++; // Final adjustment when newsPageMain is visible

          delayCounter += delayAdjustment;

          setTimeout(() => {
            newsPageMain.classList.add("fadeOutDown");
          }, (delayCounter - 1) * 600);
        } else {
          // If newsPageMain is not visible, simply apply the base adjustment
          delayCounter += delayAdjustment;
        }
      }

      // From news to non-news pages
      if (
        currentPage === "/pages/news.html" &&
        (targetUrl.startsWith("./our-approach.html") ||
          targetUrl === "./leadership.html" ||
          targetUrl === "../index.html")
      ) {
        if (!isNewsPageMainInViewport) return;
        // Adjust delay if "news_page_main" is not part of fadeInUpElements
        if (!containsElementWithId(fadeInUpElements, "news_page_main")) {
          delayCounter++;
        }

        setTimeout(() => {
          newsPageMain.style.animationDelay = `${(delayCounter - 2) * 600}ms`;
          topBannerMain.style.animationDelay = `${(delayCounter - 1) * 600}ms`;

          newsPageMain.classList.add("fadeOutDown");
        }, 0);

        // Adjust delay if "top_banner_main" is not part of fadeInUpElements
        if (!containsElementWithId(fadeInUpElements, "top_banner_main")) {
          delayCounter++;
        }
        // If footer is visible, stagger animations with delay
        if (footerInViewport) {
          setTimeout(() => {
            if (!isTopBannerMainInViewport) {
              newsPageMain.style.animationDelay = `${
                (delayCounter - 1) * 600
              }ms`;
              articleTitleBlock.style.animationDelay = `${
                (delayCounter - 2) * 600
              }ms`;
            }
            topBannerMain.classList.add("fadeOutDown");
          }, 0);
        } else {
          // No footer: fire immediately but with correct delay
          setTimeout(() => {
            newsPageMain.style.animationDelay = `${(delayCounter - 2) * 600}ms`;
            topBannerMain.style.animationDelay = `${
              (delayCounter - 1) * 600
            }ms`;
            topBannerMain.classList.add("fadeOutDown");
          }, 0);
        }
      }

      // From articles to non-news pages
      if (
        (currentPage.startsWith("/pages/articles/") &&
          targetUrl !== "./articles/" + pinnedFilePath &&
          (targetUrl === "../leadership.html" ||
            targetUrl === "../../index.html")) ||
        targetUrl.startsWith("../our-approach.html")
      ) {
        const hasTopBannerInList = containsElementWithId(
          fadeInUpElements,
          "top_banner_main"
        );

        if (!hasTopBannerInList) {
          if (footerInViewport && isTopBannerMainInViewport) {
            topBannerMain.style.animationDelay = `${delayCounter * 600}ms`;
            delayCounter++;
          } else {
            topBannerMain.style.animationDelay = `${delayCounter * 600}ms`;
            delayCounter++;
          }
        }

        if (footerInViewport && !isArticleTopInViewport) {
          delayCounter--;
        }

        setTimeout(() => {
          topBannerMain.classList.add("fadeOutDown");
        }, 0);
      }

      // From News to pinned article
      if (
        currentPage === "/pages/news.html" &&
        targetUrl === "./articles/" + pinnedFilePath
      ) {
        delayCounter = fadeInUpElements.length;
        if (
          containsElementWithId(fadeInUpElements, "news_page_main") &&
          containsElementWithId(fadeInUpElements, "top_banner_main")
        ) {
          delayCounter -= 2;
        }
        if (!footerInViewport) {
          delayCounter--;
        }
      }

      // from article page to news page
      if (
        currentPage.startsWith("/pages/articles/") &&
        (targetUrl === "../news.html" || targetUrl === "../../news.html")
      ) {
        if (!containsElementWithId(fadeInUpElements, "top_banner_main")) {
          delayCounter--;
        }
      }

      setTimeout(() => {
        // console.log(
        //   `Redirecting to ${targetUrl} after a delay of ${
        //     delayCounter * 600 + 800
        //   } ms`
        // );
        window.location.href = targetUrl;
      }, delayCounter * 600 + 800);
    });
  });
}
