@complete @role @roles
Feature: Roles query
  As an SDET
  I want to query roles
  So that I can see all the available roles
  
  @roles1
  Scenario: Return all available roles
    Given I create a new role with a random name
    Then I should see the role with the same name created
    When I send a Roles query
    Then I should see the role with the same name in the returned list of roles
    