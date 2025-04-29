//script.js

import { handleNavigation } from "./navigation.js";
import { storeScrollPosition, restoreScrollPosition, clearScrollPosition } from "./scrollPosition.js";
// console.log("running main script")

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
      console.warn("No pinned article link found.");
      localStorage.removeItem("pinnedFilePath");
    }
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
  const fadeInUpElements = Array.from(
    document.querySelectorAll(".fadeInUp:not(nav)")
  );

  setTimeout(() => {
    let viewportIndex = 0;
    fadeInUpElements.forEach((element) => {
      if (isInViewport(element)) {
        element.style.animationDelay = `${viewportIndex * 600}ms`;
        element.classList.add("animated");
        viewportIndex++;
      } else {
        element.style.visibility = "visible";
      }
    });
  }, 10);

  handleNavigation(fadeInUpElements);

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

  if ((!isInViewNow && wasInViewport) || (!isInViewNow && !headerChecked)) {
    sessionStorage.removeItem("dontAnimateHeader");
    wasInViewport = false;
    headerChecked = true;
  } else if (
    (isInViewNow && !wasInViewport) ||
    (isInViewNow && !headerChecked)
  ) {
    sessionStorage.setItem("dontAnimateHeader", "true");
    wasInViewport = true;
    headerChecked = true;
  }
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

  if (element) {
    // First load
    if (dontAnimate != "true") {
      element.classList.add("animated-header");
    }
  }
}

function isTargetPage() {
  const pinnedFileName = localStorage.getItem("pinnedFileName");
  const currentPage = window.location.pathname.split("/").pop();

  const articles = localStorage.getItem("articles");

  return (
    currentPage === "news.html" ||
    currentPage === "pinned.html" ||
    articles.includes(currentPage) ||
    currentPage === `${pinnedFileName}`
  );
}
// function clearScrollPosition() {
//   console.log("clearing scroll position V1.0");
//   sessionStorage.removeItem("scrollPosition");
//   window.scrollTo(0, 0);
// }
document.addEventListener("DOMContentLoaded", () => {
  const topBannerMain = document.getElementById("top_banner_main");

  if (isTargetPage()) {
    restoreScrollPosition();
    // manageTopBannerAnimation();
    window.addEventListener("scroll", storeScrollPosition);
  } else {
    console.log("isTarget page = false");
    clearScrollPosition();
  }
});

// ======================================================
// Remove fadeInUp based on the referring page
// ======================================================
document.addEventListener("DOMContentLoaded", function () {
  // Define elements with their fade-in delay
  let elementsForFade = [
    { element: document.getElementById("news_page_main"), delay: "600ms" },

    { element: document.getElementById("top_banner_main"), delay: "1200ms" },
  ];

  // Get the referring page URL
  const previousPage = document.referrer;

  // Logic for pinned article
  const pinnedFilePath = localStorage.getItem("pinnedFilePath");
  if (previousPage.includes(`/pages/articles/${pinnedFilePath}`)) {
    if (localStorage.getItem("add_fade") === "false") {
      // Remove fadeInUp for both elements
      elementsForFade.forEach(({ element }) => {
        if (element) {
          element.classList.remove("fadeInUp", "animated");
        }
      });
    }
  } else {
    // For other pages, only remove fadeInUp from #top_banner_main
    const topBannerMain = document.getElementById("top_banner_main");
    if (topBannerMain && localStorage.getItem("add_fade") === "false") {
      topBannerMain.classList.remove("fadeInUp", "animated");
    }
  }

  // Reset fade status in localStorage for subsequent visits
  localStorage.setItem("add_fade", true);
});

export function staticTitle() {
  const item = document.querySelector("#top_banner_main.above_read_full");
  if (item) {
    item.classList.remove("fadeInUp", "animated");
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
  setTimeout(() => {
    window.location = `../pages/articles/${pinnedFilePath}`;
  }, elements.length * 600 + 800);
}
// Clear timeouts on page unload or restore
window.addEventListener("beforeunload", () => {
  clearTimeout(exitFadeTimeout);
});
// Handle bfcache and back button navigation
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    clearTimeout(exitFadeTimeout);
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
// Load pinned file on DOMContentLoaded
// =======================================
document.addEventListener("DOMContentLoaded", () => {
  getPinnedPage();
  getArticles();
});

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
  animateOnLoad();
  animateHeader("animatedHeader");
  animateOncePerSession("animatedNav", "animated-nav");
  watchHeaderInView();
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
