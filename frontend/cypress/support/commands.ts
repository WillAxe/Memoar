/// <reference types="cypress" />

//intercept the fetch request when logging in and mock the api response from the backend
Cypress.Commands.add("login", () => {
  cy.visit("/")
  cy.window().then((win) => {
    win.localStorage.setItem("userID", "1")
  })
  cy.intercept("POST", "/api/login", {
    statusCode: 200,
    body: { user_id: 1 },
  }).as("login")

  cy.intercept("GET", /\/api\/user\/.*/, {
    statusCode: 200,
    body: {
      user_id: 1,
      user_name: "Test User",
    },
  }).as("getUser")

  cy.intercept("GET", /\/api\/user\/.*\/feed/, {
    statusCode: 200,
    body: [],
  }).as("getFeed")

  cy.get("[data-cy='login-link']").click()
  cy.get('[data-cy="mail-input-lgn"]').type("test@example.com")
  cy.get('[data-cy="psw-input-lgn"]').type("password")
  cy.get('[data-cy="login-btn"]').click()

  cy.wait("@login")
  cy.wait("@getUser")
  cy.wait("@getFeed")

  cy.url().should("include", "/landingpage/1")
})

/* eslint-disable @typescript-eslint/no-namespace */
declare namespace Cypress {
  interface Chainable {
    login(): Chainable<Element>
  }
}
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
