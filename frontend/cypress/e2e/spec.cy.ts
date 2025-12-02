describe("the page and make sure that it loads and test the basic functionlaity of the site", function () {
  it("load the page", () => {
    cy.visit("/")
    cy.get("h1").should("exist")
  })
})
