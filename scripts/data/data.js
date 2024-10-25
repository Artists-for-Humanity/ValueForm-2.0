// import { fetchTagline } from "../../sanity-studio/fetchTagline.js";

// // const tagline = await fetchTagline();
// // console.log(tagline);


// export const generalData = {
  
//   tagline: {
//     home: "Generating business outcomes through a human-centered approach.",
//   },
// };


import { fetchTagline } from "../../sanity-studio/fetchTagline.js";

let generalData = {
  tagline: {
    home: "Temp",
  },
};

// Immediately invoked async function to fetch and set the tagline
(async () => {
  try {
    const tagline = await fetchTagline();
    console.log(tagline);
    generalData.tagline.home = tagline;
  } catch (err) {
    console.error("Error fetching tagline:", err);
  }
})();

export { generalData };
