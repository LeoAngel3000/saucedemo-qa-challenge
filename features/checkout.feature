Feature: Checkout

  # E2E smoke test covering the complete purchase flow.
  # Product is selected randomly from the available inventory.
  # All products are available for standard_user — sold-out scenarios are out of scope.
  # Checkout uses static test data as SauceDemo does not process real transactions.
  # Cart state reset is performed manually between test runs.

  Background:
    Given I am logged in as standard_user
    And I am on the products page

  Scenario: Successful purchase of a randomly selected product (E2E happy path)
    When I add a random product to the cart
    And I navigate to the cart
    And I proceed to checkout
    And I enter valid shipping information
    And I confirm the order
    Then I should see the order confirmation message "Thank you for your order!"
    And the cart should be empty

  Scenario: Cart reflects correct product after adding an item
    When I add a random product to the cart
    And I navigate to the cart
    Then the cart should contain exactly 1 item
    And the product name and price should match what was added

  Scenario: Cart item can be removed before checkout
    When I add a random product to the cart
    And I navigate to the cart
    And I remove the product from the cart
    Then the cart should be empty
    And the cart badge should not be visible
