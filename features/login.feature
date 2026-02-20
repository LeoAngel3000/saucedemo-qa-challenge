Feature: Login

  # Only standard_user is in scope for this challenge.
  # locked_out_user and other test users are explicitly out of scope.
  # Cart state persisted from previous sessions is ignored in this smoke test.

  Background:
    Given I am a registered user with valid credentials

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter my valid username and password
    And I click the "Login" button
    Then I should be redirected to the products page

  Scenario: Unsuccessful login displays a generic error message
    Given I am on the login page
    When I enter an invalid username or password
    And I click the "Login" button
    Then I should see the message "Epic sadface: Username and password do not match any user in this service"

  # Based on OWASP guidelines, account lockout should trigger after 5 consecutive failed attempts.
  # The 6th attempt should display a lockout message with a cooldown period.
  # OWASP does not mandate a specific cooldown duration — 10 minutes is used here as common industry practice.
  # This test is marked @known-failure because SauceDemo does not implement account lockout.
  # It documents a security vulnerability (brute force risk) and should NOT block the CI pipeline.

  @security-vulnerability @known-failure
  Scenario Outline: No account lockout occurs after multiple failed login attempts (brute force vulnerability)
    Given I am on the login page
    When I enter a valid username and the wrong password "<password>"
    And I click the "Login" button
    Then I should see the message "<error_message>"

    Examples:
      | password      | error_message                                                                               |
      | bad_password1 | Epic sadface: Username and password do not match any user in this service                   |
      | bad_password2 | Epic sadface: Username and password do not match any user in this service                   |
      | bad_password3 | Epic sadface: Username and password do not match any user in this service                   |
      | bad_password4 | Epic sadface: Username and password do not match any user in this service                   |
      | bad_password5 | Epic sadface: Username and password do not match any user in this service                   |
      | bad_password6 | Epic sadface: Account locked. Please try again in 10 minutes or contact your administrator  |
