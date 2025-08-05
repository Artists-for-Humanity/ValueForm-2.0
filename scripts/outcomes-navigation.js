import { isInViewport } from "./script.js";

export function handleOutcomesNavigation(fadeInUpElements) {
  const navLinks = document.querySelectorAll("nav a");
  const logoLinks = document.querySelectorAll("header a img");
  const footerLinks = document.querySelectorAll("footer a img");
  const headerLinks = document.querySelectorAll("header a");
  const asideLinks = document.querySelectorAll("aside a");
  const linkBack = document.querySelectorAll(".link-back");
  const clickMe = document.querySelectorAll(".click-me");

  const topBannerMain = document.getElementById("top_banner_main");

  const allLinks = [
    ...clickMe,
    ...navLinks,
    ...logoLinks,
    ...footerLinks,
    ...headerLinks,
    ...asideLinks,
    ...linkBack,
  ];

  allLinks.forEach((element) => {
    const isAnchor = element.tagName.toLowerCase() === "a";
    const anchor = isAnchor ? element : element.closest("a") || element;

    if (anchor.classList.contains("disabled")) return;

    anchor.addEventListener("click", (e) => {
      const isPureAnchor =
        anchor.host === window.location.host &&
        anchor.pathname === window.location.pathname;

      if (isPureAnchor) return;

      sessionStorage.setItem("currentPagePath", window.location.pathname);

      e.preventDefault();
      const targetUrl = anchor.getAttribute("href");
      let delayCounter = 0;

      const safeFadeInUpElements = Array.from(fadeInUpElements || []);
      safeFadeInUpElements
        .filter(isInViewport)
        .reverse()
        .forEach((element, index) => {
          element.classList.replace("fadeInUp", "fadeOutDown");
          element.style.animationDelay = `${index * 600}ms`;
          delayCounter++;
        });

      const currentPage = window.location.pathname;
      const isTopBannerInViewport =
        topBannerMain && isInViewport(topBannerMain);
      const footer = document.querySelector("footer");
      const footerInViewport = isInViewport(footer);

          console.log("delayCounter A = ", delayCounter);


      // From outcomes.html to subpage
      if (
        currentPage === "/pages/outcomes.html" &&
        targetUrl.startsWith("./outcomes/")
      ) {
        if (isTopBannerInViewport) {
          // console.log("reachme A");
          delayCounter++;
          setTimeout(() => {
            topBannerMain.classList.add("fadeOutDown");
          }, (delayCounter - 1) * 600);
        }
      }

      // From outcomes.html to non-outcomes pages
      if (
        currentPage === "/pages/outcomes.html" &&
        (targetUrl === "./our-approach.html" ||
          targetUrl === "./leadership.html" ||
          targetUrl === "../index.html" ||
          targetUrl === "./news.html"
        )
      ) {
        if (isTopBannerInViewport) {
          // console.log("reachme B");

          // console.log("delayCounter B = ", delayCounter);
          delayCounter++;
          topBannerMain.style.animationDelay = `${(delayCounter - 1) * 600}ms`;
          topBannerMain.classList.add("fadeOutDown");
        }
      }

      // From subpage back to outcomes.html
      if (
        currentPage.startsWith("/pages/outcomes/") &&
        targetUrl === "../outcomes.html"
      ) {
        // console.log("reachme C");
        if (!fadeInUpElements.some(el => el.id === "top_banner_main")) {
          delayCounter--;
        }
      }

      setTimeout(() => {
        window.location.href = targetUrl;
      }, delayCounter * 600 + 800);
    });
  });
}
