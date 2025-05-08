import { isInViewport } from "./script.js";

const topBannerMain = document.getElementById("top_banner_main");
// const newsPageMain = document.getElementById("news_page_main");


// -- shared util ------------------------------------------------------------
const pinnedFileName = () => localStorage.getItem("pinnedFileName"); // "bny.html"
const filePart = (p = "") => p.split("/").pop(); // "bny.html"
const looksPinned = (path = "") =>
  !!pinnedFileName() &&
  filePart(path) === pinnedFileName() &&
  path.includes("/pinned/"); // keeps the “/pinned/” safety guard

// -- new helpers ------------------------------------------------------------
export function isCurrentPagePinnedArticle() {
  return looksPinned(window.location.pathname);
}

export function wasPreviousPagePinnedArticle() {
  const prevPath = sessionStorage.getItem("currentPagePath") || "";
  if (!prevPath) return false; // nothing recorded yet
  return looksPinned(prevPath); // re-use the same helper
}

export function clearScrollPosition() {
  sessionStorage.removeItem("scrollPosition");
  window.scrollTo(0, 0);
}

export function storeScrollPosition() {
  sessionStorage.setItem("scrollPosition", window.scrollY);

  // true | false (as a string) so it survives sessionStorage
  sessionStorage.setItem(
    "bannerWasVisible",
    isInViewport(topBannerMain) ? "true" : "false"
  );

  const newsPageMain = document.getElementById("news_page_main");
  sessionStorage.setItem(
    "articleWasVisible",
    newsPageMain && isInViewport(newsPageMain) ? "true" : "false"
  );
}

export function restoreScrollPosition() {
  const storedScrollPosition = sessionStorage.getItem("scrollPosition");
  if (storedScrollPosition === null) {
    // Direct load: trigger banner/header animation
    topBannerMain?.classList.add("fadeInUp", "animated");
    setTimeout(() => {
      topBannerMain?.classList.remove("fadeInUp", "animated");
    }, 1000);
    document.body.classList.remove("preload");
    return;
  }
  const storedBannerVisibility = sessionStorage.getItem("bannerWasVisible");
  const storedArticleVisibility = sessionStorage.getItem("articleWasVisible");
  const articleWasVisible = storedArticleVisibility === "true";
  const bannerWasVisible = storedBannerVisibility === "true";
  const onPinnedArticle =
    isCurrentPagePinnedArticle() || wasPreviousPagePinnedArticle(); // the page you’re on now

  //   const currentPath = window.location.pathname;
  const pinnedFilePath = localStorage.getItem("pinnedFilePath");
  //   const pinnedPath = "/pages/articles/" + pinnedFilePath;

  if (storedScrollPosition !== null) {
    const scrollY = parseInt(storedScrollPosition, 10);
    const viewportHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    // If scroll position is too deep for this page, clear it early
    const isTooDeep = scrollY + viewportHeight > pageHeight;
    if (isTooDeep) {
      topBannerMain?.classList.add("fadeInUp", "animated");

      clearScrollPosition();
      sessionStorage.removeItem("dontAnimateBanner");

      setTimeout(() => {
        topBannerMain?.classList.remove("fadeInUp", "animated");
      }, 1000);

      document.body.classList.remove("preload");
      return;
    }

    if (onPinnedArticle && (bannerWasVisible || articleWasVisible)) {
      topBannerMain?.classList.remove("fadeInUp", "animated");
      window.scrollTo(0, scrollY);
      sessionStorage.setItem("dontAnimateBanner", "true");
    } else if (bannerWasVisible) {
      topBannerMain?.classList.remove("fadeInUp", "animated");
      window.scrollTo(0, scrollY);
      sessionStorage.setItem("dontAnimateBanner", "true");
    } else {
      topBannerMain?.classList.add("fadeInUp", "animated");
      clearScrollPosition();
      sessionStorage.removeItem("dontAnimateBanner");
    }

    setTimeout(() => {
      topBannerMain?.classList.remove("fadeInUp", "animated");
    }, 1000);
  }

  document.body.classList.remove("preload");
  //   sessionStorage.removeItem("nextTargetPath");
}
