//checks if element is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth)
  );
}

// check on whether or not the news preview section is already shown on screen (vinh)
// sets localstorage item add_fade to true or false
function handleMainNewsFade() {
  const element = document.querySelector(".news_page_airlines");
  if (element) {
    if (isInViewport(element)) {
      console.log("The element is in the viewport.");
      localStorage.setItem("add_fade", false);
    } else {
      console.log("The element is not in the viewport.");
      localStorage.setItem("add_fade", true);
    }
  } else {
    console.log("No element with class found.");
  }
  return false;
}

// fade the article-links for redirect when clicking read all articles + set footer to hidden (vinh)
function exit_fade_previews() {
  const elements = document.querySelectorAll(".fade_link");
  elements.forEach(function (div) {
    div.classList.replace("fadeInUp", "fadeOutDown");
  });
  document.querySelector("footer").style.visibility = "hidden";
  setTimeout(() => {
    window.location = "../pages/airlines.html";
  }, 1200);
}

//handle animation behavior for almost all links
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
  sessionStorage.setItem('scrollPosition', window.scrollY);
}

// restore the scroll position when the page loads
function restoreScrollPosition() {
  const storedScrollPosition = sessionStorage.getItem('scrollPosition');
  if (storedScrollPosition !== null) {
    window.scrollTo(0, parseInt(storedScrollPosition, 10));
  }
}

// check if the current page is a target page
function isTargetPage() {
  const currentPage = window.location.pathname.split('/').pop();
  return currentPage === 'news.html' || currentPage === 'airlines.html';
}

// clear scroll position and reset to 0 if not on the target page
function clearScrollPosition() {
  sessionStorage.removeItem('scrollPosition');
  window.scrollTo(0, 0);
}

// Initialize scroll handling based on the page
if (isTargetPage()) {
  window.addEventListener('scroll', storeScrollPosition);
  window.addEventListener('DOMContentLoaded', restoreScrollPosition);
} else {
  window.addEventListener('DOMContentLoaded', clearScrollPosition);
}

function addHoverEffectOnOutcomeElements() {
  const titleElements = document.querySelectorAll('.outcomes-title');
  const descriptionElements = document.querySelectorAll('.outcomes-description');
  const logoElements = document.querySelectorAll('.outcomes-logo');
  const metricElements = document.querySelectorAll('.metric');
  const percentElements = document.querySelectorAll('.percent');
  const videoBackground = document.querySelector('.video-background');
  const videoSource = videoBackground.querySelector('source');

  // hover effect for a GROUP of elements
  function applyHoverEffects(index) {
    const metric = metricElements[index];
    const percent = percentElements[index];
    const title = titleElements[index];

    if (metric && percent) {
      metric.style.color = 'var(--nearwhite)';
      metric.style.webkitTextStrokeColor = 'var(--nearwhite)';
      percent.style.color = 'var(--nearwhite)';
      percent.style.webkitTextStrokeColor = 'var(--nearwhite)';
      metric.style.cursor = 'pointer';
      percent.style.cursor = 'pointer';
    }

    if (title) {
      title.classList.add('outcomes-highlight');
      title.style.cursor = 'pointer';
    }

    //  video src based on metric data-video attribute
    const videoSrc = metric ? metric.getAttribute('data-video') : null;
    if (videoSrc) {
      videoSource.setAttribute('src', videoSrc);
      videoBackground.load(); 
    }

    // show the video background
    document.querySelector('body.outcomes').classList.add('hovered');
    videoBackground.style.opacity = '1';
  }

  // remove hover effects
  function removeHoverEffects(index) {
    const metric = metricElements[index];
    const percent = percentElements[index];
    const title = titleElements[index];

    if (metric && percent) {
      metric.style.color = '';
      metric.style.webkitTextStrokeColor = '';
      percent.style.color = '';
      percent.style.webkitTextStrokeColor = '';
      metric.style.cursor = '';
      percent.style.cursor = '';
    }

    if (title) {
      title.classList.remove('outcomes-highlight');
      title.style.cursor = '';
    }

    // hide background
    document.querySelector('body.outcomes').classList.remove('hovered');
    videoBackground.style.opacity = '0';
  }

  // iterate over index nums  and add event listeners
  for (let i = 0; i < Math.min(titleElements.length, descriptionElements.length, logoElements.length, metricElements.length, percentElements.length); i++) {
    const elementsGroup = [titleElements[i], descriptionElements[i], logoElements[i], metricElements[i]];

    elementsGroup.forEach(element => {
      element.addEventListener('mouseenter', () => applyHoverEffects(i));
      element.addEventListener('mouseleave', () => removeHoverEffects(i));
    });
  }
}



//run the following code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  animateOnLoad();
  animateHeader("animatedHeader");
  animateOncePerSession("animatedNav", "animated-nav");
  watchHeaderInView();
  addHoverEffectOnOutcomeElements();
});

//run this code is the page is loaded from scratch
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
  addHoverEffectOnOutcomeElements();
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

// run the white text shadow function on page load
document.addEventListener("DOMContentLoaded", applyWhiteTextShadow);
