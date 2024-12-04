@complete @skill @skillfindone
Feature: SkillFindOne query
  As an SDET
  I want to find one skill
  So that I get the skill I am looking for

  @skillfindone1
  Scenario: Find a skill using id only
    Given I create a new skill with a random name
    When I query SkillFindOne using id
    Then I should see the skill with the same name in the returned list of skills


  @skillfindone2
  Scenario: Find a skill using name only
    Given I create a new skill with a random name
    When I query SkillFindOne using name
    Then I should see the skill with the same name in the returned list of skills

  # This is expected to fail due to a bug
  # When the server state has been reset to a clean state, this test will fail which is expected
  # BUT beware that the second you run it, it will fail because there is a bug
  # see "BUG: Cannot re-create a previously deleted skill"
  @skillfindone3 
  Scenario: Should NOT return a skill when using "id" of skill2 AND "name" of skill1
    Given I create a new skill with name "Mobile Testing"
    And I create a new skill with name "Test Reporting"
    When I query SkillFindOne using id of "Mobile Testing" and name of "Test Reporting"
    Then I should NOT see a skill returned
    