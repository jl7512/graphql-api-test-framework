@complete @skill @skills
Feature: Skills query
  As an SDET
  I want to query skills
  So that I can see all the available skills

  @skills1
  Scenario: Return all available skills
    Given I create a new skill with a random name
    Then I should see the skill with the same name created
    When I send a Skills query
    Then I should see the skill with the same name in the returned list of skills
    