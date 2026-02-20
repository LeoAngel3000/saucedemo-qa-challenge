Feature: API Security

  # API-level security validations using Playwright request context.
  # SauceDemo is a frontend-only demo app — these tests inspect network behavior
  # observable through the browser rather than a dedicated backend API.
  # Security findings documented here would be treated as critical defects
  # in a production environment.

  Scenario: Login request does not expose password in plaintext
    Given I am on the login page
    When I submit the login form with valid credentials
    Then the login request payload should not contain the plaintext password "secret_sauce"

  # This test is marked @known-failure because SauceDemo does not implement
  # server-side session validation — it is a static frontend demo.
  # In a production app, unauthenticated requests to protected routes must return HTTP 401.
  @security-vulnerability @known-failure
  Scenario: Unauthenticated access to a protected route returns HTTP 401
    Given I am not logged in
    When I send a direct request to a protected route
    Then the response status code should be 401

  # SauceDemo does not validate session server-side.
  # Clearing the session token should redirect to login in a production app.
  # This test is intentionally expected to fail — documents a missing access control vulnerability.
  @security-vulnerability @known-failure
  Scenario: Accessing a protected route after session token is cleared should redirect to login
    Given I am logged in as standard_user
    And I am on the products page
    When I clear the session token from the browser storage
    And I navigate to a protected route
    Then I should be redirected to the login page