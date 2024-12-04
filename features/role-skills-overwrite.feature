@complete @role @roleoverwriteone
Feature: RoleOverwriteOne mutation
  As an SDET
  I want to update skills on a role
  So that I can keep the skills required for roles up to date

  @roleoverwriteone1 @createrole
  Scenario: Update skils on a role
    Given I overwrite the skills on a role
    Then I should see the updated skills on the role
    When I send a Roles query
    Then I should see the role with the updated skills in the returned list of roles

  # This is expected to fail due to a bug
  # see "BUG: The "RoleSkillsOverwrite" mutation allows updating a role with a skill "id" that does not exist" in README.md
  @roleoverwriteone2 @createrole
  Scenario: Should return error when trying to update with a skill id that does not exist
    Given I overwrite a role with a skill that does not exist
    Then the role should not be updated
