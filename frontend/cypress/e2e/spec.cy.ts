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
    cy.get("[data-cy='mail-input-lgn']")
      .type("test@example.com")
      .should("have.class", "correct-input")
    cy.get("[data-cy='psw-input-lgn']")
      .type("password")
      .should("have.class", "correct-input")
    cy.get("[data-cy='login-btn']").click()

    cy.get("[data-cy='login-notification-msg']").contains(
      "Successfully logged in!"
    )
  })

  it("enter wrong mail or password", () => {
    cy.visit("/#/login")
    cy.get("[data-cy='mail-input-lgn']")
      .type("will3example.")
      .should("have.class", "wrong-input")
    cy.get("[data-cy='psw-input-lgn']")
      .type("w43")
      .should("have.class", "wrong-input")
  })

  it("signup and creates a account", () => {
    cy.get("[data-cy='signup-link']").click()
    cy.get("[data-cy='name-input-signup']").type("Test")
    cy.get("[data-cy='mail-input-signup']")
      .type("test@example.com")
      .should("have.class", "correct-input")
    cy.get("[data-cy='psw-input-signup']").type("password")
    cy.get("[data-cy='psw-input-signup']").should("have.class", "correct-input")

    cy.intercept("POST", "api/users", {
      body: {
        user_id: 1,
        user_name: "Test",
        user_mail: "test@@example.com",
        user_password: "password",
        user_birthday: "2002-03-15",
        user_age: 0,
      },
    }).as("createUser")
    cy.get("@createUser")
    cy.get("[data-cy='signup-btn']").click()

    cy.get("[data-cy='signup-notification-msg']").contains(
      "Successfully created your account!"
    )
  })

  it("wrong format on mail and password", () => {
    cy.visit("/#/signup")
    cy.get("[data-cy='mail-input-signup']").type("will3example.")
    cy.get("[data-cy='mail-input-signup']").should("have.class", "wrong-input")
    cy.get("[data-cy='psw-input-signup']").type("w43")
    cy.get("[data-cy='psw-input-signup']").should("have.class", "wrong-input")
  })
})
