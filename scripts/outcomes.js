import { handleOutcomesNavigation } from "./outcomes-navigation.js";
import { staticTitle } from "./script.js";

// =======================================
// Outcomes page hover effects
// =======================================
document.addEventListener("DOMContentLoaded", function () {
  const blocks = document.querySelectorAll(".outcomes block");
  const videoElement = document.getElementById("video");
  const videoSource = videoElement.querySelector("source");

  // Check if the device supports touch (i.e., it's a mobile or tablet)
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    // Only apply hover functionality on non-touch devices
    blocks.forEach((block) => {
      // const targets = block.querySelectorAll("h3, h4, img, percent, number");
      const targets = block.querySelectorAll("#outcomes-hover, .svg-metric");

      targets.forEach((target) => {
        target.addEventListener("mouseenter", function () {
          block.classList.add("hovered");

          const newVideoSrc = block.getAttribute("data-video");
          if (newVideoSrc) {
            videoSource.src = newVideoSrc;
            videoElement.load();
            videoElement.style.opacity = "0.2";
          }
        });

        target.addEventListener("mouseleave", function () {
          block.classList.remove("hovered");
          videoElement.style.opacity = "0";
        });
      });
    });
  } else {
    return;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const svgs = document.querySelectorAll(".svg-metric");

  svgs.forEach((svg) => {
    // Make SVG responsive by adjusting width and height attributes
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("width", "100%");
    // svg.setAttribute("height", "auto");

    // Select elements that have a fill attribute but exclude those that only have stroke attribute
    const pathsWithFill = Array.from(svg.querySelectorAll("path, ellipse, rect, circle")).filter(el => el.hasAttribute("fill"));

    const originalFills = pathsWithFill.map((path) =>
      path.getAttribute("fill")
    );

    pathsWithFill.forEach((path) => {
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-opacity", "1");
      path.setAttribute("stroke", "#404040");
      path.setAttribute("stroke-width", "1");
    });

    svg.addEventListener("mouseenter", () => {
      // console.log("Mouse entered SVG:", svg);
      // pathsWithFill.forEach((path) => {
      //   path.setAttribute("fill", "#ff0000ff");
      // });
      pathsWithFill.forEach((path, index) => {
        path.setAttribute("fill", originalFills[index]);
        path.setAttribute("stroke", "none");
      });
    });

    svg.addEventListener("mouseleave", () => {
      // pathsWithFill.forEach((path, index) => {
      //   path.setAttribute("fill", originalFills[index]);
      // });
      pathsWithFill.forEach((path, index) => {
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-opacity", "1");
        path.setAttribute("stroke", "#404040");
        path.setAttribute("stroke-width", "1");
      });
    });

    const block = svg.closest("block");
    const associatedHeaders = block ? block.querySelectorAll("#outcomes-hover") : [];

    associatedHeaders.forEach((header) => {
      header.addEventListener("mouseenter", () => {
        pathsWithFill.forEach((path, index) => {
          path.setAttribute("fill", originalFills[index]);
          path.setAttribute("stroke", "none");
        });
      });

      header.addEventListener("mouseleave", () => {
        pathsWithFill.forEach((path) => {
          path.setAttribute("fill", "none");
          path.setAttribute("stroke-opacity", "1");
          path.setAttribute("stroke", "#404040");
          path.setAttribute("stroke-width", "1");
        });
      });
    });
  });
});

// =======================================
// Outcomes: fade then navigate (like News pinned)
// =======================================
let outcomesExitFadeTimeout; // Store timeout for Outcomes clicks

function handleOutcomesFadeAndRedirect(targetUrl = "./outcomes/pokemon.html") {
  if (outcomesExitFadeTimeout) return; // prevent double scheduling

  // Keep the title static like on News
  try { staticTitle(); } catch (_) {}

  // Fade out all elements that participate in exits
  const elements = document.querySelectorAll(".fade_link");
  elements.forEach((el, index) => {
    if (el.classList.contains("fadeInUp")) {
      el.classList.replace("fadeInUp", "fadeOutDown");
    } else {
      el.classList.add("fadeOutDown");
    }
    el.style.animationDelay = `${index * 600}ms`;
  });

  outcomesExitFadeTimeout = setTimeout(() => {
    window.location.href = targetUrl;
  }, elements.length * 600 + 800);
}

// Clear on unload/restore
window.addEventListener("beforeunload", () => { clearTimeout(outcomesExitFadeTimeout); });
window.addEventListener("pageshow", (e) => { if (e.persisted) clearTimeout(outcomesExitFadeTimeout); });
window.addEventListener("popstate", () => { clearTimeout(outcomesExitFadeTimeout); });

// Attach click/keyboard handlers to Outcomes blocks only on the landing page
document.addEventListener("DOMContentLoaded", function () {
  const outcomeBlocks = document.querySelectorAll(".outcomes.landing block");

  outcomeBlocks.forEach((block) => {
    // mark so other scripts can skip default handling
    block.dataset.vfHandled = "true";

    if (block._hasVFListener) return; // avoid duplicates on bfcache
    block._hasVFListener = true;

    const go = () => {
      const href = block.getAttribute("href") || "./outcomes/pokemon.html";
      handleOutcomesFadeAndRedirect(href);
    };

    block.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      go();
    });

    block.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        go();
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const fadeInUpElements = document.querySelectorAll(".fadeInUp");
  handleOutcomesNavigation(fadeInUpElements);
});
