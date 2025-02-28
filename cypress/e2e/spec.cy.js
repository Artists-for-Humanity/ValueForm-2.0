import '@percy/cypress'
const desktopWidth = 1080;
const tabletWidth = 810;
const mobileWidth = 440;
// await percySnapshot(page, 'my-snapshot', { waitForTimeout: 1000 });

describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
  })
})

describe('Visual Regression Tests', () => {
  it('Loads the homepage', () => {
    cy.wait(5000)
    cy.visit('http://localhost:3000')
    cy.wait(5000)
    // cy.percySnapshot("News", { widths: [desktopWidth, tabletWidth, mobileWidth] });
    // cy.percySnapshot("Bny", { widths: [desktopWidth, tabletWidth, mobileWidth] });
    // cy.percySnapshot("Chris", { widths: [desktopWidth, tabletWidth, mobileWidth] });
    // cy.percySnapshot("Muse", { widths: [desktopWidth, tabletWidth, mobileWidth] });
    cy.percySnapshot("Home", { widths: [desktopWidth, tabletWidth, mobileWidth] });
  })
});