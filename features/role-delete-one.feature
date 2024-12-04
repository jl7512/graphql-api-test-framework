@complete @role @roledeleteone
Feature: RoleDeleteOne mutation
  As an SDET
  I want to delete a role
  So that I can remove roles that are no longer vacant

  @roledeleteone1
  Scenario: Create a new role and delete it
    Given I create a new role with a random name
    And I send a Roles query
    Then I should see the role with the same name in the returned list of roles
    When I delete the role with the random name
    And I query RoleFindOne using id
    Then I should NOT see a role returned
    