describe("testing the parts of the app that requires an account and with a newly added account for the first time", function () {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("userID", "1")
    })
    cy.login({
      notifications: [],
      feed: [],
    })
  })

  it("has a grettings title with the user's name", () => {
    cy.get("[data-cy='h1-title']").should("contain", "Welcome Test User!")
  })

  it("has an navbar to navigate through the site", () => {
    cy.get("[data-cy='navigation-bar']").should("exist")
    cy.get("[data-cy='navigation-bar']").within(() => {
      cy.intercept("GET", "/api/users/1/rooms", {
        body: [],
      }).as("getUserRooms")
      cy.get("[data-cy='user-specific-rooms']").click()
      cy.wait("@getUserRooms")
      cy.url().should("include", "/landingpage/rooms/1")

      cy.get("[data-cy='create-room-link']").click()
      cy.url().should("include", "/landingpage/1/newroom")
      cy.get("[data-cy='home-navigation-link']").click()
      cy.url().should("include", "/landingpage/1")
    })
  })

  it("has a feed and show a message if there hasn't been any recent activity", () => {
    cy.get("[data-cy='recent-activity-feed']").should("exist")
    cy.get("[data-cy='no-activity']").should("contain", "No recent activity!")
  })

  it("the user can create a new room and see it ", () => {
    cy.intercept("POST", "/api/rooms", {
      statusCode: 201,
      body: {
        room_id: 1,
        room_name: "New test room",
        user_id: 1,
      },
    }).as("newRoom")
    cy.get("[data-cy='navigation-bar']").within(() => {
      cy.get("[data-cy='create-room-link']").click()
    })
    cy.url().should("include", "/landingpage/1/newroom")

    cy.contains("Create a new room").click()

    cy.get("[data-cy='create-room-form']").should("exist")
    cy.get("[data-cy='create-room-form']").within(() => {
      cy.get("[data-cy='room-name-input']")
        .should("exist")
        .and("have.attr", "type", "text")
      cy.get("[data-cy='room-name-input']").type("New test room")
      cy.get("[data-cy='submit-data-btn']").click()
    })
    cy.wait("@newRoom")

    cy.intercept("GET", "/api/users/1/rooms", {
      body: {
        rooms: [
          {
            room_id: 1,
            room_name: "New test room",
          },
        ],
      },
    }).as("getUserRooms")
    cy.get("[data-cy='navigation-bar']").within(() => {
      cy.get("[data-cy='user-specific-rooms']").click()
    })
    cy.wait("@getUserRooms")

    cy.get("[data-cy='room-card']").should("exist")
    cy.get("[data-cy='room-card']").within(() => {
      cy.get("[data-cy='room-name-card']").should("contain", "New test room")
      cy.intercept("GET", "/api/room/1", {
        body: {
          room: {
            room_id: 1,
            room_name: "New test room",
          },
        },
      }).as("getRoom")
    })
    cy.get("[data-cy='link-to-specific-room']").click()
    cy.wait("@getRoom")
    cy.url().should("include", "/landingpage/1/room/1")
    cy.get("[data-cy='room-name-title']").should("exist")
  })
})

// Test for the scenarios that requires the user to have been logged in before etc. have a feed with recent activity
describe("test the app with a older user that has logged in before before and has a feed", function () {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("userID", "1")
    })
    cy.login({
      notifications: [
        {
          notification_id: 1,
          user_id: 8,
          room_id: 2,
          invite_text: "You have been invited",
          is_read: false,
          handled: false,
          sent_at: new Date("2025-12-16"),
        },
        {
          notification_id: 6,
          user_id: 3,
          room_id: 7,
          invite_text: "You have been invited",
          is_read: false,
          handled: false,
          sent_at: new Date("2025-11-27"),
        },
      ],
      feed: [
        {
          type: "post",
          roomName: "Test room",
          createdAt: new Date().toISOString(),
          content: "Really good picture filled with memories",
        },
      ],
    })
  })

  it("show the feed if there has been some activity recently", () => {
    cy.get("[data-cy='recent-activity-feed']").should("exist")
    cy.get("[data-cy='activity-feed-card']").should("exist")
    cy.get("[data-cy='activity-feed-card']").within(() => {
      cy.get("[data-cy='feed-title']").should("exist")
      cy.get("[data-cy='activity-info']").should("exist")
    })
  })

  it("can click on a room to navigate to the specific room", () => {
    cy.get("[data-cy='navigation-bar']").within(() => {
      cy.intercept("GET", "/api/users/1/rooms", {
        body: [
          {
            rooms: [
              {
                room_id: 1,
                room_name: "Test room",
              },
            ],
          },
        ],
      }).as("getUserRooms")
      cy.get("[data-cy='user-specific-rooms']").click()
      cy.wait("@getUserRooms")
      cy.url().should("include", "/landingpage/rooms/1")
    })
  })
})
