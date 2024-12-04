import { Given, When, Then } from '@cucumber/cucumber';
import expect from 'expect';
import { CustomWorld } from '../support/world';
import { Asd } from '../support/types';

Given('I create a new role with name {string}', async function (this: CustomWorld, expectedRoleName: string) {
  this.role = await this.client.roleCreateOne({ name: expectedRoleName });
  expect(this.role).not.toBeNull();
});

Given('I create a new role', async function (this: CustomWorld) {
  const roleName = this.generateRandomName('ROLE');
  this.role = await this.client.roleCreateOne({ name: roleName });
  expect(this.role).not.toBeNull();
});

Given('I create a new role with a random name', async function (this: CustomWorld) {
  const randomisedRoleName = this.generateRandomName('ROLE');
  this.role = await this.client.roleCreateOne({ name: randomisedRoleName });
  expect(this.role).not.toBeNull();
});

Given('I update the role with name {string}', async function (this: CustomWorld, updatedRoleName: string) {
  const { id } = this.role;
  this.role = await this.client.roleUpdateOne({ id, name: updatedRoleName});
});

Given('I overwrite the skills on a role', async function (this: CustomWorld) {
  const { id: roleId } = this.role;
  const overwriteSkills: Asd[] = [];

  for (let iteration = 0; iteration < 2; iteration++) {
    const skillName = this.generateRandomName(`SKILL-OVERWRITE-${iteration}`);
    const createdSkill = await this.client.skillCreateOne({ name: skillName });
    this.skills.push(createdSkill);

    overwriteSkills.push({ skillId: createdSkill.id, weight: iteration });
  }

  this.roleSkillsOverwriteResponse = await this.client.roleSkillsOverwrite({ roleId, skills: overwriteSkills });
});

Given('I overwrite a role with a skill that does not exist', async function (this: CustomWorld) {
  const randomRoleId = this.generateRandomId() + 1000;
  const overwriteSkills: Asd[] = [];

  for (let iteration = 0; iteration < 2; iteration++) {
    const skillName = this.generateRandomName(`SKILL-OVERWRITE-${iteration}`);
    const createdSkill = await this.client.skillCreateOne({ name: skillName });
    this.skills.push(createdSkill);

    overwriteSkills.push({ skillId: createdSkill.id, weight: iteration });
  }

  this.roleSkillsOverwriteResponse = await this.client.roleSkillsOverwrite({ roleId: randomRoleId, skills: overwriteSkills });
});

When('I delete the role with the random name', async function (this: CustomWorld) {
  const { id } = this.role;
  const { affected } = await this.client.roleDeleteOne({ id });
  expect(affected).toEqual(1);
});

When('I create a new role with the same name', async function (this: CustomWorld) {
  const { name } = this.role;
  const createdRoleWithSameName = await this.client.roleCreateOne({ name });
  expect(createdRoleWithSameName).not.toBeNull();
});

When('I send a Roles query', async function (this: CustomWorld) {
  this.queryAllRolesResponse = await this.client.roles();
});

When('I query RoleFindOne using id', async function (this: CustomWorld) {
  const { id } = this.role;
  this.queryRoleFindOneResponse = await this.client.roleFindOne({ id });
});

When('I query RoleFindOne using name', async function (this: CustomWorld) {
  const { id } = this.role;
  this.queryRoleFindOneResponse = await this.client.roleFindOne({ id });
});

When('I query RoleFindOne using id of {string} and name of {string}', async function (this: CustomWorld, role1Name: string, role2Name: string) {
  const roles = await  this.client.roles();
  const { id } = roles.filter(role => role.name === role1Name)[0];
  this.queryRoleFindOneResponse = await this.client.roleFindOne({ id, name: role2Name });
});

When('I update a role that does not exist', async function (this: CustomWorld) {
  const randomId = this.generateRandomId();
  const randomRoleName = this.generateRandomName('ROLE');
  this.role = await this.client.roleUpdateOne({ id: randomId, name: randomRoleName});
});

Then('I should NOT see a role returned', async function (this: CustomWorld) {
  expect(this.queryRoleFindOneResponse).toEqual(null);
});

Then('I should NOT see the role with the random name in the returned list of roles', async function (this: CustomWorld) {
  const queryRoles = await this.client.roles();
  const { name: createdRoleWithSameName} = this.role;
  const filterRoles = queryRoles.filter(role => role.name === createdRoleWithSameName);
  expect(filterRoles.length).toEqual(0);
});

Then('I should see the role with the same name created', async function (this: CustomWorld) {
  expect(this.role).not.toBeNull();
});

Then('I should see the role with the same name in the returned list of roles', async function (this: CustomWorld) {
  const queryRoles = await this.client.roles();
  const { name: createdRoleWithSameName} = this.role;
  const filterRoles = queryRoles.filter(role => role.name === createdRoleWithSameName);
  expect(filterRoles.length).toEqual(1);
});

Then('the role should NOT be updated', async function (this: CustomWorld) {
  expect(this.role).toBeNull();
});

Then('I should NOT see the role created', async function (this: CustomWorld) {
  expect(this.role).toBeNull();
});

Then('I should see the updated skills on the role', async function(this: CustomWorld) {
  const actualSkills = this.roleSkillsOverwriteResponse.map(({ skill }) => skill);
  expect(actualSkills).toEqual(this.skills);
});

Then('I should see the role with the updated skills in the returned list of roles', async function (this: CustomWorld) {
  this.queryAllRolesResponse = await this.client.roles();
  const actualSkills = this.queryAllRolesResponse.map(({ skills }) => skills.map(({ skill }) => skill)).flat();
  expect(actualSkills).toEqual(this.skills);
});

Then('the role should not be updated', async function (this: CustomWorld) {
  expect(this.roleSkillsOverwriteResponse).toBeNull();
});
