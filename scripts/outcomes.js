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
      const targets = block.querySelectorAll("h3, h4, img, percent, number");

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

// /won't work because the svg is made with masking ( creates a hole)

document.addEventListener("DOMContentLoaded", function () {
  const svgs = document.querySelectorAll(".svg-metric");
  // console.log(svgs);

  svgs.forEach((svg) => {
    // const pathsWithFill = svg.querySelectorAll("path[fill]");
    const pathsWithFill = svg.querySelectorAll(
      "path[fill], ellipse[fill], rect[fill], circle[fill]"
    );

    const originalFills = Array.from(pathsWithFill).map((path) =>
      path.getAttribute("fill")
    );

    svg.addEventListener("mouseenter", () => {
      pathsWithFill.forEach((path) => {
        path.setAttribute("fill", "#00ffcc");
      });
    });

    svg.addEventListener("mouseleave", () => {
      pathsWithFill.forEach((path, index) => {
        path.setAttribute("fill", originalFills[index]);
      });
    });
  });
});
