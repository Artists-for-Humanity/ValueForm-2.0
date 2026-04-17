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

  // Read stored visibility states early (used throughout this function)
  const storedBannerVisibility = sessionStorage.getItem("bannerWasVisible");
  const storedArticleVisibility = sessionStorage.getItem("articleWasVisible");

  // ---------- News page guard (EARLY) ----------
  // If we're on news.html and didn't come from an article, clear scroll and allow animation
  const onNewsPage = window.location.pathname.includes("/pages/news.html");
  const referrer = document.referrer;
  const cameFromArticle = referrer && referrer.includes("/pages/articles/");
  const isRefresh = !referrer || referrer === window.location.href;

  if (onNewsPage && (!cameFromArticle || isRefresh)) {
    // Clear stored position and allow normal fade-in animation
    sessionStorage.removeItem("scrollPosition");
    sessionStorage.removeItem("dontAnimateBanner");
    document.body.classList.remove("preload");
    return;
  }

  // ---------- Outcomes guard (EARLY) ----------
  // If we are on an Outcomes subpage or came from any Outcomes page,
  // check if the banner WAS visible on the PREVIOUS page to decide whether to animate.
  // This must check the stored visibility state, not the current viewport.
  const onOutcomesSubpage = isCurrentPageOutcomesSubpage();
  const prevWasOutcomesRoute = wasPreviousPageOutcomesRoute();

  // Check if this is a direct load (no referrer or self-referral)
  const currentUrl = window.location.href;
  const isDirectLoad = !referrer || referrer === currentUrl || !referrer.includes("/pages/outcomes/");

  // Check if current page is news-related (news.html or articles)
  const isNewsRelated = window.location.pathname.includes("/pages/news.html") ||
                        window.location.pathname.includes("/pages/articles/");

  const bannerWasVisibleOnPrevPage = storedBannerVisibility === "true";

  // Only strip classes if NOT a direct load AND NOT on news-related pages
  // AND the banner WAS visible on the previous page (not currently visible)
  if (topBannerMain && (onOutcomesSubpage || prevWasOutcomesRoute) && !isNewsRelated && !isDirectLoad) {
    if (bannerWasVisibleOnPrevPage) {
      topBannerMain.classList.remove("fadeInUp", "animated");
      sessionStorage.setItem("dontAnimateBanner", "true");
    }
  }
  // -------------------------------------------

  // Direct load (not from /news.html): animate once, then strip
  // BUT: Don't strip on outcomes subpages if it's a direct load - let them animate
  // AND: Don't strip on news-related pages - they have their own animation logic
  if (
    (storedScrollPosition === null || storedScrollPosition === "0") &&
    sessionStorage.getItem("currentPagePath") !== "/pages/news.html" &&
    !(onOutcomesSubpage && isDirectLoad) &&
    !isNewsRelated
  ) {
    // Let the first paint do a brief intro (if markup provides it), then remove
    setTimeout(() => {
      topBannerMain?.classList.remove("fadeInUp", "animated");
    }, 1000);

    // If this page has a news article container and we didn't come from news,
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

  // Parse prior visibility state (already read at top of function)
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

    // If the banner was visible previously (or we're returning to a pinned article),
    // keep it static and restore the scroll position.
    if (onPinnedArticle && (bannerWasVisible || articleWasVisible)) {
      topBannerMain?.classList.remove("fadeInUp", "animated");
      window.scrollTo(0, scrollY);
      sessionStorage.setItem("dontAnimateBanner", "true");

      // Clean up animation classes after a delay (for static banner case)
      setTimeout(() => {
        topBannerMain?.classList.remove("fadeInUp", "animated");
      }, 1000);
    } else if (bannerWasVisible) {
      topBannerMain?.classList.remove("fadeInUp", "animated");
      window.scrollTo(0, scrollY);
      sessionStorage.setItem("dontAnimateBanner", "true");

      // Clean up animation classes after a delay (for static banner case)
      setTimeout(() => {
        topBannerMain?.classList.remove("fadeInUp", "animated");
      }, 1000);
    } else {
      // Banner wasn't visible last time; allow a one-time entrance
      // Only add fadeInUp class here - let animateOnLoad() handle adding "animated"
      // This ensures the banner animates in sync with the header
      topBannerMain?.classList.add("fadeInUp");

      // Do NOT add "animated" class here - it will be added by animateOnLoad()
      clearScrollPosition();
      sessionStorage.removeItem("dontAnimateBanner");

      // DON'T set a setTimeout here - animateOnLoad() will handle the animation
      // and cleanup. The previous unconditional setTimeout was removing fadeInUp
      // before animateOnLoad() could process it!
    }
  }

  document.body.classList.remove("preload");
  sessionStorage.setItem("currentPagePath", window.location.pathname);
}
