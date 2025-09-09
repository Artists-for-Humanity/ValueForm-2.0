// scrollPosition.js  • v2.2
// Keeps the Outcomes banner static when navigating within the Outcomes route,
// while preserving pinned/news behaviors and scroll restoration.
// Requires: isInViewport from ./script.js

import { isInViewport } from "./script.js";

const topBannerMain = document.getElementById("top_banner_main");

// --------------------- Shared utils ---------------------
const pinnedFileName = () => localStorage.getItem("pinnedFileName"); // e.g., "bny.html"
const filePart = (p = "") => p.split("/").pop();
const looksPinned = (path = "") =>
  !!pinnedFileName() && filePart(path) === pinnedFileName() && path.includes("/pinned/");

// --------------------- Outcomes route helpers ---------------------
const looksOutcomesLanding = (path = "") => path === "/pages/outcomes.html";
const looksOutcomesSubpage = (path = "") =>
  path.startsWith("/pages/outcomes/") && path.endsWith(".html");

export function isCurrentPageOutcomesSubpage() {
  return looksOutcomesSubpage(window.location.pathname);
}
export function wasPreviousPageOutcomesLanding() {
  const prev = sessionStorage.getItem("currentPagePath") || "";
  return looksOutcomesLanding(prev);
}
export function wasPreviousPageOutcomesRoute() {
  const prev = sessionStorage.getItem("currentPagePath") || "";
  return looksOutcomesLanding(prev) || looksOutcomesSubpage(prev);
}

// --------------------- Existing helpers ---------------------
export function isCurrentPagePinnedArticle() {
  return looksPinned(window.location.pathname);
}

export function wasPreviousPagePinnedArticle() {
  const prevPath = sessionStorage.getItem("currentPagePath") || "";
  if (!prevPath) return false;
  return looksPinned(prevPath);
}

// Was the previous page /news.html ?
export function wasPreviousPageNews() {
  const prev = sessionStorage.getItem("currentPagePath") || "";
  return prev.endsWith("/news.html");
}

// --------------------- Scroll position API ---------------------
export function clearScrollPosition() {
  sessionStorage.removeItem("scrollPosition");
  window.scrollTo(0, 0);
}

export function storeScrollPosition() {
  // Always store the scroll position
  sessionStorage.setItem("scrollPosition", String(window.scrollY));

  // Track current banner visibility (if present)
  if (topBannerMain) {
    sessionStorage.setItem(
      "bannerWasVisible",
      isInViewport(topBannerMain) ? "true" : "false"
    );
  } else {
    sessionStorage.setItem("bannerWasVisible", "false");
  }

  // Track news article visibility (if present)
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

  // ---------- Outcomes guard (EARLY) ----------
  // If we are on an Outcomes subpage or came from any Outcomes page,
  // and the banner is in view, strip any entrance classes up front so
  // later branches cannot re-add them.
  const onOutcomesSubpage = isCurrentPageOutcomesSubpage();
  const prevWasOutcomesRoute = wasPreviousPageOutcomesRoute();
  if (topBannerMain && (onOutcomesSubpage || prevWasOutcomesRoute)) {
    const bannerInViewNow = isInViewport(topBannerMain);
    if (bannerInViewNow) {
      topBannerMain.classList.remove("fadeInUp", "animated");
      sessionStorage.setItem("dontAnimateBanner", "true");
    }
  }
  // -------------------------------------------

  // Direct load (not from /news.html): animate once, then strip
  if (
    (storedScrollPosition === null || storedScrollPosition === "0") &&
    sessionStorage.getItem("currentPagePath") !== "/pages/news.html"
  ) {
    // Let the first paint do a brief intro (if markup provides it), then remove
    setTimeout(() => {
      topBannerMain?.classList.remove("fadeInUp", "animated");
    }, 1000);

    // If this page has a news article container and we didn’t come from news,
    // allow it a one-time entrance on direct loads.
    const newsArticle = document.getElementById("news_page_main");
    if (newsArticle && !wasPreviousPageNews()) {
      newsArticle.classList.add("fadeInUp", "animated");
    }

    document.body.classList.remove("preload");

    // Seed defaults so this branch only runs once
    sessionStorage.setItem("scrollPosition", "0");
    sessionStorage.setItem("bannerWasVisible", "true");
    sessionStorage.setItem("articleWasVisible", "false");
    sessionStorage.setItem("currentPagePath", window.location.pathname);
    return;
  }

  // Read prior visibility state
  const storedBannerVisibility = sessionStorage.getItem("bannerWasVisible");
  const storedArticleVisibility = sessionStorage.getItem("articleWasVisible");
  const bannerWasVisible = storedBannerVisibility === "true";
  const articleWasVisible = storedArticleVisibility === "true";

  // Where are we?
  const onPinnedArticle =
    isCurrentPagePinnedArticle() || wasPreviousPagePinnedArticle();

  if (storedScrollPosition !== null) {
    const scrollY = parseInt(storedScrollPosition, 10) || 0;
    const viewportHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    // If the stored position is too deep for this page, clear & do a quick intro
    const isTooDeep = scrollY + viewportHeight > pageHeight;
    if (isTooDeep) {
      topBannerMain?.classList.add("fadeInUp", "animated");

      clearScrollPosition();
      sessionStorage.removeItem("dontAnimateBanner");

      setTimeout(() => {
        topBannerMain?.classList.remove("fadeInUp", "animated");
      }, 1000);

      document.body.classList.remove("preload");
      sessionStorage.setItem("currentPagePath", window.location.pathname);
      return;
    }

    // If the banner was visible previously (or we’re returning to a pinned article),
    // keep it static and restore the scroll position.
    if (onPinnedArticle && (bannerWasVisible || articleWasVisible)) {
      topBannerMain?.classList.remove("fadeInUp", "animated");
      window.scrollTo(0, scrollY);
      sessionStorage.setItem("dontAnimateBanner", "true");
    } else if (bannerWasVisible) {
      topBannerMain?.classList.remove("fadeInUp", "animated");
      window.scrollTo(0, scrollY);
      sessionStorage.setItem("dontAnimateBanner", "true");
    } else {
      // Banner wasn’t visible last time; allow a one-time entrance
      topBannerMain?.classList.add("fadeInUp", "animated");
      clearScrollPosition();
      sessionStorage.removeItem("dontAnimateBanner");
    }

    // Always strip classes after the brief intro
    setTimeout(() => {
      topBannerMain?.classList.remove("fadeInUp", "animated");
    }, 1000);
  }

  document.body.classList.remove("preload");
  sessionStorage.setItem("currentPagePath", window.location.pathname);
}
