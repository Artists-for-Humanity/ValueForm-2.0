import { isInViewport } from "./script.js";
console.log("running outcomes-navigation script");

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

      fadeInUpElements
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

      // From outcomes.html to subpage
      if (
        currentPage === "/pages/outcomes.html" &&
        targetUrl.startsWith("./outcomes/")
      ) {
        if (isTopBannerInViewport) {
          delayCounter++;
          setTimeout(() => {
            topBannerMain.classList.add("fadeOutDown");
          }, (delayCounter - 1) * 600);
        }
      }

      // From subpage back to outcomes.html
      if (
        currentPage.startsWith("/pages/outcomes/") &&
        targetUrl === "../outcomes.html"
      ) {
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
