import Notifications from "../../src/components/notification"
import { mount } from "cypress/react"

describe("testing the notification component ", () => {
  it("mounts the component", () => {
    mount(<Notifications />)
  })

  it("renders notifications fetched from the API", () => {
    cy.intercept("GET", "/api/notifications", {
      statusCode: 200,
      body: [
        {
          notification_id: 1,
          invite_text: "You have been invited to a room",
          room_id: 14,
          sent_at: new Date("2025-12-20"),
          is_read: false,
          handled: false,
        },
      ],
    }).as("getNotifications")
    mount(<Notifications />)
    cy.wait("@getNotifications")

    cy.get("[data-cy='notification-obj']")
      .should("exist")
      .within(() => {
        cy.get("[data-cy='invite-text']").should("exist")
        cy.get("[data-cy='room-id']").should("exist")
        cy.get("[data-cy='sent-date']").should("exist")

        cy.get("[data-cy='btn-read']").should("exist")
        cy.get("[data-cy='btn-accept']").should("exist")
      })
  })

  it("shows that there are no notifications if the response from the API is an empty array", () => {
    cy.intercept("GET", "/api/notifications", {
      statusCode: 200,
      body: [],
    })
    mount(<Notifications />)
    cy.contains("No notifications!").should("exist")
  })

  it("marks them as read when clicking on mark as read button", () => {
    cy.intercept("GET", "/api/notifications", {
      statusCode: 200,
      body: [
        {
          notification_id: 1,
          invite_text: "Invite",
          room_id: 1,
          sent_at: new Date("2025-12-20"),
          is_read: false,
          handled: false,
        },
      ],
    }).as("getNotifications")

    cy.intercept("POST", "/api/notifications/1/read", { statusCode: 200 }).as(
      "markAsRead"
    )

    mount(<Notifications />)

    cy.wait("@getNotifications")
    cy.contains("Mark as Read").click()

    cy.wait("@markAsRead")
  })

  it("accepts invite when clicking Accept Invite", () => {
    cy.intercept("GET", "/api/notifications", {
      statusCode: 200,
      body: [
        {
          notification_id: 2,
          invite_text: "Room invite",
          room_id: 99,
          sent_at: "2025-12-20",
          is_read: false,
          handled: false,
        },
      ],
    }).as("getNotifications")

    cy.intercept("POST", "/api/notifications/2/accept", { statusCode: 200 }).as(
      "acceptInvite"
    )

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert")
    })

    mount(<Notifications />)

    cy.wait("@getNotifications")
    cy.contains("Accept Invite").click()

    cy.wait("@acceptInvite")
    cy.get("@alert").should("have.been.calledWith", "Invite accepted")
  })
})
