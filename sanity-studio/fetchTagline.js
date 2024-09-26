// import {createClient} from 'https://esm.sh/@sanity/client'
// // import {tagline} from './schemaTypes/tagline'
 
// const client = createClient({
//     projectId: "wfwxz1rq", // your project ID
//     dataset: "production", // your dataset name
//     apiVersion: "2024-06-24", // use a specific API version
//     useCdn: false, // `false` if you want to ensure fresh data
//   });

//   // Query to fetch tagline
// const query = `*[_type == "tagline"] {
//  text
// }[0].text`

// export async function fetchTagline() {
//     try {
//         const tagline = await client.fetch(query);

//      return tagline;
//     }
//     catch (err) {
//         console.error("Error fetching team members:", err);
//         throw err;
//       }
// }