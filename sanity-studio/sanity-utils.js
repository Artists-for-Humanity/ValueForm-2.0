import { createClient } from 'https://esm.sh/@sanity/client'

// console.log('Sanity Client is installed');

const client = createClient({
  projectId: "wfwxz1rq", // your project ID
  dataset: "production", // your dataset name
  apiVersion: "2024-06-24", // use a specific API version
  useCdn: false, // `false` if you want to ensure fresh data
});

// Query to fetch team members
const query = `*[_type == "teamMember"] {
 "number": number,
  "title": title,
  "name": name,
  "imgSrc": imgSrc.asset->url,
  "bio": bio,
  "clients": clients{
    "title": title,
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

     // Sort team members by their number value
     teamMembers.sort((a, b) => a.number - b.number);

    // Transform the fetched data into the required format
    const teamData = {};

    teamMembers.forEach((member, index) => {
      const memberId = `member${String(index + 1).padStart(2, "0")}`;
      
      // Handle clients categories dynamically
      const clients = { title: member.clients?.title || "Select Clients:" };
      member.clients?.categories?.forEach((category, catIndex) => {
        clients[`category${String(catIndex + 1).padStart(2, "0")}`] = {
          name: category.name || "",
          list: category.list || "",
        };
      });

      // Handle contact methods dynamically
      const contact = {};
      member.contact?.methods?.forEach((method, methodIndex) => {
        contact[`method${String(methodIndex + 1).padStart(2, "0")}`] = {
          name: method.name || "",
          link: method.link || "",
          display: method.display || "",
        };
      });

      teamData[memberId] = {
        name: member.name,
        title: member.title,
        imgSrc: member.imgSrc || "", // Provide a default value if imgSrc is null
        bio: member.bio || "", // Provide a default value if bio is null
        clients,
        contact,
      };
    });

    // console.log("teamData:", JSON.stringify(teamData, null, 2));

    return teamData;
  } catch (err) {
    console.error("Error fetching team members:", err);
    throw err;
  }
}
