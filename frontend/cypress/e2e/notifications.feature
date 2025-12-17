Feature: A notification inbox for invitations and more
As a user that likes to share things with people and colleborate with others, so I would like to have an sort of inbox to see new invites so that I never miss an opportunity to colleborate with others
Scenario: New invitation
Given Im logged in
When I see a new invitation
Then It should show me that I have an new invitation

Scenario: No new invitations
Given Im logged in for the first time without new invitations
When I check my notification inbox
Then I should see no new messages