// at the top of outcomes.js
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
      const targets = block.querySelectorAll(".outcomes-hover, .svg-metric");

      targets.forEach((target) => {
        target.addEventListener("mouseenter", function () {
          block.classList.add("hovered");

          const newVideoSrc = block.getAttribute("data-video");
          if (newVideoSrc) {
            videoSource.src = newVideoSrc;
            videoElement.load();
            videoElement.style.opacity = "0.4";
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
    const associatedHeaders = block ? block.querySelectorAll(".outcomes-hover") : [];

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

function handleOutcomesFadeAndRedirect(targetUrl = "./outcomes/case-study-A.html") {
  console.log('[OUTCOMES FADE] Function called with:', {
    targetUrl,
    outcomesExitFadeTimeout,
    willReturn: !!outcomesExitFadeTimeout,
    timestamp: Date.now()
  });

  if (outcomesExitFadeTimeout) {
    console.log('[OUTCOMES FADE] ❌ EARLY RETURN - timeout already exists:', outcomesExitFadeTimeout);
    return; // prevent double scheduling
  }

  console.log('[OUTCOMES FADE] Proceeding with navigation');

  // Keep the title static like on News
  try { staticTitle(); } catch (_) {}

  // Fade out all elements that participate in exits — strict bottom-up like News
  const elements = Array.from(document.querySelectorAll(".fade_link"));
  console.log('[OUTCOMES FADE] Found elements to fade:', elements.length);

  // Sort by vertical position (bottom-most first); tie-break by left (right-most first)
  elements.sort((a, b) => {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const aTop = ar.top + window.scrollY;
    const bTop = br.top + window.scrollY;
    if (aTop !== bTop) return bTop - aTop; // bottom-up
    const aLeft = ar.left + window.scrollX;
    const bLeft = br.left + window.scrollX;
    if (aLeft !== bLeft) return bLeft - aLeft; // right to left when on same row
    return 0;
  });

  elements.forEach((el, index) => {
    if (el.classList.contains("fadeInUp")) {
      el.classList.replace("fadeInUp", "fadeOutDown");
    } else {
      el.classList.add("fadeOutDown");
    }
    // Stagger so bottom elements go first (footer should lead naturally)
    el.style.animationDelay = `${index * 600}ms`;
  });

  const delay = elements.length * 600 + 800;
  console.log('[OUTCOMES FADE] Setting timeout for navigation:', {
    delay,
    targetUrl,
    timestamp: Date.now()
  });

  outcomesExitFadeTimeout = setTimeout(() => {
    console.log('[OUTCOMES FADE] Timeout fired, navigating to:', targetUrl);
    window.location.href = targetUrl;
  }, delay);

  console.log('[OUTCOMES FADE] Timeout set, ID:', outcomesExitFadeTimeout);
}

// Clear on unload/restore
window.addEventListener("beforeunload", () => {
  console.log('[OUTCOMES BEFOREUNLOAD] Clearing timeout, ID:', outcomesExitFadeTimeout);
  clearTimeout(outcomesExitFadeTimeout);
});

window.addEventListener("pageshow", (e) => {
  console.log('[OUTCOMES PAGESHOW] Event fired:', {
    persisted: e.persisted,
    timestamp: Date.now(),
    url: window.location.pathname,
    timeoutBeforeClear: outcomesExitFadeTimeout
  });
  if (e.persisted) {
    console.log('[OUTCOMES PAGESHOW] Page restored from BFCache - clearing timeout');
    console.log('[OUTCOMES PAGESHOW] Timeout ID BEFORE clearTimeout:', outcomesExitFadeTimeout);
    clearTimeout(outcomesExitFadeTimeout);
    console.log('[OUTCOMES PAGESHOW] Timeout ID AFTER clearTimeout:', outcomesExitFadeTimeout);
    console.log('[OUTCOMES PAGESHOW] ⚠️ BUG: Timeout variable NOT reset to null!');
  }
});

window.addEventListener("popstate", () => {
  console.log('[OUTCOMES POPSTATE] Clearing timeout, ID:', outcomesExitFadeTimeout);
  clearTimeout(outcomesExitFadeTimeout);
});

// Attach click/keyboard handlers to Outcomes blocks only on the landing page
function initializeOutcomesCardListeners() {
  console.log('[OUTCOMES INIT] Starting to attach card listeners at', Date.now());

  const outcomeBlocks = document.querySelectorAll(".outcomes.landing block");

  console.log('[OUTCOMES INIT] Found outcome blocks:', {
    count: outcomeBlocks.length,
    timestamp: Date.now()
  });

  outcomeBlocks.forEach((block, index) => {
    console.log(`[OUTCOMES INIT] Processing block ${index}:`, {
      hasListener: block._hasVFListener,
      hasDatasetFlag: block.dataset.vfHandled,
      href: block.getAttribute('href')
    });

    // mark so other scripts can skip default handling
    block.dataset.vfHandled = "true";

    if (block._hasVFListener) {
      console.log(`[OUTCOMES INIT] Block ${index} already has listener - skipping`);
      return; // avoid duplicates on bfcache
    }

    block._hasVFListener = true;
    console.log(`[OUTCOMES INIT] Attaching listeners to block ${index}`);

    const go = () => {
      console.log('[OUTCOMES CLICK] Card clicked, navigating to:', block.getAttribute("href"));
      const href = block.getAttribute("href") || "./outcomes/case-study-A.html";
      handleOutcomesFadeAndRedirect(href);
    };

    block.addEventListener("click", (e) => {
      console.log('[OUTCOMES CLICK] Click event fired on block');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      go();
    });

    block.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        console.log('[OUTCOMES KEYDOWN] Keydown event fired on block');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        go();
      }
    });
  });

  console.log('[OUTCOMES INIT] Finished attaching card listeners');

  // Add global click test to verify clicks are being received
  document.addEventListener('click', function globalClickTest(e) {
    const clickedBlock = e.target.closest('.outcomes.landing block');
    if (clickedBlock) {
      console.log('[OUTCOMES GLOBAL CLICK] Click detected on outcomes block:', {
        href: clickedBlock.getAttribute('href'),
        hasListener: clickedBlock._hasVFListener,
        hasDataset: clickedBlock.dataset.vfHandled,
        timestamp: Date.now()
      });
    }
  }, true); // Use capture phase to ensure we catch it first
}

document.addEventListener("DOMContentLoaded", function () {
  console.log('[OUTCOMES DOM] DOMContentLoaded fired at', Date.now());
  initializeOutcomesCardListeners();
});
