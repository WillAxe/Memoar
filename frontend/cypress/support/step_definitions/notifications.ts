import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"

Given("Im logged in", () => {
  cy.login({
    notifications: [
      {
        notification_id: 1,
        user_id: 1,
        room_id: 2,
        invite_text: "You have been invited",
        is_read: false,
        handled: false,
        sent_at: new Date("2025-12-16"),
      },
    ],
  })

  cy.url().should("include", "/landingpage/1")
})
//use cy.trigger() to trigger the js event mouseover to see that the text box appears on hover
When("I see a new invitation", () => {
  cy.get("[data-cy='notification-inbox']").trigger("mouseover")
  cy.get("[data-cy='notification-inbox-msg']").should("be.visible")
})

Then("It should show me that I have an new invitation", () => {
  cy.get("[data-cy='notification-inbox']").should("have.class", "new-msg")
})

Given("Im logged in for the first time without new invitations", () => {
  cy.login({ notifications: [] })
})

When("I check my notification inbox", () => {
  cy.get("[data-cy='notification-inbox']").click()
  cy.get("[data-cy='notification-inbox-log']")
})

Then("I should see no new messages", () => {
  cy.get("[data-cy='notification-inbox']").should(
    "have.attr",
    "data-has-new",
    "false"
  )
})
