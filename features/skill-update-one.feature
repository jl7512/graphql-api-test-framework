@complete @skill @skillupdateone
Feature: SkillUpdateOne mutation
  As an SDET
  I want to update a skill
  So that I can keep the skill up to date

  @skillupdateone1 @createskill
  Scenario: Create a skill and update the skill
    Given I update the skill with name "UPDATED-SKILL"
    And I query SkillFindOne using id
    Then I should see the skill with the same name in the returned list of skills
  
  # This is expected to fail due to a bug
  # see "BUG: The "SkillUpdateOne" mutation creates a new Skill resource on the server if the "id" that is sent in the mutation does not exist" in README.md
  @skillupdateone2
  Scenario: Should NOT be able to update a skill that does not exist
    Given I update a skill that does not exist
    Then the skill should NOT be updated
  
  # This is expected to fail due to a bug
  # see "BUG: The "SkillUpdateOne" mutation creates a new Skill resource on the server if the "id" that is sent in the mutation does not exist" in README.md
  @skillupdateone3
  Scenario: Updating a skill should not create a new skill
    Given I update a skill that does not exist
    And I query SkillFindOne using id
    Then I should NOT see a skill returned
    