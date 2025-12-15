describe("the page and make sure that it loads and test the basic functionlaity of the site", function () {
  beforeEach(() => {
    cy.visit("/")
  })
  it("load the page", () => {
    cy.get("h1").should("exist")
  })

  it("has a navbar for user to navigate with", () => {
    cy.get("[data-cy='navigation-bar']").should("exist")
    cy.get("[data-cy='navigation-bar']").within(() => {
      cy.get("[data-cy='signup-link']").click()
      cy.url().should("include", "/signup")
      cy.get("[data-cy='home-navigation-link']").click()
      cy.url().should("include", "/#/")
      cy.get("[data-cy='login-link']").click()
      cy.url().should("include", "/login")
    })
  })

  it("presses on the login link and login the user", () => {
    cy.get("[data-cy='login-link']").click()
    // cy.get("[data-cy='name-input-lgn']").type("Will")
    cy.get("[data-cy='mail-input-lgn']").type("will@example.com")
    cy.get("[data-cy='mail-input-lgn']").should("have.class", "correct-input")
    cy.get("[data-cy='psw-input-lgn']").type("Will")
    cy.get("[data-cy='psw-input-lgn']").should("have.class", "correct-input")
    cy.get("[data-cy='login-btn']").click()

    cy.get("[data-cy='login-notification-msg']").contains(
      "Successfully logged in!"
    )
  })

  it("enter wrong mail or password", () => {
    cy.visit("/login")
    cy.get("[data-cy='mail-input-lgn']").type("will3example.")
    cy.get("[data-cy='mail-input-lgn']").should("have.class", "wrong-input")
    cy.get("[data-cy='psw-input-lgn']").type("w43ll")
    cy.get("[data-cy='psw-input-lgn']").should("have.class", "wrong-input")
  })

  it("signup and creates a account", () => {
    cy.visit("/signup")
    cy.get("[data-cy='name-input-signup']").type("Alfred")
    cy.get("[data-cy='mail-input-signup']").type("alfred@example.com")
    cy.get("[data-cy='mail-input-signup']").should(
      "have.class",
      "correct-input"
    )
    cy.get("[data-cy='psw-input-signup']").type("password")
    cy.get("[data-cy='psw-input-signup']").should("have.class", "correct-input")

    cy.get("[data-cy='signup-btn']").click()

    cy.get("[data-cy='signup-notification-msg']").contains(
      "Successfully created your account!"
    )
  })

  it("wrong format on mail and password", () => {
    cy.visit("/signup")
    cy.get("[data-cy='mail-input-signup']").type("will3example.")
    cy.get("[data-cy='mail-input-signup']").should("have.class", "wrong-input")
    cy.get("[data-cy='psw-input-singup']").type("w43ll")
    cy.get("[data-cy='psw-input-signup']").should("have.class", "wrong-input")
  })
})
