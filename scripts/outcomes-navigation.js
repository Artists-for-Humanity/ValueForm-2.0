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
    // if (!(anchor instanceof HTMLAnchorElement)) return;
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

      // DIAGNOSTIC ONLY - Track navigation count
      const navCount = parseInt(sessionStorage.getItem('outcomesNavCount') || '0') + 1;
      sessionStorage.setItem('outcomesNavCount', navCount.toString());

      console.log('[DIAGNOSTIC - OUTCOMES NAV]', {
        navigationNumber: navCount,
        isFirstNav: navCount === 1,
        isSecondNav: navCount === 2,
        targetUrl: targetUrl,
        headerVisible: topBannerMain ? isInViewport(topBannerMain) : false,
        currentDontAnimateFlag: sessionStorage.getItem('dontAnimateHeader'),
        timestamp: Date.now()
      });

      // Outcomes route context & static banner flag
      const currentPage = window.location.pathname;

      // Check if banner is in viewport BEFORE setting the flag
      const isTopBannerInViewport = topBannerMain && isInViewport(topBannerMain);

      const keepStaticBetweenOutcomes = (
        ((currentPage === "/pages/outcomes.html" && targetUrl.startsWith("./outcomes/")) ||
        (currentPage.startsWith("/pages/outcomes/") && targetUrl === "../outcomes.html")) &&
        isTopBannerInViewport  // Only keep static if banner is visible
      );
      if (keepStaticBetweenOutcomes) {
        // Persist a flag so the banner doesn't re‑animate on the destination page
        sessionStorage.setItem("keepOutcomesBannerStatic", "true");
        if (topBannerMain) {
          // Remove fade‑in classes so the static banner flows into next page
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



      // From outcomes.html to subpage — keep banner static if requested
      if (currentPage === "/pages/outcomes.html" && targetUrl.startsWith("./outcomes/")) {
        // Clear header animation flag when topbanner is NOT visible (similar to news pages)
        // This ensures the header will animate on the destination page
        if (!isTopBannerInViewport) {
          sessionStorage.removeItem("dontAnimateHeader");
        }

        if (!keepStaticBetweenOutcomes && isTopBannerInViewport) {
          delayCounter++;
          setTimeout(() => {
            topBannerMain.classList.add("fadeOutDown");
          }, (delayCounter - 1) * 600);
        }
      }

      // --- Normalize destination (handles ../, ./, and #hash) ---
      const dest = new URL(targetUrl, window.location.href);
      const destPath = dest.pathname; // e.g. "/pages/our-approach.html"

      // Are we leaving any Outcomes route? (landing or a subpage)
      const isLeavingOutcomes =
        currentPage === "/pages/outcomes.html" ||
        currentPage.startsWith("/pages/outcomes/");

      // Non-Outcomes top-level targets where the banner should fade out
      const isNonOutcomesTarget = (
        destPath === "/pages/our-approach.html" ||
        destPath === "/pages/leadership.html" ||
        destPath === "/pages/news.html" ||
        destPath === "/index.html"
      );

      // Force-fade the banner even if it wasn't in the .fadeInUp fadeSet
      if (isLeavingOutcomes && isNonOutcomesTarget && topBannerMain && isTopBannerInViewport) {
        if (!topBannerMain.classList.contains("fadeOutDown")) {
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

      // From outcomes subpages to non-outcomes pages
      if (
        (currentPage.startsWith("/pages/outcomes/") &&
          targetUrl !== "./../outcomes.html" &&
          (targetUrl === "./../leadership.html" ||
            targetUrl === "../../index.html" ||
            targetUrl === "./../news.html" ||
            targetUrl.startsWith("./../our-approach.html"))
        )) {

        setTimeout(() => {
          topBannerMain.classList.add("fadeOutDown");
        }, delayCounter++ * 600);
      }

      // ---- NEW: mark that next page should reset scroll + fade banner in
      const isOutcomesSubpage = currentPage.startsWith("/pages/outcomes/");

      // URLs that should reset when coming from an outcomes page
      const resetTargets = new Set([
        // News
        "./news.html", "../news.html", "./../news.html", "/pages/news.html",
        // Home
        "./index.html", "../index.html", "../../index.html", "/index.html", "/pages/index.html",
        // Our Approach
        "./our-approach.html", "../our-approach.html", "./../our-approach.html", "/pages/our-approach.html",
        // Leadership
        "./leadership.html", "../leadership.html", "./../leadership.html", "/pages/leadership.html",
      ]);

      if (isOutcomesSubpage && resetTargets.has(targetUrl)) {
        sessionStorage.setItem("forceTopAndFadeIn", "true");
        // make absolutely sure we don't carry a "keep static" flag
        sessionStorage.removeItem("keepOutcomesBannerStatic");
      }

      setTimeout(() => {
        window.location.href = targetUrl;
      }, delayCounter * 600 + 800);
    });
  });
}