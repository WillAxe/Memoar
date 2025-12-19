describe("the page and make sure that it loads and test the basic functionlaity of the site", function () {
  beforeEach(() => {
    cy.visit("/")
  })
  it("load the page", () => {
    cy.get("h1").should("exist")
  })

  it("shows the first image in the slideshow and have next and prevoius buttons", () => {
    cy.get("[data-cy='slideshow-image'].active").within(() => {
      cy.get("img")
        .should("exist")
        .and("have.attr", "alt", "Photo album example")
        .and("have.attr", "src")
        .and("include", "Photo-album-ex")
      cy.get("[data-cy='caption-text']").should(
        "contain",
        "Collect memories in your own rooms"
      )
    })
    cy.get("[data-cy='change-slide-btn'].next").should("exist")
    cy.get("[data-cy='change-slide-btn'].prev").should("exist")
  })

  //Tests for testing the slideshow buttons
  it("has working buttons for showing the previous and next pictures in the slideshow", () => {
    cy.get("[data-cy='change-slide-btn'].next").click()

    cy.get("[data-cy='slideshow-image'].active").within(() => {
      cy.get("img").should("have.attr", "alt", "an image of creating a room")

      cy.get(".caption-text").should("contain", "1. Create a room")
    })

    cy.get("[data-cy='change-slide-btn'].prev").click()

    cy.get("[data-cy='slideshow-image'].active").within(() => {
      cy.get("img").should("have.attr", "alt", "Photo album example")

      cy.get(".caption-text").should(
        "contain",
        "Collect memories in your own rooms"
      )
    })
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
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { user_id: 1, user_name: "Test User" },
    }).as("login")
    cy.get("[data-cy='login-btn']").click()
    cy.wait("@login")
    cy.get("[data-cy='login-notification-msg']").contains(
      "Successfully logged in!"
    )
  })

  it("enter wrong mail or password", () => {
    cy.visit("/#/login")
    cy.get("[data-cy='mail-input-lgn']").type("will3example.")
    cy.get("[data-cy='psw-input-lgn']").type("w43")
    cy.get("[data-cy='login-btn']").click()
    cy.get("[data-cy='mail-input-lgn']").should("have.class", "wrong-input")
    cy.get("[data-cy='psw-input-lgn']").should("have.class", "wrong-input")
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
