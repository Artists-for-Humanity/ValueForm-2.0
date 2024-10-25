// exportTagline.js

import { fetchTagline } from '../sanity-studio/fetchTagline.js';

// let tagline;
// console.log(fetchTagline());
const tagline = await fetchTagline();



// (async () => {
//   try {
//     tagline = await fetchTagline();
//     // console.log(JSON.stringify(tagline, null, 2));
//     console.log(tagline);

//   } catch (err) {
//     console.error("Error:", err);
//   }
// })();
// console.log(tagline);

export default tagline;



// import { fetchTagline } from '../sanity-studio/fetchTagline.js';

// const tagline = (async () => {
//   try {
//     const result = await fetchTagline();
//     console.log(result);
//     return result;
//   } catch (err) {
//     console.error("Error:", err);
//     throw err; // re-throw the error so the promise rejects
//   }
// })();
// console.log(tagline);


// export default tagline;
