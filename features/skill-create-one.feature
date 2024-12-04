@complete @skill @skillcreateone
Feature: SkillCreateOne mutation
  As an SDET
  I want to create a skill
  So that there are skills that we can associate to roles

  @skillcreateone1
  Scenario: Create a skill and query the skill
    Given I create a new skill with a random name
    When I send a Skills query
    Then I should see the skill with the same name in the returned list of skills
  
  # This is expected to fail due to a bug
  # When the server state has been reset to a clean state, this test will pass
  # BUT it will fail the second time you run it because there is a bug
  # see "BUG: Cannot re-create a previously deleted skill"
  @skillcreateone2
  Scenario: Should not be able to create a skill with empty string as name
    Given I create a new skill with name ""
    Then I should NOT see the skill created
    
  # This is expected to fail due to a bug
  # see "BUG: Cannot re-create a previously deleted skill"
  @skillcreateone3
  Scenario: Should be able to re-create a previously deleted skill
    Given I create a new skill with a random name
    And I delete the skill with the random name
    When I send a Skills query
    Then I should NOT see the skill with the random name in the returned list of skills
    When I create a new skill with the same name
    Then I should see the skill with the same name created
    