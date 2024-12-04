@complete @role @rolecreateone
Feature: RoleCreateOne mutation
  As an SDET
  I want to create a role
  So that there are roles for applicants to apply to

  @rolecreateone1
  Scenario: Create a role and query the role
    Given I create a new role with a random name
    And I send a Roles query
    Then I should see the role with the same name in the returned list of roles

  # This is expected to fail due to a bug
  # see "BUG: The "RoleCreateOne" mutation allows you to create a role with an empty string as the name" in README.md
  @rolecreateone2
  Scenario: Should not be able to create a role with empty string as name
    Given I create a new role with name ""
    Then I should NOT see the role created
    
  @rolecreateone3
  Scenario: Should be able to re-create a previously deleted role
    Given I create a new role with a random name
    And I delete the role with the random name
    When I send a Roles query
    Then I should NOT see the role with the random name in the returned list of roles
    When I create a new role with the same name
    Then I should see the role with the same name created
    