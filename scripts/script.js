function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth)
  );
}

// check on whether or not the news section is already shown on screen
function handleMainNewsFade() {
  const element = document.querySelector('.news_page_airlines')
  if (element) {
    if (isInViewport(element)) {
      console.log('The element is in the viewport.');
      localStorage.setItem("add_fade", false)
    } else {
      console.log('The element is not in the viewport.');
      localStorage.setItem("add_fade", true)
    }
  } else {
    console.log('No element with class found.');
  }
  return false;
}

// fade the links for redirect when clicking read all articles
function exit_fade_previews() {
  const elements = document.querySelectorAll('.fade_link');
  elements.forEach(function (div) {
    div.classList.replace('fadeInUp', 'fadeOutDown');
  });
  document.querySelector('footer').style.visibility = 'hidden';
  setTimeout(() => {
    window.location = '../pages/airlines.html'
  }, 3500);
}

function handleNavigation(fadeInUpElements) {
  const navLinks = document.querySelectorAll("nav a");
  const logoLinks = document.querySelectorAll("header a img");
  const footerLinks = document.querySelectorAll("footer a img");
  const headerLinks = document.querySelectorAll("header a");
  const articleElements = document.querySelectorAll(".article-title.preview");
  const linkBack = document.querySelectorAll(".link-back");
  const clickMe = document.querySelectorAll(".click-me");

  [
    ...clickMe,
    ...navLinks,
    ...logoLinks,
    ...footerLinks,
    ...headerLinks,
    ...articleElements,
    ...linkBack,
  ].forEach((element) => {
    const isAnchor = element.tagName.toLowerCase() === "a";
    const anchor = isAnchor ? element : element.closest("a") || element;

    if (anchor.classList.contains("disabled")) return;

    anchor.addEventListener("click", (e) => {
      const isPureAnchor =
        anchor.getAttribute("href").startsWith("#") &&
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

        setTimeout(
          () => (window.location.href = targetUrl),
          delayCounter * 600 + 800
        );
      }
    });
  });
}

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
  }, 2000);
}

function animateOncePerSession(elementId, animationClass) {
  const element = document.getElementById(elementId);
  if (element && !sessionStorage.getItem(`${elementId}Animated`)) {
    element.classList.add(animationClass);
    sessionStorage.setItem(`${elementId}Animated`, "true");
  }
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

function watchHeaderInView() {
  checkHeaderInView();

  window.addEventListener("scroll", () => {
    checkHeaderInView();
  });
}

const header = document.getElementById("animatedHeader");
let wasInViewport = isInViewport(header);
let headerChecked = false; // boolean that's false so we can hit one of the conditions in checkHeaderInView

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

document.addEventListener("DOMContentLoaded", () => {
  animateOnLoad();
  animateHeader("animatedHeader");
  animateOncePerSession("animatedNav", "animated-nav");
  watchHeaderInView();
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    ("Page was loaded from the cache");
    // re-initialize animations or reset styles here
    document.querySelectorAll(".fadeOutDown").forEach((el) => {
      el.classList.replace("fadeOutDown", "fadeInUp");
    });
  }
  // always call initialization functions
  animateOnLoad();
  animateHeader("animatedHeader");
  animateOncePerSession("animatedNav", "animated-nav");
  watchHeaderInView();
});

function isMacOS() {
  return window.navigator.platform.includes("Mac");
}

function applyWhiteTextShadow() {
  if (isMacOS()) {
    var elements = document.querySelectorAll(".text-jumbo");
    elements.forEach(function (element) {
      element.classList.add("white-text-shadow");
    });
  }
}

document.addEventListener("DOMContentLoaded", applyWhiteTextShadow);
