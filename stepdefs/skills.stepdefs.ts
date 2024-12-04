import { Given, When, Then } from '@cucumber/cucumber';
import expect from 'expect';
import { CustomWorld } from '../support/world';

Given('I create a new skill with name {string}', async function (this: CustomWorld, skillName: string) {
  this.skill = await this.client.skillCreateOne({ name: skillName });
  expect(this.skill).not.toBeNull();
});

Given('I create a new skill', async function (this: CustomWorld) {
  const skillName = this.generateRandomName('SKILL');
  this.skill = await this.client.skillCreateOne({ name: skillName });
  expect(this.skill).not.toBeNull();
});

Given('I create a new skill with a random name', async function (this: CustomWorld) {
  const randomisedSkillName = this.generateRandomName('SKILL');
  this.skill = await this.client.skillCreateOne({ name: randomisedSkillName });
  expect(this.skill).not.toBeNull();
});

Given('I update the skill with name {string}', async function (this: CustomWorld, updatedSkillName: string) {
  const { id } = this.skill;
  await this.client.skillUpdateOne({ id, name: updatedSkillName});
});

When('I delete the skill with the random name', async function (this: CustomWorld) {
  const { id } = this.skill;
  const { affected } = await this.client.skillDeleteOne({ id });
  expect(affected).toEqual(1);
});

When('I create a new skill with the same name', async function (this: CustomWorld) {
  const { name } = this.skill;
  const createdSkillWithSameName = await this.client.skillCreateOne({ name });
  expect(createdSkillWithSameName).not.toBeNull();
});

When('I send a Skills query', async function (this: CustomWorld) {
  this.queryAllSkillsResponse = await this.client.skills();
});

When('I query SkillFindOne using id', async function (this: CustomWorld) {
  const { id } = this.skill;
  this.querySkillFindOneResponse = await this.client.skillFindOne({ id });
});

When('I query SkillFindOne using name', async function (this: CustomWorld) {
  const { name } = this.skill;
  this.querySkillFindOneResponse = await this.client.skillFindOne({ name });
});

When('I query SkillFindOne using id of {string} and name of {string}', async function (this: CustomWorld, skill1Name: string, skill2Name: string) {
  const skills = await this.client.skills();
  const { id } = skills.filter(skill => skill.name === skill1Name)[0];
  this.querySkillFindOneResponse = await this.client.skillFindOne({ id, name: skill2Name });
});

When('I update a skill that does not exist', async function (this: CustomWorld) {
  const randomId = this.generateRandomId();
  const randomSkillName = this.generateRandomName('SKILL');
  this.skill = await this.client.skillUpdateOne({ id: randomId, name: randomSkillName});
});

Then('I should NOT see a skill returned', async function (this: CustomWorld) {
  expect(this.querySkillFindOneResponse).toEqual(null);
});

Then('I should NOT see the skill with the random name in the returned list of skills', async function (this: CustomWorld) {
  const querySkills = await this.client.skills();
  const { name: createdSkillWithSameName} = this.skill;
  const filterSkills = querySkills.filter(skill => skill.name === createdSkillWithSameName);
  expect(filterSkills.length).toEqual(0);
});

Then('I should see the skill with the same name created', async function (this: CustomWorld) {
  expect(this.skill).not.toBeNull();
});

Then('I should see the skill with the same name in the returned list of skills', async function (this: CustomWorld) {
  const querySkills = await this.client.skills();
  const { name: createdSkillWithSameName} = this.skill;
  const filterSkills = querySkills.filter(skill => skill.name === createdSkillWithSameName);
  expect(filterSkills.length).toEqual(1);
});

Then('the skill should NOT be updated', async function (this: CustomWorld) {
  expect(this.skill).toBeNull();
});

Then('I should NOT see the skill created', async function (this: CustomWorld) {
  expect(this.skill).toBeNull();
});
