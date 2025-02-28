// ============================
// Reusable isInViewport functions
// ============================
function isInViewport(element) {
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
function handleMainNewsFade() {
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

// =============================================================
// Handle navigation logic for the rest of the page
// =============================================================
function handleNavigation(fadeInUpElements) {
  const navLinks = document.querySelectorAll("nav a");
  const logoLinks = document.querySelectorAll("header a img");
  const footerLinks = document.querySelectorAll("footer a img");
  const headerLinks = document.querySelectorAll("header a");
  const linkBack = document.querySelectorAll(".link-back");
  const clickMe = document.querySelectorAll(".click-me");
  const linkBackNews = document.querySelectorAll(".link-back-news");
  const newsPageMain = document.getElementById("news_page_main");
  const topBannerMain = document.getElementById("top_banner_main");
  const pinnedFilePath = localStorage.getItem("pinnedFilePath");
  const articleTitle = document.getElementById("article_title");
  const articleTop = document.getElementById("article_top");
  const outcomesLinks = document.querySelectorAll(".outcomes block");

  const allLinks = [
    ...clickMe,
    ...navLinks,
    ...logoLinks,
    ...footerLinks,
    ...headerLinks,
    ...linkBack,
    ...linkBackNews,
    ...outcomesLinks,
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
        const isArticleTopInViewport =
        articleTop && isInViewport(articleTop);

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

            setTimeout(
              () => {
                console.log("delayCounter = " + delayCounter);

                newsPageMain.classList.add("fadeOutDown");
              },
              (delayCounter - 1) * 600
            );
          }
        }

        if (isTopBannerMainInViewport) {
          delayCounter++;
          setTimeout(
            () => {
              topBannerMain.classList.add("fadeOutDown");
            },
            (delayCounter - 1) * 600
          );
        }
      }

      // from news to non-pinned articles
      if (
        currentPage === "/pages/news.html" &&
        targetUrl.startsWith("./articles/") &&
        targetUrl !== "./articles/" + pinnedFilePath
      ) {
        if (isNewsPageMainInViewport) {
          if (
            topBannerMain.classList.contains("animated") ||
            newsPageMain.classList.contains("animated")
          ) {
            delayCounter--;
          }
          console.log("reachme 01");

          delayCounter++;
          setTimeout(
            () => {
              newsPageMain.classList.add("fadeOutDown");
            },
            (delayCounter - 1) * 600
          );
        }
      }

      // from news to approach or leadership
      if (
        currentPage === "/pages/news.html" &&
        (targetUrl === "./our-approach.html" ||
          targetUrl === "./leadership.html")
      ) {
        if (isNewsPageMainInViewport) {
          if (
            topBannerMain.classList.contains("animated") ||
            newsPageMain.classList.contains("animated")
          ) {
            delayCounter--;
          } else {
            delayCounter++;
          }

          delayCounter++;
          setTimeout(
            () => {
              newsPageMain.classList.add("fadeOutDown");
            },
            (delayCounter - 2) * 600
          );

          setTimeout(
            () => {
              topBannerMain.classList.add("fadeOutDown");
            },
            (delayCounter - 2) * 600 + 600
          );
        }
      }

      // From articles to approach or leadership
      if (
        currentPage.startsWith("/pages/articles/") &&
        targetUrl !== "./articles/" + pinnedFilePath &&
        (targetUrl === "../our-approach.html" ||
          targetUrl === "../leadership.html" ||
          targetUrl === "../../index.html" ||
          targetUrl === "../news.html")
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

          setTimeout(
            () => {
              topBannerMain.classList.add("fadeOutDown");
            },
            (delayCounter - 1) * 600
          );
        }
      }

      // From News to pinned article
      if (
        currentPage === "/pages/news.html" &&
        // targetUrl === "./articles/pinned.html"
        targetUrl === "./articles/" + pinnedFilePath
      ) {
        if (localStorage.getItem("newsFade") === "true") {
          if (delayCounter <= 1) {
          } else {
            delayCounter--;
            delayCounter--;

            if (footerInViewport) {
              delayCounter++;
            }
          }
        }
        localStorage.setItem("newsFade", false);
      }

      setTimeout(
        () => {
          console.log(
            `Redirecting to ${targetUrl} after a delay of ${delayCounter * 600 + 800} ms`
          );
          window.location.href = targetUrl;
        },
        delayCounter * 600 + 800
      );
    });
  });
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

// ================================
// Scroll position mgmt
// ================================
function storeScrollPosition() {
  sessionStorage.setItem("scrollPosition", window.scrollY);
}
function restoreScrollPosition() {
  const storedScrollPosition = sessionStorage.getItem("scrollPosition");
  const topBannerMain = document.getElementById("top_banner_main");

  if (storedScrollPosition !== null) {
    window.scrollTo(0, parseInt(storedScrollPosition, 10));

    // Check if "top_banner_main" is in viewport after restoring scroll position
    if (isInViewport(topBannerMain)) {
      // Prevent animation if visible
      sessionStorage.setItem("dontAnimateBanner", "true");
      // topBannerMain.classList.remove("fadeInUp", "animated");
    } else {
      // Clear scroll position if not visible and re-enable animations
      clearScrollPosition();
      sessionStorage.removeItem("dontAnimateBanner");
    }
  }

  // Show the page content after restoring scroll
  document.body.classList.remove("preload");
}
// function manageTopBannerAnimation() {
//   const topBannerMain = document.getElementById("top_banner_main");
//   const dontAnimate = sessionStorage.getItem("dontAnimateBanner");

//   if (topBannerMain) {
//     if (dontAnimate === "true") {
//       // Prevent animation
//       topBannerMain.classList.remove("animated-banner");
//     } else {
//       // Animate normally
//       topBannerMain.classList.add("animated-banner");
//     }
//   }
// }
function isTargetPage() {
  const pinnedFileName = localStorage.getItem("pinnedFileName");
  const currentPage = window.location.pathname.split("/").pop();
  return (
    currentPage === "news.html" ||
    currentPage === "pinned.html" ||
    currentPage === "dizzy.html" ||
    currentPage === "musings.html" ||
    currentPage === "letter.html" ||
    currentPage === "template.html" ||
    currentPage === "bny.html" ||
    currentPage === "ahhh.html" ||
    currentPage === `${pinnedFileName}`
  );
}
function clearScrollPosition() {
  sessionStorage.removeItem("scrollPosition");
  window.scrollTo(0, 0);
}
document.addEventListener("DOMContentLoaded", () => {
  const topBannerMain = document.getElementById("top_banner_main");

  if (isTargetPage()) {
    restoreScrollPosition();
    // manageTopBannerAnimation();
    window.addEventListener("scroll", storeScrollPosition);
  } else {
    clearScrollPosition();
  }
});

// ======================================
// For debugging total animation time
// ======================================
function calculateAnimationDuration() {
  const fadeInUpElements = document.querySelectorAll(".fadeInUp");
  const baseDuration = 600;
  const additionalDuration = 300;
  console.log(baseDuration * fadeInUpElements.length + additionalDuration);
  return baseDuration + fadeInUpElements.length * additionalDuration;
}

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

// ========================
// Additional fade APIs
// ========================
function addFadeInUp() {
  const block = document.querySelectorAll(".above_read_full");
  block.forEach(function (item) {
    if (item) {
      item.classList.add("fadeInUp", "animated");
    }
  });
}
function addFadeInUpToArticle() {
  const newsPageMain = document.getElementById("news_page_main");

  // Add fadeInUp class to the news_page_main element
  if (newsPageMain) {
    newsPageMain.classList.add("fadeInUp", "animated");
  }
}
function addFadeOutDown() {
  // Calculate total animation duration based on elements
  const totalAnimationDuration = 600;
  let elements_for_fade = [
    {
      element: document.getElementById("news_page_main"),
      delay: `${totalAnimationDuration}ms`,
    },
    {
      element: document.getElementById("top_banner_main"),
      delay: `${totalAnimationDuration + 600}ms`,
    },
  ];
  elements_for_fade.forEach(function (item) {
    if (item.element) {
      item.element.style.animationDelay = item.delay;
      item.element.classList.add("fadeOutDown", "animated");
    }
  });
}
function staticTitle() {
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
function handleFadeAndRedirect() {
  // Check if already on the target page
  if (window.location.pathname === `/pages/articles/${pinnedFilePath}`) {
    return;
  }

  // Remove "fadeInUp" and "animated" classes from elements with class "above_read_full"
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

  // Redirect after all animations are done
  exitFadeTimeout = setTimeout(
    () => {
      window.location = `../pages/articles/${pinnedFilePath}`;
    },
    elements.length * 600 + 800 // Add an extra delay for smooth transition
  );
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
// document.addEventListener("DOMContentLoaded", () => {
//   getPinnedPage();
// });


// =======================================
// Outcomes page hover effects
// =======================================
// document.addEventListener("DOMContentLoaded", function() {
//   const blocks = document.querySelectorAll('.outcomes block');
//   const videoElement = document.getElementById('video');
//   console.log(videoElement);
//   const videoSource = videoElement.querySelector('source');



//   blocks.forEach(block => {
//     const targets = block.querySelectorAll(' h3, h4, img, percemt, number');

//     targets.forEach(target => {
//       target.addEventListener('mouseenter', function() {
//         block.classList.add('hovered');

//         const newVideoSrc = block.getAttribute('data-video');
//         if (newVideoSrc) {
//           videoSource.src = newVideoSrc;
//           videoElement.load();
//           videoElement.style.opacity = "0.2";
//         }
//       });

//       target.addEventListener('mouseleave', function() {
       
//         block.classList.remove('hovered');
//         videoElement.style.opacity = "0";
//       });
//     });
//   });
// });

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
