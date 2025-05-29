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

// NEW: detect if the last‑loaded page was /news.html
export function wasPreviousPageNews() {
  const prev = sessionStorage.getItem("currentPagePath") || "";
  return prev.endsWith("/news.html");
}

export function clearScrollPosition() {
  sessionStorage.removeItem("scrollPosition");
  // sessionStorage.setItem("scrollPosition", "0");
  window.scrollTo(0, 0);
}

export function storeScrollPosition() {
  // Always store the scroll position
  sessionStorage.setItem("scrollPosition", window.scrollY.toString());
  // console.log('reachme B ' + sessionStorage.getItem("scrollPosition"));


  // Check that topBannerMain exists before testing visibility
  if (typeof topBannerMain !== "undefined" && topBannerMain) {
    sessionStorage.setItem(
      "bannerWasVisible",
      isInViewport(topBannerMain) ? "true" : "false"
    );
  } else {
    // If it’s missing, you may choose a default:
    sessionStorage.setItem("bannerWasVisible", "false");
  }

  // Grab the news page element, if it exists
  const newsPageMain = document.getElementById("news_page_main");
  if (newsPageMain) {
    sessionStorage.setItem(
      "articleWasVisible",
      isInViewport(newsPageMain) ? "true" : "false"
    );
  } else {
    sessionStorage.setItem("articleWasVisible", "false");
  }
}

export function restoreScrollPosition() {
  const storedScrollPosition = sessionStorage.getItem("scrollPosition");
  // console.log('reachme A ' + storedScrollPosition);
  // console.log('reachme C ' + sessionStorage.getItem("currentPagePath") || "");
  if ((storedScrollPosition === null || storedScrollPosition === "0") && (!(sessionStorage.getItem("currentPagePath") === "/pages/news.html"))) {
    // console.log("reachme D");
    // Direct load: trigger banner + article animation if we did *not* just come from news.html
    topBannerMain?.classList.add("fadeInUp", "animated");
 
    setTimeout(() => {
      topBannerMain?.classList.remove("fadeInUp", "animated");
    }, 1000);

    // only animate the article on direct‐load *and* if previous page wasn’t news.html
    const newsArticle = document.getElementById("news_page_main");
    if (newsArticle && !wasPreviousPageNews()) {
      newsArticle.classList.add("fadeInUp", "animated");
      setTimeout(() => {
        newsArticle.classList.remove("fadeInUp", "animated");
      }, 0);
    }
    document.body.classList.remove("preload");

    // **Set a default value so this branch only runs once**
    sessionStorage.setItem("scrollPosition", "0");
    sessionStorage.setItem("bannerWasVisible", "true");   // or "false", whichever default you prefer
    sessionStorage.setItem("articleWasVisible", "false"); // adjust as needed

    // record this page as “previous” for next load
    sessionStorage.setItem("currentPagePath", window.location.pathname);

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

  // at the very end, always record this page as “previous”
  sessionStorage.setItem("currentPagePath", window.location.pathname);
}
