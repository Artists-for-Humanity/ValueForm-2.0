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

  // Build and dedupe the anchor list
  const allLinks = [
    ...clickMe,
    ...navLinks,
    ...logoLinks,
    ...footerLinks,
    ...headerLinks,
    ...asideLinks,
    ...linkBack,
  ];

  // Turn everything into its closest <a>, dedupe via Set, and filter nulls
  const anchors = Array.from(
    new Set(
      allLinks.map(el =>
        el.tagName.toLowerCase() === "a" ? el : el.closest("a")
      )
    )
  ).filter(Boolean);

  let navigating = false; // debounce multi-clicks

  anchors.forEach(anchor => {
    if (anchor.classList.contains("disabled")) return;
    if (anchor.dataset && anchor.dataset.vfHandled === "true") return;
    if (anchor._vfBound) return;
    anchor._vfBound = true;

    anchor.addEventListener("click", (e) => {
      if (navigating) return;          // <- debounce stacked clicks
      const isPureAnchor =
        anchor.host === window.location.host &&
        anchor.pathname === window.location.pathname;
      if (isPureAnchor) return;

      navigating = true;
      sessionStorage.setItem("currentPagePath", window.location.pathname);

      e.preventDefault();
      const targetUrl = anchor.getAttribute("href");
      let delayCounter = 0;

      // Outcomes route context & static banner flag
      const currentPage = window.location.pathname;
      const keepStaticBetweenOutcomes = (
        (currentPage === "/pages/outcomes.html" && targetUrl.startsWith("./outcomes/")) ||
        (currentPage.startsWith("/pages/outcomes/") && targetUrl === "../outcomes.html")
      );
      if (keepStaticBetweenOutcomes) {
        // Persist a flag so the banner doesn’t re‑animate on the destination page
        sessionStorage.setItem("keepOutcomesBannerStatic", "true");
        if (topBannerMain) {
          // Remove fade‑in classes so the static banner flows into next page
          // console.log("Removing fadeInUp from #top_banner_main for static transition");
          topBannerMain.classList.remove("fadeInUp", "animated");
        }
      } else {
        // Clear the flag when navigating away from outcomes
        sessionStorage.removeItem("keepOutcomesBannerStatic");
      }

      // Recompute the fade set at click-time so it reflects the live DOM
      const fadeSet = Array.from(document.querySelectorAll(".fadeInUp:not(nav)"))
        .filter(el => isInViewport(el) && (!keepStaticBetweenOutcomes || el.id !== "top_banner_main"))
        .reverse();

      fadeSet.forEach((el, index) => {
        el.classList.replace("fadeInUp", "fadeOutDown");
        el.style.animationDelay = `${index * 600}ms`;
        delayCounter++;
      });

      const isTopBannerInViewport = topBannerMain && isInViewport(topBannerMain);

      // From outcomes.html to subpage — keep banner static if requested
      if (currentPage === "/pages/outcomes.html" && targetUrl.startsWith("./outcomes/")) {
        if (!keepStaticBetweenOutcomes && isTopBannerInViewport) {
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
          targetUrl === "./news.html")
      ) {
        if (isTopBannerInViewport) {
          // console.log("reachme B");
          // console.log("delayCounter B = ", delayCounter);
          delayCounter++;
          topBannerMain.style.animationDelay = `${(delayCounter - 1) * 600}ms`;
          topBannerMain.classList.add("fadeOutDown");
        }
      }

      // From subpage back to outcomes.html — keep banner static via flag, preserve delay tweak
      if (currentPage.startsWith("/pages/outcomes/") && targetUrl === "../outcomes.html") {
        // flag already set above; keep pre-existing delay behavior
        if (!fadeSet.some(el => el.id === "top_banner_main")) {
          delayCounter--;
        }
      }

      setTimeout(() => {
        window.location.href = targetUrl;
      }, delayCounter * 600 + 800);
    });
  });
}