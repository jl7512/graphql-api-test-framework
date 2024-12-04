@complete @skill @skilldeleteone
Feature: SkillDeleteOne mutation
  As an SDET
  I want to delete a skill
  So that I can remove skill that are no longer relevant

  @skilldeleteone1
  Scenario: Create a new skill and delete it
    Given I create a new skill with a random name
    And I send a Skills query
    Then I should see the skill with the same name in the returned list of skills
    When I delete the skill with the random name
    And I query SkillFindOne using id
    Then I should NOT see a skill returned
    