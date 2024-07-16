// import { createClient } from '@sanity/client';
import {createClient} from 'https://esm.sh/@sanity/client'


// console.log('Sanity Client is installed');

const client = createClient({
  projectId: "wfwxz1rq", // your project ID
  dataset: "production", // your dataset name
  apiVersion: "2024-06-24", // use a specific API version
  useCdn: false, // `false` if you want to ensure fresh data
});

// Query to fetch team members
const query = `*[_type == "teamMember"] {
  "title": title,
  "name": name,
  "imgSrc": imgSrc.asset->url,
  "bio": bio,
  "clients": clients{
    "categories": categories[] {
      "name": name,
      "list": list
    }
  },
  "contact": contact {
    "methods": methods[] {
      "name": name,
      "link": link,
      "display": display
    }
  }
}`;

export async function fetchTeamData() {
  try {
    const teamMembers = await client.fetch(query);

    // Transform the fetched data into the required format
    const teamData = {};

    teamMembers.forEach((member, index) => {
      const memberId = `member${String(index + 1).padStart(2, "0")}`;
      teamData[memberId] = {
        name: member.name,
        title: member.title,
        imgSrc: member.imgSrc || "", // Provide a default value if imgSrc is null
        bio: member.bio || "", // Provide a default value if bio is null
        clients: {
          category01: member.clients?.categories?.[0]
            ? {
                name: member.clients.categories[0].name || "",
                list: member.clients.categories[0].list || "",
              }
            : { name: "", list: "" },
          category02: member.clients?.categories?.[1]
            ? {
                name: member.clients.categories[1].name || "",
                list: member.clients.categories[1].list || "",
              }
            : { name: "", list: "" },
          category03: member.clients?.categories?.[2]
            ? {
                name: member.clients.categories[2].name || "",
                list: member.clients.categories[2].list || "",
              }
            : { name: "", list: "" },
        },
        contact: {
          method01: member.contact?.methods?.[0]
            ? {
                name: member.contact.methods[0].name || "",
                link: member.contact.methods[0].link || "",
                display: member.contact.methods[0].display || "",
              }
            : { name: "", link: "", display: "" },
          method02: member.contact?.methods?.[1]
            ? {
                name: member.contact.methods[1].name || "",
                link: member.contact.methods[1].link || "",
                display: member.contact.methods[1].display || "",
              }
            : { name: "", link: "", display: "" },
        },
      };
    });

    // console.log("teamData:", JSON.stringify(teamData, null, 2));

    return teamData;
  } catch (err) {
    console.error("Error fetching team members:", err);
    throw err;
  }
}
