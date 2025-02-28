import '@percy/cypress'
const desktopWidth = 1080;
const tabletWidth = 810;
const mobileWidth = 440;
const desktopHeight = 1138;
const tabletHeight = 1121;
const mobileHeight = 1426;

describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://www.valueform.io/')
  })
})

describe('Visual Regression Tests', () => {
  it('Takes a snapshot after main content loads', () => {
    cy.visit('https://www.valueform.io/');

    // Inject CSS to override opacity and visibility issues
    cy.document().then((doc) => {
      const style = doc.createElement('style');
      style.innerHTML = `
        * { animation: none !important; transition: none !important; }
        #animatedHeader, #animatedNav, .fadeInUp {
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
      `;
      doc.head.appendChild(style);
    });

    // Take Percy snapshot
    cy.percySnapshot("Home", { widths: [desktopWidth, tabletWidth, mobileWidth], heights: [desktopHeight, tabletHeight, mobileHeight] });
  });
});
