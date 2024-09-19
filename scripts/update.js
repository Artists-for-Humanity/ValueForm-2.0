import { fetchTagline } from "../sanity-studio/fetchTagline.js";
// import { fetchTeamData } from "../sanity-studio/sanity-utils.js";
// import { fetchIntroBlockData } from "../sanity-studio/fetchApproach.js";
// import { teamData } from "./data/team.js";
// import { introBlock } from "./data/approachIntroBlock.js";
// import { approachBlock } from "./data/approachBlock.js";
import { footer as footerData } from "./data/footer.js"; // Import the footer data

let generalData = {
  tagline: {
    home: "Temp",
  },
};

 async function initializeData() {
  try {
    const tagline = await fetchTagline();
    // const introBlockData = await fetchIntroBlockData();
    generalData.tagline.home = tagline;

    // Create the textData object after the tagline has been fetched
    const textData = {
      ...generalData,
      // team: teamData,
      // ...approachBlock,
      // ...introBlock,
      // ...introBlockData,
      footer: footerData,
    };

    // Update content only after data initialization is complete
    // updateContent(textData);
    // animateOnLoad();
  } catch (err) {
    console.error("Error fetching tagline:", err);
  }
}

// async function initializeTeamData() {
//   try {
    // const teamMember = await fetchTeamData();
    // const memberData = {
    //   team: teamMember,
    // };

    // if (Object.entries(memberData.team).length == 1) {
    //   document.querySelector('main.internal').style.minHeight = 'auto';
    // }

  // TeamMembers(memberData);
  // animateOnLoad();
  // }
  // catch (err) {
  //   console.error("Error fetching teamMember:", err);
  // }
// }

// async function initializeApproachBlockData() {
//   try {
//     const approachBlocks = await fetchIntroBlockData();
//     const approachBlockData = {
//       blocks: approachBlocks,
//     };
    // handleApproach(approachBlockData);
    // animateOnLoad();
  // } 
  // catch (err) {
  //   console.error("Error fetching approach blocks:", err);
  // }
// }

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

// function handleApproach(approachData) {
//   const mainContainer = document.querySelector(".approach-container");
//   if (!approachData.blocks || !mainContainer) return;

//   function wrapStringWithClass(str, substr, className, additionalClass = "") {
//     const regex = new RegExp(`(${substr})`, 'g');
//     const combinedClass = `${className} ${additionalClass}`.trim();
//     return str.replace(regex, `<span class="${combinedClass}">$1</span>`);
//   }

//   function wrapMultipleStringsWithClass(str, substrings, className) {
//     substrings.forEach(substring => {
//       str = wrapStringWithClass(str, substring, className);
//     });
//     return str;
//   }

//   if (Array.isArray(approachData.blocks)) {

//     approachData.blocks.sort((a, b) => a.number - b.number);

//     approachData.blocks.forEach((approachBlock, index) => {
//       // console.log(index);

//       // Create CSS class dynamically for each block
//       const style = document.createElement('style');
//       style.type = 'text/css';

//       const cssClass = `
//           p span.${approachBlock.class.name}:before {
//               content: url(${approachBlock.class.image});
//               text-align: center;
//               display: none;
//               width: ${approachBlock.class.width};
//               height: ${approachBlock.class.height};
//               top: ${approachBlock.class.top};
//               left: ${approachBlock.class.left};
//               background: ${approachBlock.class.background};
//           }
//       `;
//       style.appendChild(document.createTextNode(cssClass));
//       document.head.appendChild(style);

//       // Modify body content to include styling for underline and bold
//       let modifiedBody = approachBlock.body;
//       if (approachBlock.underlineText) {
//         modifiedBody = wrapStringWithClass(modifiedBody, approachBlock.underlineText, 'underline', approachBlock.class.name);
//       }
//       if (approachBlock.boldText && Array.isArray(approachBlock.boldText)) {
//         modifiedBody = wrapMultipleStringsWithClass(modifiedBody, approachBlock.boldText, 'bold');
//       } else if (approachBlock.boldText) {
//         modifiedBody = wrapStringWithClass(modifiedBody, approachBlock.bold, 'bold');
//       }

//       const approachWrapper = document.createElement("div");
//       approachWrapper.className = "container fadeInUp";

//       approachWrapper.innerHTML = `
//         <h2 class="desktop-col-10 tablet-col-6 text-l">${approachBlock.title}</h2>
//         <p class="text-m desktop-col-7 tablet-col-6">
//          ${modifiedBody}
//         </p>
//         <h4 class="desktop-col-7 tablet-col-6">Capabilities:</h4>
//         <ul class="desktop-col-10 tablet-col-6 text-m">
//           ${approachBlock.capabilities.map(capability => `<li>${capability}</li>`).join('')}
//         </ul>
//       `;

//       mainContainer.appendChild(approachWrapper);
//     });
//   } else {
//     console.error("approachData.blocks is not an array:", approachData.blocks);
//   }
// }

// function TeamMembers(memberData) {
//   const mainContainer = document.querySelector(".appendToMe");
//   if (!memberData.team || !mainContainer) return;

//   // Utility functions for wrapping strings
//   function wrapStringWithLink(str, substr, href, target) {
//     const regex = new RegExp(`(${substr})`, 'g');
//     return str.replace(regex, `<a href="${href}" target="${target}">$1</a>`);
//   }

//   function wrapMultipleStringsWithLinks(str, substrings, href, target) {
//     substrings.forEach(substring => {
//       str = wrapStringWithLink(str, substring, href, target);
//     });
//     return str;
//   }

//   Object.keys(memberData.team).forEach((memberKey, index) => {
//     const member = memberData.team[memberKey];
//     const memberWrapper = document.createElement("div");
//     memberWrapper.className = "container no-border fadeInUp no-before-after animated";
//     memberWrapper.style.animationDelay = `${600 + index * 100}ms`;
    
//     if (index != 0) {
//       memberWrapper.classList.add("member-top");
//     }

//     const memberContainer = document.createElement("div");
//     memberContainer.className = "desktop-col-7-left tablet-col-4";

//     // Apply link styling to specific parts of the bio
//     let modifiedBio = member.bio;
//     if (member.underlineText) {
//       const linkHref = member.linkHref || "../images/launch-letter.pdf";  // Default link if not specified
//       const linkTarget = member.linkTarget || "_blank";  // Default target if not specified
//       if (Array.isArray(member.underlineText)) {
//         modifiedBio = wrapMultipleStringsWithLinks(modifiedBio, member.underlineText, linkHref, linkTarget);
//       } else {
//         modifiedBio = wrapStringWithLink(modifiedBio, member.underlineText, linkHref, linkTarget);
//       }
//     }

//     // Generate client links dynamically
//     let clientHtml = '<h4>Select Clients:</h4><table class="text-m">';
//     Object.keys(member.clients).forEach((categoryKey) => {
//       const category = member.clients[categoryKey];
//       if (category.name && category.list) {
//         clientHtml += `
//           <tr>
//             <th>${category.name}</th>
//             <td>${category.list}</td>
//           </tr>
//         `;
//       }
//     });
//     clientHtml += '</table>';

//     memberContainer.innerHTML = `
//       <h2 class="text-l">${member.name}</h2>
//       <h4>${member.title}</h4>
//       <div class="headshot">
//         <img src="${member.imgSrc}" alt="${member.name}" />
//       </div>
//       <p class="text-m">${modifiedBio}</p>
//       ${clientHtml}
//     `;

//     // Generate contact dynamically
//     const contactContainer = document.createElement("div");
//     contactContainer.className = "desktop-col-5 tablet-col-4";

//     let contactHtml = '<div class="headshot"><img src="' + member.imgSrc + '" alt="' + member.name + '" /></div><ul>';
//     Object.keys(member.contact).forEach((methodKey) => {
//       const method = member.contact[methodKey];
//       contactHtml += `
//         <li><strong>${method.name}</strong> <a href="${method.link}" target="_blank">${method.display}</a></li>
//       `;
//     });
//     contactHtml += '</ul>';

//     contactContainer.innerHTML = contactHtml;

//     memberWrapper.appendChild(memberContainer);
//     memberWrapper.appendChild(contactContainer);
//     mainContainer.appendChild(memberWrapper);
//   });
// }


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

// function setLottieAttributes(textData) {
//   const lottieContainer = document.getElementById("lottie");
//   if (lottieContainer) {
//     const lottieSrc = getNestedValue(textData, "approach.lottieSrc");
//     const lottieSpeed = getNestedValue(textData, "approach.lottieSpeed");
    
//     if (lottieSrc && lottieSpeed) {
//       const lottieHtml = `
//         <dotlottie-player 
//           id="lottieAnimation" 
//           key="approach.lottieSrc"
//           src="${lottieSrc}" 
//           background="transparent" 
//           speed="${lottieSpeed}" 
//           autoplay
//           style="width: 100%; height: 100%;">
//         </dotlottie-player>
//       `;
//       lottieContainer.innerHTML = lottieHtml;
//     }
//   }
// }

function updateContent(textData) {
  TextElements(textData);
  // TeamMembers(textData);
  // handleApproach(approachBlock);
  
  handleFooter(textData);
  // const delay = 500;

  // setTimeout(() => {
  //   setLottieAttributes(textData);
  // }, delay);
}

window.addEventListener('load', () => {
  initializeData();
  // initializeTeamData();
  // initializeApproachBlockData();
});
