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

// fade the article-links for redirect when clicking read all articles (vinh)
function exit_fade_previews() {
  const elements = document.querySelectorAll(".fade_link");

  elements.forEach((div, index) => {
    div.classList.replace("fadeInUp", "fadeOutDown");
    div.style.animationDelay = `${index * 600}ms`;
  });

  setTimeout(
    () => {
      window.location = "../pages/articles/airlines.html";
    },
    elements.length * 600 + 800 // Add an extra delay for smooth transition
  );
}

//handle animation behavior for almost all links
function handleNavigation(fadeInUpElements) {
  const navLinks = document.querySelectorAll("nav a");
  const logoLinks = document.querySelectorAll("header a img");
  const footerLinks = document.querySelectorAll("footer a img");
  const headerLinks = document.querySelectorAll("header a");
  // const articleElements = document.querySelectorAll(".article-title.preview");
  const linkBack = document.querySelectorAll(".link-back");
  const clickMe = document.querySelectorAll(".click-me");
  const linkBackNews = document.querySelectorAll(".link-back-news");

  [
    ...clickMe,
    ...navLinks,
    ...logoLinks,
    ...footerLinks,
    ...headerLinks,
    // ...articleElements,
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
          currentPage === "/pages/articles/airlines.html" &&
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
          targetUrl.startsWith("./articles/") && targetUrl != ("./articles/airlines.html")
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
          targetUrl === "./articles/airlines.html"
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

        // console.log(delayCounter);

        setTimeout(
          () => {
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

  handleNavigation(fadeInUpElements);

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
    currentPage === "airlines.html" ||
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
if (isTargetPage()) {
  window.addEventListener("scroll", storeScrollPosition);
  // window.addEventListener('beforeunload', storeScrollPosition);
  window.addEventListener("DOMContentLoaded", restoreScrollPosition);
} else {
  window.addEventListener("DOMContentLoaded", clearScrollPosition);
}

//rRun the following code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  animateOnLoad();
  animateHeader("animatedHeader");
  animateOncePerSession("animatedNav", "animated-nav");
  watchHeaderInView();
});

//run this code if the page is loaded from cache
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    ("Page was loaded from the cache");
    // re-initialize animations or reset styles here
    document.querySelectorAll(".fadeOutDown").forEach((el) => {
      console.log("loading page from cache");
      el.classList.replace("fadeOutDown", "fadeInUp");
    });
  }
  // always call initialization functions
  animateOnLoad();
  animateHeader("animatedHeader");
  animateOncePerSession("animatedNav", "animated-nav");
  watchHeaderInView();
});

//check if the user is on a mac and apply white text shadow if trueq
function isMacOS() {
  return window.navigator.platform.includes("Mac");
}

// apply white text shadow to jumbo text on mac
function applyWhiteTextShadow() {
  if (isMacOS()) {
    var elements = document.querySelectorAll(".text-jumbo");
    elements.forEach(function (element) {
      element.classList.add("white-text-shadow");
    });
  }
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
document.addEventListener("DOMContentLoaded", applyWhiteTextShadow);

document.addEventListener("DOMContentLoaded", function () {
  let elements_for_fade = [
    { element: document.getElementById("news_page_main"), delay: "600ms" },
    { element: document.getElementById("top_banner_main"), delay: "1200ms" },
  ];

  //"read all news" link
  const readAllArticleLink = document.querySelector(".link-back");
  if (readAllArticleLink) {
    readAllArticleLink.addEventListener("click", function (event) {
      // prevent default navigation
      event.preventDefault();
      //valid url?
      const targetHref = readAllArticleLink.getAttribute("href");
      // const targetHref = "/pages/news.html";

      if (!targetHref) {
        console.error("No target URL found for this link.");
        return;
      }
      //add fade
      elements_for_fade.forEach(function (item) {
        if (item.element) {
          item.element.style.animationDelay = item.delay;
          item.element.classList.add("fadeOutDown", "animated");
        }
      });

      // Calculate total animation duration based on elements
      const totalAnimationDuration = calculateAnimationDuration();

      // Delay navigation until fade-out is complete
      setTimeout(function () {
        window.location.href = targetHref;
      }, totalAnimationDuration); // Adjust timeout based on total calculated duration
    });
  }

  // Check localStorage and the previous page to decide whether to fade in the sections
  const previousPage = document.referrer;

  // If the previous page is /pages/articles/airlines.html
  if (previousPage.includes("/pages/articles/airlines.html")) {
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
        "removing fadeInUp from #top_banner_main when add_fade = false and previous page is not /pages/articles/airlines.html"
      );
      topBannerMain.classList.remove("fadeInUp", "animated");
    }
  }

  // Reset fade on localStorage
  localStorage.setItem("add_fade", true);
});

function removeFadeInUp() {
  const block = document.querySelectorAll(".above_read_full");
  block.forEach(function (item) {
    if (item) {
      item.classList.remove("fadeInUp", "animated");
      localStorage.setItem("newsFade", true);
    }
  });
}

function addFadeInUp() {
  const block = document.querySelectorAll(".above_read_full");
  block.forEach(function (item) {
    if (item) {
      item.classList.add("fadeInUp", "animated");
      console.log("reached addFadeInUp() loop");
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
