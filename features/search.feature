Feature: Product search
  As a user browsing the product catalog
  I want to search for products by keyword
  So that I can quickly find what I'm looking for

  Background:
    Given the user is on the product explorer homepage

  Scenario: Searching for an existing product
    When the user searches for "phone"
    Then the results should contain products matching "phone"

  Scenario: Clearing the search shows all products again
    When the user searches for "phone"
    And the user clears the search
    Then all products should be visible again