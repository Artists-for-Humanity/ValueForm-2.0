import { fetchTagline } from "../../sanity-studio/fetchTagline.js";
import { fetchTeamData } from "../sanity-studio/sanity-utils.js";
import { teamData } from "./data/team.js";
import { introBlock } from "./data/approachIntroBlock.js";
import { approachBlock } from "./data/approachBlock.js";
import { footer as footerData } from "./data/footer.js"; // Import the footer data

let generalData = {
  tagline: {
    home: "Temp",
  },
};
// Function to initialize the data
 async function initializeData() {
  try {
    const tagline = await fetchTagline();
    generalData.tagline.home = tagline;

    // Create the textData object after the tagline has been fetched
    const textData = {
      ...generalData,
      team: teamData,
      ...approachBlock,
      ...introBlock,
      footer: footerData,
    };

    // Update content only after data initialization is complete
    updateContent(textData);
    animateOnLoad();
  } catch (err) {
    // console.error("Error fetching tagline:", err);
  }
}

async function initializeTeamData() {
  try {
    const teamMember = await fetchTeamData();
    // console.log(teamMember)
    const memberData = {
      team: teamMember,
    };
  TeamMembers(memberData);
  animateOnLoad();
  }
  catch (err) {
    console.error("Error fetching teamMember:", err);
  }
}

function getNestedValue(obj, key) {
  return key.split(".").reduce((o, i) => (o ? o[i] : null), obj);
}

function TextElements(textData) {
  const textElements = document.querySelectorAll("[key]");

  textElements.forEach((element) => {
    const key = element.getAttribute("key");
    const value = getNestedValue(textData, key);

    if (value) {
      switch (element.tagName.toLowerCase()) {
        case "img":
          element.src = value;
          break;

        case "a":
          if (element.hasAttribute("data-display-key")) {
            element.href = value;
            const displayKey = element.getAttribute("data-display-key");
            const displayValue = getNestedValue(textData, displayKey);
            if (displayValue) {
              element.textContent = displayValue;
            }
          }
          break;

        default:
          element.innerHTML = value;
          break;
      }
    }
  });
}

function handleApproach(approachData) {
  const mainContainer = document.querySelector(".approach-container");
  if (!approachData || !mainContainer) return;

  

  // Helper function to wrap specified strings with a span having a class name
  function wrapStringWithClass(str, substr, className, additionalClass = "") {
    const regex = new RegExp(`(${substr})`, 'g');
    const combinedClass = `${className} ${additionalClass}`.trim();
    return str.replace(regex, `<span class="${combinedClass}">$1</span>`);
  }

  // Helper function to wrap multiple substrings with a class
  function wrapMultipleStringsWithClass(str, substrings, className) {
    substrings.forEach(substring => {
      str = wrapStringWithClass(str, substring, className);
    });
    return str;
  }

  

  Object.keys(approachData).forEach((approachKey, index) => {
    const approachBlock = approachData[approachKey];

    // Create CSS class dynamically
    const style = document.createElement('style');
    style.type = 'text/css';
    const cssClass = `
        p span.${approachBlock.class.name}:before {
            content: url(${approachBlock.class.image});
            text-align: center;
            display: none;
            width: ${approachBlock.class.width};
            height: ${approachBlock.class.height};
            top: ${approachBlock.class.top};
            left: ${approachBlock.class.left};
            background: ${approachBlock.class.background};
        }
    `;
    style.appendChild(document.createTextNode(cssClass));
    document.head.appendChild(style);
    console.log(style);



    // Modify body content to include styling for underline and bold
    let modifiedBody = approachBlock.body;
    if (approachBlock.underline) {
      modifiedBody = wrapStringWithClass(modifiedBody, approachBlock.underline, 'underline', approachBlock.class);
    }
    if (approachBlock.bold && Array.isArray(approachBlock.bold)) {
      modifiedBody = wrapMultipleStringsWithClass(modifiedBody, approachBlock.bold, 'bold');
    } else if (approachBlock.bold) {
      modifiedBody = wrapStringWithClass(modifiedBody, approachBlock.bold, 'bold');
    }

    const approachWrapper = document.createElement("div");
    approachWrapper.className = "container fadeInUp";

    approachWrapper.innerHTML = `
      <h2 class="desktop-col-10 tablet-col-6 text-l">${approachBlock.title}</h2>
      <p class="text-m desktop-col-7 tablet-col-6">
       ${modifiedBody}
      </p>
      <h4 class="desktop-col-7 tablet-col-6">Capabilities:</h4>
      <ul class="desktop-col-10 tablet-col-6 text-m"></ul>
    `;

    // get the <ul> element to append <li> elements to it
    const capabilitiesList = approachWrapper.querySelector("ul");
    const capabilitiesLength = approachBlock.capabilities.length;

    // dynamically create <li> elements based on the capabilities array
    approachBlock.capabilities.forEach((capability, capIndex) => {
      const listItem = document.createElement("li");
      listItem.textContent = capability;

      // Add class no-border based on the length of the capabilities array
      if (capabilitiesLength % 2 === 0) {
        // even: add no-border to the last two items
        if (capIndex >= capabilitiesLength - 2) {
          listItem.classList.add("no-border");
        }
      } else {
        // odd: add no-border to the last item
        if (capIndex === capabilitiesLength - 1) {
          listItem.classList.add("no-border");
        }
      }
      capabilitiesList.appendChild(listItem);
    });
    mainContainer.appendChild(approachWrapper);
  });
}



function TeamMembers(memberData) {
  const mainContainer = document.querySelector(".main-container");
  if (!memberData.team || !mainContainer) return;

  Object.keys(memberData.team).forEach((memberKey, index) => {
    const member = memberData.team[memberKey];
    const memberWrapper = document.createElement("div");
    memberWrapper.className = "container no-border fadeInUp";
    if (index > 0) {
      memberWrapper.classList.add("no-before-after", "member-top");
    }

    const memberContainer = document.createElement("div");
    memberContainer.className = "desktop-col-7-left tablet-col-4";

    memberContainer.innerHTML = `
      <h2 class="text-l">${member.name}</h2>
      <h4>${member.title}</h4>
      <div class="headshot">
        <img src="${member.imgSrc}" alt="${member.name}" />
      </div>
      <p class="text-m">${member.bio}</p>
      <h4>${member.clients.title}</h4>
      <table class="text-m">
        <tr>
          <th>${member.clients.category01.name}</th>
          <td>${member.clients.category01.list}</td>
        </tr>
        <tr>
          <th>${member.clients.category02.name}</th>
          <td>${member.clients.category02.list}</td>
        </tr>
        <tr>
          <th>${member.clients.category03.name}</th>
          <td>${member.clients.category03.list}</td>
        </tr>
      </table>
    `;

    const contactContainer = document.createElement("div");
    contactContainer.className = "desktop-col-5 tablet-col-4";
    contactContainer.innerHTML = `
      <div class="headshot">
        <img src="${member.imgSrc}" alt="${member.name}" />
      </div>
      <ul>
        <li><strong>${member.contact.method01.name}</strong> <a href="${member.contact.method01.link}" target="_blank">${member.contact.method01.display}</a></li>
        <li><strong>${member.contact.method02.name}</strong> <a href="${member.contact.method02.link}" target="_blank">${member.contact.method02.display}</a></li>
      </ul>
    `;

    memberWrapper.appendChild(memberContainer);
    memberWrapper.appendChild(contactContainer);
    mainContainer.appendChild(memberWrapper);

  });
}

function handleFooter(textData) {
  const footerContainer = document.querySelector("footer");
  if (footerContainer) {
    const footerData = textData.footer;

    footerContainer.innerHTML = `
      <img src="${footerData.logo.src}" alt="${footerData.logo.alt}" ondblclick="document.getElementById('producer-tag').play();" />

      <div class="address desktop-col-3 tablet-col-2">
        <h4>${footerData.address.title}</h4>
        <p>
          ${footerData.address.lines.l1}<br />
          ${footerData.address.lines.l2}<br />
          ${footerData.address.lines.l3}
        </p>
      </div> 

      <div class="copyright desktop-col-3-mid tablet-col-2-mid">
        <h4>${footerData.copyright.title}</h4>
        <p>&copy;<br /> 
          Copyright ${footerData.copyright.year}, ${footerData.copyright.company}
        </p> 
      </div>

      <div class="contacts desktop-col-3-end tablet-col-3-end">
        <h4>${footerData.contacts.title}</h4>
        <p>
          <a href="mailto:${footerData.contacts.emails.business.address}">${footerData.contacts.emails.business.display}</a><br />
          <a href="mailto:${footerData.contacts.emails.press.address}">${footerData.contacts.emails.press.display}</a><br />
          <a href="mailto:${footerData.contacts.emails.careers.address}">${footerData.contacts.emails.careers.display}</a><br />
        </p>
      </div>

      <audio id="producer-tag">
        <source src="images/D1-Whoosh.mp3" type="audio/mpeg">
      </audio>

      <img src="${footerData.logo.src}" alt="${footerData.logo.alt}" ondblclick="document.getElementById('producer-tag').play();" />
    `;
  }
}

function setLottieAttributes(textData) {
  const lottieContainer = document.getElementById("lottie");
  console.log(textData);
  console.log(lottieContainer);
  
  if (lottieContainer) {
    const lottieSrc = getNestedValue(textData, "approach.lottieSrc");
    console.log(lottieSrc);
    const lottieSpeed = getNestedValue(textData, "approach.lottieSpeed");
    console.log(lottieSpeed);
    
    if (lottieSrc && lottieSpeed) {
      const lottieHtml = `
        <dotlottie-player 
          id="lottieAnimation" 
          key="approach.lottieSrc"
          src="${lottieSrc}" 
          background="transparent" 
          speed="${lottieSpeed}" 
          autoplay
          style="width: 100%; height: 100%;">
        </dotlottie-player>
      `;
      lottieContainer.innerHTML = lottieHtml;
    }
  }
}


function updateContent(textData) {
  TextElements(textData);
  // TeamMembers(textData);
  handleApproach(approachBlock)
  handleFooter(textData);
  const delay = 500;

  setTimeout(() => {
    setLottieAttributes(textData);
  }, delay);
}


window.addEventListener('load', initializeData);
window.addEventListener('load', initializeTeamData);

window.onload = initializeData;
window.onload = initializeTeamData;
