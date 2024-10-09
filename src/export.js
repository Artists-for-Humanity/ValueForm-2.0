// index.js

// const fetchTeamData = require("./fetchData");
// import fetchTeamData from "./fetchData.js"
import { fetchTeamData } from '../sanity-studio/sanity-utils.js';
// console.log(fetchTeamData());

let teamData;

(async () => {
  try {
    teamData = await fetchTeamData();
    // console.log("teamData:", JSON.stringify(teamData, null, 2));

    // Export the fetched data
    // module.exports = {
    //   teamData,
    // };
// console.log(teamData);

    return teamData;
  } catch (err) {
    console.error("Error:", err);
  }
})();
export default teamData;
// export const getTeamData = () => teamData;

