import { handleOutcomesNavigation } from "./outcomes-navigation.js";
console.log("running outcomes script");

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


document.addEventListener("DOMContentLoaded", function () {
  const fadeInUpElements = document.querySelectorAll(".fadeInUp");
  handleOutcomesNavigation(fadeInUpElements);
});
