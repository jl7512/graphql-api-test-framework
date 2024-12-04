import { AfterAll, Before } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { each } from 'bluebird';
import GraphQLClient from '../support/graphql-client';
import { DEBUG } from '../support/config';

// AfterAll and BeforeAll do not have access to the World object instance so we have to init a new client here
// https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md#world-parameters-in-beforeallafterall
const client = new GraphQLClient();

AfterAll(async function () {
  if (DEBUG) {
    console.log(`--- EXECUTING AFTER ALL HOOK DELETING ALL ROLES -----------------------------------------`);
  }

  const allRoles = await client.roles();

  if (allRoles.length > 0) {
    await each(allRoles, async (role) => {
      const { id } = role;
      await client.roleDeleteOne({ id });
    });
  }
});

AfterAll(async function () {
  if (DEBUG) {
    console.log(`--- EXECUTING AFTER ALL HOOK DELETING ALL SKILLS -----------------------------------------`);
  }

  const allSkills = await client.skills();

  if (allSkills.length > 0) {
    await each(allSkills, async (skill) => {
      const { id } = skill;
      await client.skillDeleteOne({ id });
    });
  }
});

Before('@createrole', async function (this: CustomWorld) {
  if (DEBUG) {
    console.log(`--- EXECUTING BEFORE HOOK CREATING A ROLE -----------------------------------------`);
  }

  const roleName = this.generateRandomName('BEFORE-HOOK-ROLE');
  this.role = await this.client.roleCreateOne({ name: roleName });
});

Before('@createskill', async function (this: CustomWorld) {
  if (DEBUG) {
    console.log(`--- EXECUTING BEFORE HOOK CREATING A SKILL -----------------------------------------`);
  }

  const skillName = this.generateRandomName('BEFORE-HOOK-SKILL');
  this.skill = await this.client.skillCreateOne({ name: skillName });
});
