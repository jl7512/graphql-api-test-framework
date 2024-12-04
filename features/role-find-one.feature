@complete @role @rolefindone
Feature: RoleFindOne query
  As an SDET
  I want to find one role
  So that I get the role I am looking for

  @rolefindone1
  Scenario: Find a role using id only
    Given I create a new role with a random name
    When I query RoleFindOne using id
    Then I should see the role with the same name in the returned list of roles
  
  @rolefindone2
  Scenario: Find a role using name only
    Given I create a new role with a random name
    When I query RoleFindOne using name
    Then I should see the role with the same name in the returned list of roles

  # This is expected to fail due to a bug
  # see "BUG: If "id" field is provided to the "RoleFindOne" query the "name" field is ignored" in README.md
  @rolefindone3 
  Scenario: Should NOT return a role when using "id" of role2 AND "name" of role1
    Given I create a new role with name "Junior SDET"
    And I create a new role with name "Mid level SDET"
    When I query RoleFindOne using id of "Junior SDET" and name of "Mid level SDET"
    Then I should NOT see a role returned
    