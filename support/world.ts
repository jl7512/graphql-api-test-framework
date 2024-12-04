import { setWorldConstructor, IWorld, setDefaultTimeout  } from '@cucumber/cucumber';
import { ICreateAttachment, ICreateLog } from '@cucumber/cucumber/lib/runtime/attachment_manager';
import GraphQLClient from './graphql-client';
import { Role, RoleSkill, Skill } from './types';
import { generateRandomId, generateRandomName } from './data';

export class CustomWorld implements IWorld {
  [key: string]: any;
  attach: ICreateAttachment;
  log: ICreateLog;
  parameters: any;
  role: Role;
  skill: Skill;
  skills: Skill[] = [];
  queryAllRolesResponse: Role[];
  queryRoleFindOneResponse: Role;
  queryAllSkillsResponse: Skill[];
  querySkillFindOneResponse: Skill;
  roleSkillsOverwriteResponse: RoleSkill[];
  client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient();
  }

  generateRandomId(): number {
    return generateRandomId();
  }

  generateRandomName(text: string): string {
    return generateRandomName(text);
  }

}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60 * 1000);
