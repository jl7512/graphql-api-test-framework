@complete @role @roleupdateone
Feature: RoleUpdateOne mutation
  As an SDET
  I want to update a role
  So that I can keep the role up to date

  @roleupdateone1 @createrole
  Scenario: Create a role and update the role
    Given I update the role with name "UPDATED-ROLE"
    And I query RoleFindOne using id
    Then I should see the role with the same name in the returned list of roles
  
  # This is expected to fail due to a bug
  # see "BUG: The "RoleUpdateOne" mutation creates a new Role resource on the server if the role "id" that is sent in the mutation does not exist" in README.md
  @roleupdateone2
  Scenario: Should NOT be able to update a role that does not exist
    Given I update a role that does not exist
    Then the role should NOT be updated
    
  # This is expected to fail due to a bug
  # see "BUG: The "RoleUpdateOne" mutation creates a new Role resource on the server if the role "id" that is sent in the mutation does not exist" in README.md
  @roleupdateone3
  Scenario: Updating a role should not create a new role
    Given I update a role that does not exist
    And I query RoleFindOne using id
    Then I should NOT see a role returned
    