import {createClient} from 'https://esm.sh/@sanity/client'
// import {tagline} from './schemaTypes/tagline'
 
const client = createClient({
    projectId: "wfwxz1rq", // your project ID
    dataset: "production", // your dataset name
    apiVersion: "2024-06-24", // use a specific API version
    useCdn: false, // `false` if you want to ensure fresh data
  });

// Query to fetch tagline
const query = `*[_type == "complexIntroBlock"]{
  number,
  title,
  body,
  underlineText,
  boldText,
  class {
    name,
    image {
      asset->{
        _id,
        url
      }
    },
    width,
    height,
    top,
    left,
    background,
    borderRadius
  },
  capabilities
}
`

export async function fetchIntroBlockData() {
    try {
      const introBlocks = await client.fetch(query);
  
      // Transform the fetched data into the required format
      const introBlockData = introBlocks.map((block, index) => ({
        number: block.number,
        id: `block${String(index + 1).padStart(2, "0")}`,
        title: block.title,
        body: block.body,
        underlineText: block.underlineText || "", 
        boldText: block.boldText || [], 
        class: {
          name: block.class?.name || "", 
          image: block.class?.image?.asset?.url || "", 
          width: block.class?.width || "", 
          height: block.class?.height || "", 
          top: block.class?.top || "", 
          left: block.class?.left || "", 
          background: block.class?.background || "", 
          borderRadius: block.class?.borderRadius || "", 
        },
        capabilities: block.capabilities || [], 
      }));
  
      // console.log("introBlockData:", JSON.stringify(introBlockData, null, 2));
    // console.log(introBlocks);
      return introBlockData;
    } catch (err) {
      console.error("Error fetching intro blocks:", err);
      throw err;
    }
  }