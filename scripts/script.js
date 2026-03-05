//script.js
import { handleNavigation } from "./navigation.js";
import { handleOutcomesNavigation } from "./outcomes-navigation.js";
import { storeScrollPosition, restoreScrollPosition, clearScrollPosition, isCurrentPagePinnedArticle } from "./scrollPosition.js";



// ============================
// Reusable isInViewport functions
// ============================
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ========================================
//  Logic to handle fade for news
// ========================================
export function handleMainNewsFade() {
  const elements = document.querySelectorAll(".title_fade");
  if (elements.length > 0) {
    elements.forEach((element) => {
      if (isInViewport(element)) {
        localStorage.setItem("add_fade", false);
      } else {
        localStorage.setItem("add_fade", true);
      }
    });
  }
  return false;
}

function getPinnedPage() {
  if (window.location.pathname.includes("news.html")) {
    const pinnedLink = document.getElementById("pinned-article-link");
    let pinnedFilePath = localStorage.getItem("pinnedFilePath");

    if (pinnedLink) {
      const href = pinnedLink.getAttribute("href");
      if (href) {
        const fileName = href.split("/").pop(); // Get the last part after '/'
        localStorage.setItem("pinnedFileName", fileName);
        pinnedFilePath = `pinned/${fileName}`;
      }
    }

    if (pinnedFilePath) {
      localStorage.setItem("pinnedFilePath", pinnedFilePath);
    } else {
      localStorage.removeItem("pinnedFilePath");
    }
  }
  else if (!window.location.pathname.includes("news.html")) {
    // Direct load of a pinned article: derive and store its filename/path
    const fileName = window.location.pathname.split("/").pop();
    localStorage.setItem("pinnedFileName", fileName);
    localStorage.setItem("pinnedFilePath", `pinned/${fileName}`);
  }
}

function getArticles() {
  if (window.location.pathname.includes("news.html")) {
    let articles = localStorage.getItem("articles");
    const articleLinks = document.querySelectorAll('a[href^="./articles/"]');
    articles = [];

    articleLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const fileName = href.split("/").pop();
      articles.push(fileName);
    });
    localStorage.setItem("articles", JSON.stringify(articles));
    return articles;
  }
}

// ============================
// Standard page load anims
// ============================
function animateOnLoad() {
  console.log(`[ANIMATE ON LOAD] 🔍 Starting function at ${Date.now()}`);

  // EXPLICIT CHECK: Does top_banner_main exist BEFORE querySelectorAll?
  const topBannerDirect = document.getElementById("top_banner_main");
  console.log(`[ANIMATE ON LOAD] 📍 Direct getElementById check BEFORE querySelectorAll:`, {
    exists: !!topBannerDirect,
    classList: topBannerDirect?.classList.toString(),
    hasFadeInUp: topBannerDirect?.classList.contains('fadeInUp'),
    parentElement: topBannerDirect?.parentElement?.tagName,
    offsetParent: topBannerDirect?.offsetParent?.tagName,
    offsetHeight: topBannerDirect?.offsetHeight,
    isVisible: topBannerDirect && topBannerDirect.offsetHeight > 0,
    timestamp: Date.now()
  });

  // Check computed styles
  if (topBannerDirect) {
    const styles = window.getComputedStyle(topBannerDirect);
    console.log(`[ANIMATE ON LOAD] 🎨 top_banner_main computed styles:`, {
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      height: styles.height,
      position: styles.position,
      zIndex: styles.zIndex
    });
  }

  // Collect all elements slated to fade in except nav items
  console.log(`[ANIMATE ON LOAD] 🔎 Running querySelectorAll(".fadeInUp:not(nav)") at ${Date.now()}`);
  const fadeInUpElements = Array.from(
    document.querySelectorAll(".fadeInUp:not(nav)")
  );

  // CHECK: Does querySelectorAll find top_banner_main?
  const foundById = fadeInUpElements.find(el => el.id === "top_banner_main");
  console.log(`[ANIMATE ON LOAD] ✅ querySelectorAll results:`, {
    totalCount: fadeInUpElements.length,
    foundTopBanner: !!foundById,
    topBannerIndex: fadeInUpElements.indexOf(foundById),
    allElementIds: fadeInUpElements.map(el => el.id || el.className.split(' ')[0]).join(', '),
    timestamp: Date.now()
  });

  // Check if we just navigated between Outcomes pages
  const topBanner = document.getElementById("top_banner_main");
  const keepStatic = sessionStorage.getItem("keepOutcomesBannerStatic");
  const isOutcomesRoute = window.location.pathname.includes("/outcomes");

  console.log(`[ANIMATE ON LOAD] 🏁 keepStatic logic check:`, {
    keepStatic,
    topBannerExists: !!topBanner,
    isOutcomesRoute,
    willApplyKeepStatic: keepStatic === "true" && topBanner && isOutcomesRoute
  });

  // ONLY apply keepStatic logic on Outcomes routes, not on news/article pages
  if (keepStatic === "true" && topBanner && isOutcomesRoute) {
    console.log(`[ANIMATE ON LOAD] ⚠️ Applying keepStatic logic - REMOVING fadeInUp from banner`);
    // Consume the flag so it doesn't persist beyond this load
    sessionStorage.removeItem("keepOutcomesBannerStatic");
    // Ensure the banner is visible if it was faded out on the previous page
    topBanner.classList.remove("fadeOutDown");
    /*
     * In Outcomes → subpage navigations, leaving the banner with the
     * `fadeInUp` class can cause it to animate on the next page load even
     * without the `animated` class. To truly keep it static, strip both
     * the entrance and animation classes here before we process the fade
     * list. The markup will provide `fadeInUp` again on the next load
     * when we navigate from non-outcomes pages.
     */
    topBanner.classList.remove("fadeInUp", "animated");
    // Remove the banner from the fade list so it isn't animated again
    const idx = fadeInUpElements.indexOf(topBanner);
    console.log(`[ANIMATE ON LOAD] 🗑️ Removing banner from fadeInUpElements array at index: ${idx}`);
    if (idx !== -1) fadeInUpElements.splice(idx, 1);
    console.log(`[ANIMATE ON LOAD] 📊 After removal, fadeInUpElements count: ${fadeInUpElements.length}`);
  }
  // For direct loads, the banner will animate naturally via the fadeInUpElements array

  // Stagger fade‑in for elements that are currently in view
  // Also trigger header animation at the same time for perfect sync
  setTimeout(() => {
    console.log(`[ANIMATE ON LOAD] Starting animations at ${Date.now()}, elements count: ${fadeInUpElements.length}`);

    // Trigger header animation FIRST, at the same moment
    const header = document.getElementById("animatedHeader");
    const dontAnimate = sessionStorage.getItem("dontAnimateHeader");
    console.log(`[HEADER ANIMATION] Time: ${Date.now()}, dontAnimate: ${dontAnimate}, element exists: ${!!header}`);

    if (header && dontAnimate != "true") {
      console.log(`[HEADER ANIMATION] Adding animated-header class at ${Date.now()}`);
      header.classList.add("animated-header");
    } else if (header) {
      console.log(`[HEADER ANIMATION] Skipping animation (dontAnimate=true)`);
    }

    // Now trigger banner/content animations at the SAME TIME
    let viewportIndex = 0;

    // Log all elements before processing
    fadeInUpElements.forEach((el) => {
      console.log(`[ANIMATE ON LOAD] Found element: ${el.id || el.className}, has fadeInUp: ${el.classList.contains('fadeInUp')}, has animated: ${el.classList.contains('animated')}`);
    });

    fadeInUpElements.forEach((element) => {
      const isTopBanner = element.id === 'top_banner_main';

      if (isTopBanner) {
        console.log(`[ANIMATE ON LOAD] ⭐ Processing top_banner_main:`, {
          hasFadeInUp: element.classList.contains('fadeInUp'),
          hasAnimated: element.classList.contains('animated'),
          allClasses: element.className,
          isInViewport: isInViewport(element),
          willAnimate: element.classList.contains('fadeInUp') && isInViewport(element),
          timestamp: Date.now()
        });
      }

      if (isInViewport(element)) {
        const delay = viewportIndex * 600;
        element.style.animationDelay = `${delay}ms`;
        element.classList.add("animated");

        if (isTopBanner) {
          console.log(`[ANIMATE ON LOAD] ⭐ TOP_BANNER_MAIN - ADDING animated class:`, {
            delay: `${delay}ms`,
            classesAfter: element.className,
            hasFadeInUp: element.classList.contains('fadeInUp'),
            hasAnimated: element.classList.contains('animated'),
            time: Date.now()
          });
        } else {
          console.log(`[ANIMATE ON LOAD] Element ${element.id || element.className} - delay: ${delay}ms, time: ${Date.now()}`);
        }
        viewportIndex++;
      } else {
        element.style.visibility = "visible";
        if (isTopBanner) {
          console.log(`[ANIMATE ON LOAD] ⭐ TOP_BANNER_MAIN NOT in viewport - making visible only`);
        }
      }
    });
  }, 10);

  // Delegate navigation handling based on the current path
  const pathname = window.location.pathname;
  if (pathname.includes("outcomes")) {
    handleOutcomesNavigation(fadeInUpElements);
  } else {
    handleNavigation(fadeInUpElements);
  }

  // Kick off any Lottie animations after initial page anims
  setTimeout(() => {
    const player = document.getElementById("lottieAnimation");
    if (player) player.play();
  }, 1000);
}

// ============================
// Animate once per session
// ============================
function animateOncePerSession(elementId, animationClass) {
  const element = document.getElementById(elementId);
  if (element && !sessionStorage.getItem(`${elementId}Animated`)) {
    element.classList.add(animationClass);
    sessionStorage.setItem(`${elementId}Animated`, "true");
  }
}

// ============================
// Manage header animation
// ============================
const header = document.getElementById("animatedHeader");
let wasInViewport = isInViewport(header);
let headerChecked = false;
function checkHeaderInView() {
  const header = document.getElementById("animatedHeader");
  const isInViewNow = isInViewport(header);

  console.log(`[CHECK HEADER] Time: ${Date.now()}, isInViewNow: ${isInViewNow}, wasInViewport: ${wasInViewport}, headerChecked: ${headerChecked}`);

  if ((!isInViewNow && wasInViewport) || (!isInViewNow && !headerChecked)) {
    console.log(`[CHECK HEADER] ✅ Removing dontAnimateHeader flag (header not in view)`);
    sessionStorage.removeItem("dontAnimateHeader");
    wasInViewport = false;
    headerChecked = true;
  } else if (
    (isInViewNow && !wasInViewport) ||
    (isInViewNow && !headerChecked)
  ) {
    console.log(`[CHECK HEADER] ⚠️ Setting dontAnimateHeader=true (header in view)`);
    sessionStorage.setItem("dontAnimateHeader", "true");
    wasInViewport = true;
    headerChecked = true;
  }

  console.log(`[CHECK HEADER] Final flag value: ${sessionStorage.getItem("dontAnimateHeader")}`);
}
function watchHeaderInView() {
  checkHeaderInView();

  window.addEventListener("scroll", () => {
    checkHeaderInView();
  });
}
function animateHeader(elementId) {

  const element = document.getElementById(elementId);
  const dontAnimate = sessionStorage.getItem("dontAnimateHeader");

  console.log(`[HEADER ANIMATION] Time: ${Date.now()}, dontAnimate: ${dontAnimate}, element exists: ${!!element}`);

  if (element) {
    // First load
    if (dontAnimate != "true") {
      console.log(`[HEADER ANIMATION] Adding animated-header class at ${Date.now()}`);
      element.classList.add("animated-header");
    } else {
      console.log(`[HEADER ANIMATION] Skipping animation (dontAnimate=true)`);
    }
  }
}

function isTargetPage() {
  const pinnedFileNameRaw = localStorage.getItem("pinnedFileName");
  const pinnedFileName = pinnedFileNameRaw !== null ? pinnedFileNameRaw : "";
  // const pinnedFileName = localStorage.getItem("pinnedFileName");
  const currentPage = window.location.pathname.split("/").pop();
  const currentPath = window.location.pathname;

  // const articles = localStorage.getItem("articles");
  const rawArticles = localStorage.getItem("articles");
  const articles = rawArticles ? JSON.parse(rawArticles) : [];

  // Check if this is an outcomes page (landing or case study subpage)
  const isOutcomesPage = currentPage === "outcomes.html" || currentPath.includes("/outcomes/");

  return (
    currentPage === "news.html" ||
    currentPage === "pinned.html" ||
    articles.includes(currentPage) ||
    currentPage === `${pinnedFileName}` ||
    isOutcomesPage
  );
}

document.addEventListener("DOMContentLoaded", () => {
  getPinnedPage();
  getArticles();
  const topBannerMain = document.getElementById("top_banner_main");

  // Add MutationObserver to track class changes on top_banner_main
  if (topBannerMain) {
    console.log(`[MUTATION OBSERVER] 👀 Starting to watch top_banner_main for class changes`);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          console.log(`[MUTATION] 🔄 top_banner_main class changed:`, {
            oldValue: mutation.oldValue,
            newValue: topBannerMain.className,
            hasFadeInUp: topBannerMain.classList.contains('fadeInUp'),
            hasAnimated: topBannerMain.classList.contains('animated'),
            timestamp: Date.now(),
            stack: new Error().stack.split('\n').slice(2, 5).join('\n')
          });
        }
      });
    });

    observer.observe(topBannerMain, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['class']
    });
  }

  if (isTargetPage()) {

    restoreScrollPosition();
    // manageTopBannerAnimation();
    window.addEventListener("scroll", storeScrollPosition);
  } else {
    clearScrollPosition();
  }
});


// ======================================================
// If we just came from a News article or Outcomes page and are landing on
// Outcomes / Home / Our Approach / Leadership / News,
// force scroll to top and fade the banner in once.
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const force = sessionStorage.getItem("forceTopAndFadeIn") === "true";
  if (!force) return;

  // Only act on these top-level pages
  const p = window.location.pathname;
  const isTopTarget =
    p.endsWith("/outcomes.html") ||
    p.endsWith("/index.html") ||
    p.endsWith("/our-approach.html") ||
    p.endsWith("/leadership.html") ||
    p.endsWith("/news.html");

  if (!isTopTarget) return;

  // Prevent browser auto-restoring scroll (happens before modules sometimes)
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const apply = () => {
    // hard reset scroll
    window.scrollTo(0, 0);

    // clear our own stored position so other logic won't try to restore
    sessionStorage.removeItem("scrollPosition");
    sessionStorage.setItem("bannerWasVisible", "true");
    sessionStorage.setItem("articleWasVisible", "false");

    // fade the page banner in once
    const tb = document.getElementById("top_banner_main");
    if (tb) {
      tb.classList.add("fadeInUp", "animated");
      setTimeout(() => tb.classList.remove("fadeInUp", "animated"), 1000);
    }
  };

  // Apply now…
  apply();
  // …and also on bfcache restores (Safari/WebKit edge cases)
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) apply();
  }, { once: true });

  // one-shot flag consumed
  sessionStorage.removeItem("forceTopAndFadeIn");
});

// ======================================================
// Remove fadeInUp based on the referring page
// ======================================================
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;
  const isNewsPage = path.endsWith("/news.html");
  const isOutcomesPage = path.endsWith("/outcomes.html");

  // Define fade targets based on page type (only used for news/outcomes pages)
  let elementsForFade = [];
  if (isNewsPage) {
    elementsForFade = [
      { element: document.getElementById("news_page_main"), delay: "600ms" },
      { element: document.getElementById("top_banner_main"), delay: "1200ms" },
    ];
  } else if (isOutcomesPage) {
    elementsForFade = [
      { element: document.getElementById("top_banner_main"), delay: "600ms" },
    ];
  }

  // Get the previous page from document.referrer
  const previousPage = document.referrer;

  // Logic for pinned article
  const pinnedFilePath = localStorage.getItem("pinnedFilePath");

  if (isNewsPage && previousPage.includes(`/pages/articles/${pinnedFilePath}`)) {
    // If coming from the pinned article, remove fadeInUp from both elements
    if (localStorage.getItem("add_fade") === "false") {
      elementsForFade.forEach(({ element }) => {
        if (element) element.classList.remove("fadeInUp", "animated");
      });
    }
  } else {
    // For other pages (including article pages), only remove fadeInUp from #top_banner_main
    const topBannerMain = document.getElementById("top_banner_main");
    if (topBannerMain && localStorage.getItem("add_fade") === "false") {
      topBannerMain.classList.remove("fadeInUp", "animated");
    }
  }

  // Reset for subsequent visits
  localStorage.setItem("add_fade", true);
});

// ======================================================
// Early: keep Outcomes banner static if we set the flag
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const isOutcomesRoute =
    path.endsWith("/outcomes.html") || path.includes("/pages/outcomes/");
  if (!isOutcomesRoute) return;

  const tb = document.getElementById("top_banner_main");
  const keepStatic = sessionStorage.getItem("keepOutcomesBannerStatic") === "true";

  // Clear the flag if this is a direct load or page refresh (referrer is same page or empty)
  const currentPath = window.location.pathname;
  const referrer = document.referrer;
  const referrerPath = referrer ? new URL(referrer, window.location.origin).pathname : '';
  const isDirectLoad = !referrer || referrerPath === currentPath || !referrer.includes("/pages/outcomes/");
  if (isDirectLoad) {
    sessionStorage.removeItem("keepOutcomesBannerStatic");
    return;
  }

  if (!keepStatic) return;

  if (!tb) return;

  // Strip entrance classes ASAP so no flash occurs
  tb.classList.remove("fadeInUp", "animated");
  // Also ensure it won't be in any entrance fade list that might have been queued
  // (animateOnLoad() already splices it, but removing here prevents any frame-1 flash)
});

// ======================================================
// Safety net: ensure Outcomes banner can re-animate when coming from News
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const isOutcomes = window.location.pathname.endsWith("/outcomes.html");
  const cameFromNews = /\/pages\/news\.html$/.test(document.referrer || "");
  if (!isOutcomes || !cameFromNews) return;

  const tb = document.getElementById("top_banner_main");
  if (!tb) return;

  // If anything stripped the classes during the News → Outcomes hop, restore them
  if (!tb.classList.contains("fadeInUp")) tb.classList.add("fadeInUp");
  tb.classList.remove("fadeOutDown");
  clearScrollPosition();
});

// ======================================================
// Safety net: ensure News banner can re-animate when coming from Outcomes
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const isNews = window.location.pathname.endsWith("/news.html");
  const cameFromOutcomes = /\/pages\/outcomes(\.html|\/)/.test(document.referrer || "");
  if (!isNews || !cameFromOutcomes) return;

  const tb = document.getElementById("top_banner_main");
  if (!tb) return;

  // If anything stripped the classes during the Outcomes → News hop, restore them
  if (!tb.classList.contains("fadeInUp")) tb.classList.add("fadeInUp");
  tb.classList.remove("fadeOutDown");
  clearScrollPosition();
});

export function addFadeInUp() {
  const topBannerMain = document.getElementById("top_banner_main");
  topBannerMain?.classList.add("fadeInUp", "animated");
}

export function staticTitle() {
  const item = document.querySelector("#top_banner_main.above_read_full");
  if (item) {
    item.classList.remove("fadeInUp", "animated");
    // Set flag so the banner stays static on the next Outcomes page
    sessionStorage.setItem("keepOutcomesBannerStatic", "true");
  } else {
    console.log(
      "Element #top_banner_main with class above_read_full not found."
    );
  }
}
function staticPreview() {
  const item = document.querySelector("#news_page_main.above_read_full");
  if (item) {
    item.classList.remove("fadeInUp", "animated");
  } else {
    console.log(
      "Element #news_page_main with class above_read_full not found."
    );
  }
}

// =======================================================
// When user clicks "read all articles" => fade & go
// =======================================================
let exitFadeTimeout; // Store timeout globally



export function handleFadeAndRedirect() {
  /* prevent scheduling twice if the user double‑clicks  */
  if (exitFadeTimeout) return;

  // Get pinned file path from localStorage
  let pinnedFilePath = localStorage.getItem("pinnedFilePath");

  if (!pinnedFilePath) {
    console.warn("pinnedFilePath is not set in localStorage.");
    return;
  }

  // Check if already on the target page
  if (window.location.pathname === `/pages/articles/${pinnedFilePath}`) {
    return;
  }

  // Remove "fadeInUp" and "animated" classes
  staticTitle();
  staticPreview();

  // Set localStorage for "newsFade"
  localStorage.setItem("newsFade", true);

  // Fade out elements with class "fade_link" and redirect after transition
  const elements = document.querySelectorAll(".fade_link");
  elements.forEach((div, index) => {
    div.classList.replace("fadeInUp", "fadeOutDown");
    div.style.animationDelay = `${index * 600}ms`;
  });

  // Redirect after animations
  // setTimeout(() => {
  exitFadeTimeout = setTimeout(() => {           // ① SAVE THE ID
    window.location = `../pages/articles/${pinnedFilePath}`;
  }, elements.length * 600 + 800);
}
// Clear timeouts on page unload or restore
window.addEventListener("beforeunload", () => {
  clearTimeout(exitFadeTimeout);                 // ② actually clears it
});
// Handle bfcache and back button navigation
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    clearTimeout(exitFadeTimeout);               // ③ clears after restore
  }
});
window.addEventListener("popstate", () => {
  clearTimeout(exitFadeTimeout);
});
const readAllButton = document.querySelector(".read-all-articles");
if (readAllButton && !readAllButton._hasListener) {
  readAllButton._hasListener = true; // Flag to prevent duplicate listeners
  readAllButton.addEventListener("click", handleFadeAndRedirect);
}
let isInitialized = false;

// =======================================
// Page cache/back button logic
// =======================================
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    handleCacheRestore(); // Handle cache-specific logic
  }
  initializePage();
});
function initializePage() {
  console.log(`[INIT PAGE] Starting initialization at ${Date.now()}`);
  console.log(`[INIT PAGE] dontAnimateHeader flag BEFORE animations: ${sessionStorage.getItem("dontAnimateHeader")}`);

  // Call animateOnLoad() which now handles BOTH header and banner animations
  // plus navigation setup - everything synchronized in one setTimeout
  animateOnLoad();

  // Animate nav once per session
  animateOncePerSession("animatedNav", "animated-nav");

  // Delay watchHeaderInView() so it doesn't interfere with initial animations
  setTimeout(() => {
    console.log(`[INIT PAGE] Now calling watchHeaderInView() at ${Date.now()}`);
    watchHeaderInView();
  }, 100);
}
function handleCacheRestore() {
  const currentPage = window.location.pathname;
  if (currentPage === "/pages/news.html") {
  }

  // Reverse fade-out animations to fade-in
  document.querySelectorAll(".fadeOutDown").forEach((el) => {
    el.classList.replace("fadeOutDown", "fadeInUp");
  });
}

export function armBannerFadeForNextPage() {
  sessionStorage.setItem("needsBannerFade", "true");
}


// Lazy-load Goof video after initial animations
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const vid = document.getElementById('goof-video');
    if (!vid) return;

    const sourceEl = vid.querySelector('source[data-src]');
    if (!sourceEl) return;

    // Move data-src into the actual src, then reload the video
    sourceEl.src = sourceEl.getAttribute('data-src');
    vid.load();
  }, 200);
});
