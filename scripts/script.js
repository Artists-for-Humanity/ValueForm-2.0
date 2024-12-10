// checks if element is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth)
  );
}

function handleMainNewsFade() {
  const elements = document.querySelectorAll(".news_page_airlines");

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

// handle animation behavior for almost all links
function handleNavigation(fadeInUpElements) {
  const navLinks = document.querySelectorAll("nav a");
  const logoLinks = document.querySelectorAll("header a img");
  const footerLinks = document.querySelectorAll("footer a img");
  const headerLinks = document.querySelectorAll("header a");
  const linkBack = document.querySelectorAll(".link-back");
  const clickMe = document.querySelectorAll(".click-me");
  const linkBackNews = document.querySelectorAll(".link-back-news");

  [
    ...clickMe,
    ...navLinks,
    ...logoLinks,
    ...footerLinks,
    ...headerLinks,
    ...linkBack,
    ...linkBackNews,
  ].forEach((element) => {
    const isAnchor = element.tagName.toLowerCase() === "a";
    const anchor = isAnchor ? element : element.closest("a") || element;

    if (anchor.classList.contains("disabled")) return;

    anchor.addEventListener("click", (e) => {
      const isPureAnchor =
        anchor.host === window.location.host &&
        anchor.pathname === window.location.pathname;

      if (isPureAnchor) {
        return;
      } else {
        e.preventDefault();
        const targetUrl = anchor.getAttribute("href");
        let delayCounter = 0;

        fadeInUpElements
          .filter(isInViewport)
          .reverse()
          .forEach((element, index) => {
            element.classList.replace("fadeInUp", "fadeOutDown");
            element.style.animationDelay = `${index * 600}ms`;
            // console.log("Animation Delay #" + index + " = " + element.style.animationDelay + "!!!!!!!")
            delayCounter++;
          });

        // Check the current page based on pathname or title
        const currentPage = window.location.pathname; // e.g., "/home", "/about"
        // const targetPage = window.location.pathname;
        const newsPageMain = document.getElementById("news_page_main");
        const topBannerMain = document.getElementById("top_banner_main");
        const isNewsPageMainInViewport =
          newsPageMain && isInViewport(newsPageMain);
        const isTopBannerMainInViewport =
          topBannerMain && isInViewport(topBannerMain);


        // Example: Add specific behavior for a certain page
        if (
          currentPage === "/pages/articles/pinned.html" &&
          targetUrl != "../news.html"
        ) {
          // Increment delayCounter for each ID that is in the viewport
          if (isNewsPageMainInViewport) {
            delayCounter++;
            setTimeout(
              () => {
                const NewsPageMain = document.getElementById("news_page_main");
                NewsPageMain.classList.add("fadeOutDown");
              },
              (delayCounter - 1) * 600
            );
          }

          if (isTopBannerMainInViewport) {
            delayCounter++;
            setTimeout(
              () => {
                const TopBannerMain =
                  document.getElementById("top_banner_main");
                TopBannerMain.classList.add("fadeOutDown");
                console.log("adding fadeOutDown");
              },
              (delayCounter - 1) * 600
            );
          } else {
            console.log("This is a different page");
          }
        }

        // New condition: Increment delayCounter if navigating from /pages/news.html to /pages/articles/*
        if (
          currentPage === "/pages/news.html" &&
          targetUrl.startsWith("./articles/") && targetUrl != ("./articles/pinned.html")
        ) {
          if (isNewsPageMainInViewport) {
            delayCounter++;
            setTimeout(
              () => {
                const NewsPageMain = document.getElementById("news_page_main");
                NewsPageMain.classList.add("fadeOutDown");
              },
              (delayCounter - 1) * 600
            );
          }
        }

        if (
          currentPage === "/pages/news.html" &&
          targetUrl === "./articles/pinned.html"
        ) {
          if (localStorage.getItem("newsFade") === "true") {
            if (isNewsPageMainInViewport) {
              delayCounter--;
            }
            if (isTopBannerMainInViewport) {
              delayCounter--;
            }
          }
          localStorage.setItem("newsFade", false);
        }


        setTimeout(
          () => {
            // console.log(currentPage + " This is the Current Page!!!!");
            // console.log(targetUrl + " This is the Target URL****");

            console.log(
              `Redirecting to ${targetUrl} after a delay of ${delayCounter * 600 + 800} ms`
            );
            window.location.href = targetUrl;
          },
          delayCounter * 600 + 800
        );
      }
    });
  });
}

//fades things in on load, initalizes navigation logic for the rest of the page, and plays the lottie animation
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

  // handleNavigation(fadeInUpElements);

  setTimeout(() => {
    const player = document.getElementById("lottieAnimation");
    if (player) player.play();
  }, 1000);
}

// animate an element once per session
function animateOncePerSession(elementId, animationClass) {
  const element = document.getElementById(elementId);
  if (element && !sessionStorage.getItem(`${elementId}Animated`)) {
    element.classList.add(animationClass);
    sessionStorage.setItem(`${elementId}Animated`, "true");
  }
}

const header = document.getElementById("animatedHeader");
let wasInViewport = isInViewport(header);
let headerChecked = false; // boolean that's false so we can hit one of the conditions in checkHeaderInView

// Check if the header is in view and set the session storage item
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
//calls check header in view on scroll
function watchHeaderInView() {
  checkHeaderInView();

  window.addEventListener("scroll", () => {
    checkHeaderInView();
  });
}

// manages header animation
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

// store scroll position on scroll as a session storage item
function storeScrollPosition() {
  sessionStorage.setItem("scrollPosition", window.scrollY);
}

// restore the scroll position when the page loads
function restoreScrollPosition() {
  const storedScrollPosition = sessionStorage.getItem("scrollPosition");
  if (storedScrollPosition !== null) {
    window.scrollTo(0, parseInt(storedScrollPosition, 10));
    // console.log("retoring scroll position");
  }

  // Show the page content after restoring scroll
  document.body.classList.remove("preload");
}

// check if the current page is a target page
function isTargetPage() {
  const currentPage = window.location.pathname.split("/").pop();
  return (
    currentPage === "news.html" ||
    currentPage === "pinned.html" ||
    currentPage === "dizzy.html" ||
    currentPage === "letter.html"
  );
}

// clear scroll position and reset to 0 if not on the target page
function clearScrollPosition() {
  sessionStorage.removeItem("scrollPosition");
  window.scrollTo(0, 0);
}

// Initialize scroll handling based on the page
const topBannerMain = document.getElementById("top_banner_main");
if (isTargetPage()) {
  window.addEventListener("scroll", storeScrollPosition);
  // window.addEventListener('beforeunload', storeScrollPosition);
  window.addEventListener("DOMContentLoaded", restoreScrollPosition);
} else {
  window.addEventListener("DOMContentLoaded", clearScrollPosition);
  // console.log("clearing Scroll Position");
}

// calculate total aniamtion time
function calculateAnimationDuration() {
  const fadeInUpElements = document.querySelectorAll(".fadeInUp");
  const baseDuration = 600;
  const additionalDuration = 300;
  console.log(baseDuration * fadeInUpElements.length + additionalDuration);
  return baseDuration + fadeInUpElements.length * additionalDuration;
}

// run the white text  shadow function on page load
// document.addEventListener("DOMContentLoaded", applyWhiteTextShadow);

document.addEventListener("DOMContentLoaded", function () {
  let elements_for_fade = [
    { element: document.getElementById("news_page_main"), delay: "600ms" },
    { element: document.getElementById("top_banner_main"), delay: "1200ms" },
  ];

  // Check localStorage and the previous page to decide whether to fade in the sections
  const previousPage = document.referrer;

  // If the previous page is /pages/articles/pinned.html
  if (previousPage.includes("/pages/articles/pinned.html")) {
    if (localStorage.getItem("add_fade") === "false") {
      elements_for_fade.forEach(function (item) {
        if (item.element) {
          item.element.classList.remove("fadeInUp", "animated");
        }
      });
    }
  } else {
    // For any other previous page, only remove the class from #top_banner_main
    const topBannerMain = document.getElementById("top_banner_main");
    if (topBannerMain && localStorage.getItem("add_fade") === "false") {
      console.log(
        "removing fadeInUp from #top_banner_main when add_fade = false and previous page is not /pages/articles/pinned.html"
      );
      topBannerMain.classList.remove("fadeInUp", "animated");
    }
  }

  // Reset fade on localStorage
  localStorage.setItem("add_fade", true);
});



function addFadeInUp() {
  const block = document.querySelectorAll(".above_read_full");
  block.forEach(function (item) {
    if (item) {
      item.classList.add("fadeInUp", "animated");
      // console.log("reached addFadeInUp() loop");
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
  // const totalAnimationDuration = test();
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

let exitFadeTimeout; // Store timeout globally

function handleFadeAndRedirect() {

  // Check if already on the target page
  if (window.location.pathname === "/pages/articles/pinned.html") {
    return;
  }

  // Remove "fadeInUp" and "animated" classes from elements with class "above_read_full"
  const blocks = document.querySelectorAll(".above_read_full");
  blocks.forEach((item) => {
    if (item) {
      item.classList.remove("fadeInUp", "animated");
    }
  });

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
      console.log("Redirecting to pinned.html");
      window.location = "../pages/articles/pinned.html";
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
    console.log("Page restored from bfcache. Clearing timeouts.");
    clearTimeout(exitFadeTimeout);
  }
});

window.addEventListener("popstate", () => {
  console.log("Back/forward navigation detected. Clearing timeouts.");
  clearTimeout(exitFadeTimeout);
});

const readAllButton = document.querySelector(".read-all-articles");

if (readAllButton && !readAllButton._hasListener) {
  readAllButton._hasListener = true; // Flag to prevent duplicate listeners
  readAllButton.addEventListener("click", handleFadeAndRedirect);
}

// // Flag to track initialization state
let isInitialized = false;
let isBackNavigation = false;

// Run the following code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  if (!isInitialized) {
    initializePage(); // General initialization
    isInitialized = true; // Prevent reinitialization
  }
});

// Run this code if the page is loaded from cache
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    console.log("Page restored from bfcache.");
    handleCacheRestore(); // Handle cache-specific logic
    isBackNavigation = true;
  }
  // animateOnLoad();

  // Ensure global initialization logic runs if needed
  if (!isInitialized) {
    initializePage();
    isInitialized = true;
  }
});

function initializePage() {
  console.log("Initializing page...");
  if (isBackNavigation) {
    resetAnimations();
    isBackNavigation = false;
  }
  // animateOnLoadTest();
  animateOnLoad();
  animateHeader("animatedHeader");
  animateOncePerSession("animatedNav", "animated-nav");
  watchHeaderInView();
  setupNavigation();
}

function handleCacheRestore() {
  // const currentPage = window.location.pathname;
  // if (currentPage === "/pages/news.html") {
  //   console.log("Navigated back to news");
  // }

  // Reverse fade-out animations to fade-in
  document.querySelectorAll(".fadeOutDown").forEach((el) => {
    el.classList.replace("fadeOutDown", "fadeInUp");
  });
}



//////////////////////////////////////////////////////////////////////////////////////////////////////
// TESTING FUNCTIONS

function resetAnimations() {
  const fadeOutElements = document.querySelectorAll(".fadeOutDown");
  fadeOutElements.forEach((el) => {
    el.classList.replace("fadeOutDown", "fadeInUp");
  });
  console.log("Animations reset for back navigation.");
}

function setupNavigation() {
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetUrl = link.getAttribute("href");
      const fadeInUpElements = document.querySelectorAll(".fadeInUp");
      let delayCounter = 0;

      // Trigger fade-out animation
      fadeInUpElements.forEach((element, index) => {
        element.classList.replace("fadeInUp", "fadeOutDown");
        element.style.animationDelay = `${index * 600}ms`;
        delayCounter++;
      });

      e.preventDefault();
      setTimeout(() => {
        console.log("reachme00");
        console.log(`Navigating to ${targetUrl} after animations.`);
        window.location.href = targetUrl;
      }, delayCounter * 600 + 800);
    });
  });
}

function animateOnLoadTest() {
  const elementsToAnimate = document.querySelectorAll(".fadeInUp:not(nav)");
  elementsToAnimate.forEach((element, index) => {
    element.style.animationDelay = `${index * 600}ms`;
    element.classList.add("animated");
  });

  setTimeout(() => {
    const player = document.getElementById("lottieAnimation");
    if (player) player.play();
  }, 1000);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////