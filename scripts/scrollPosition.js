import { isInViewport } from "./script.js";

const topBannerMain = document.getElementById("top_banner_main");

// ================================
// Scroll position mgmt
// ================================

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
}

export function restoreScrollPosition() {
  const storedScrollPosition = sessionStorage.getItem("scrollPosition");
  const storedBannerVisibility = sessionStorage.getItem("bannerWasVisible");
  const newsPageMain = document.getElementById("news_page_main");

  const currentPath = window.location.pathname;
  const pinnedFilePath = localStorage.getItem("pinnedFilePath");
  const pinnedPath = "/pages/articles/" + pinnedFilePath;

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

    // Check if elements would be visible
    const bannerTop = topBannerMain?.offsetTop || Infinity;
    const bannerBottom = bannerTop + (topBannerMain?.offsetHeight || 0);

    const articleTop = newsPageMain?.offsetTop || Infinity;
    const articleBottom = articleTop + (newsPageMain?.offsetHeight || 0);

    const bannerWouldBeVisible =
      bannerBottom > scrollY && bannerTop < scrollY + viewportHeight;
    const articleWouldBeVisible =
      articleBottom > scrollY && articleTop < scrollY + viewportHeight;

    const bannerWasVisible = storedBannerVisibility === "true";

    if (bannerWasVisible) {
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
}