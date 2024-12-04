import fetch from 'cross-fetch';
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject, DocumentNode, gql, OperationVariables } from '@apollo/client';
import { URL, DEBUG } from './config';
import { Role, Skill, DeleteResult, RoleSkill, Asd } from './types';

export default class GraphQLClient {
  private readonly client: ApolloClient<NormalizedCacheObject>;

  constructor() {
    this.client = new ApolloClient({
      link: new HttpLink({
        uri: URL,
        fetch,
      }),
      cache: new InMemoryCache({
        addTypename: false,
        resultCaching: false,
      }),
    });
  }

  private async sendRequest(requestType: 'query' | 'mutation', request: DocumentNode, variables?: OperationVariables) {
    try {
      const response = requestType === 'query' ?
        await this.client.query({ query: request, errorPolicy: 'all', variables }) :
        await this.client.mutate({ mutation: request, errorPolicy: 'all', variables });

      if (response?.data) {
        return response.data;
      }
    } catch (error) {
      throw new Error(JSON.stringify(error, null, 2));
    }
  }

  private async query(query: DocumentNode, variables?: OperationVariables) {
    return this.sendRequest('query', query, variables);
  }

  private async mutation(mutation: DocumentNode, variables?: OperationVariables) {
    return this.sendRequest('mutation', mutation, variables);
  }

  private showDebugLogs (requestName: string, request: string, response: any) {
    console.log(`--- ${requestName} -----------------------------------------`);
    console.log(request);
    console.log(`--- ${requestName} response ----------------------------------`);
    console.log(response);
    console.log('--------------------------------------------------------------\n');
  }
  
  async roles (): Promise<Role[]> {
    const rolesQuery = `
      query GetRoles {
        Roles {
          createdAt
          deletedAt
          id
          name
          skills {
            createdAt
            deletedAt
            id
            roleId
            skill {
              createdAt
              deletedAt
              id
              name
              updatedAt
            }
            skillId
            updatedAt
            weight
          }
          updatedAt
        }
      }
    `;

    const roles = gql(rolesQuery);
    const rolesResponse = await this.query(roles);

    if (DEBUG) {
      this.showDebugLogs('Roles query', rolesQuery, rolesResponse);
    }

    return rolesResponse?.Roles;
  }
  
  async roleFindOne ({ id, name } : {
    id?: number;
    name?: string;
  }): Promise<Role> {
    const idArg = id ? `id: ${id}` : '';
    const showComma = id && name ? ', ' : '';
    let nameArg = name ? `name: ${JSON.stringify(name)}` : '';

    // Workaround so that we can pass in empty strings to graphql queries and mutations
    if (name === "") {
      nameArg = 'name: ""';
    }

    const roleFindOneQuery = `
      query GetOneRole {
        RoleFindOne(${idArg}${showComma}${nameArg}) {
          createdAt
          deletedAt
          id
          name
          skills {
            createdAt
            deletedAt
            id
            roleId
            skill {
                createdAt
                deletedAt
                id
                name
                updatedAt
            }
            skillId
            updatedAt
            weight
          }
          updatedAt
        }
      }
    `;
    
    const roleFindOne = gql(roleFindOneQuery);
    const roleFindOneResponse = await this.query(roleFindOne);
    
    if (DEBUG) {
      this.showDebugLogs('RoleFindOne query', roleFindOneQuery, roleFindOneResponse);
    }
    
    return roleFindOneResponse?.RoleFindOne;
  }
  
  async skills (): Promise<Skill[]> {
    const skillsQuery = `
      query GetSkills {
        Skills {
          createdAt
          deletedAt
          id
          name
          updatedAt
        }
      }
    `;

    const skills = gql(skillsQuery);  
    const skillsResponse = await this.query(skills);

    if (DEBUG) {
      this.showDebugLogs('Skills query', skillsQuery, skillsResponse);
    }

    return skillsResponse?.Skills;
  }
  
  async skillFindOne ({ id, name } : {
    id?: number;
    name?: string;
  }): Promise<Skill> {
    const idArg = id ? `id: ${id}` : '';
    const showComma = id && name ? ', ' : '';
    let nameArg = name ? `name: ${JSON.stringify(name)}` : '';

    // Workaround so that we can pass in empty strings to graphql queries and mutations
    if (name === "") {
      nameArg = 'name: ""';
    }
    
    const skillFindOneQuery = `
      query GetOneSkill {
        SkillFindOne(${idArg}${showComma}${nameArg}) {
          createdAt
          deletedAt
          id
          name
          updatedAt
        }
      }
    `;

    const skillFindOne = gql(skillFindOneQuery);
    const skillFindOneResponse = await this.query(skillFindOne);
    
    if (DEBUG) {
      this.showDebugLogs('SkillFindOne query', skillFindOneQuery, skillFindOneResponse);
    }

    return skillFindOneResponse?.SkillFindOne;
  }

  async roleCreateOne({ name } : {
    name?: string;
  }): Promise<Role> {
    let nameArg = name ? `name: ${JSON.stringify(name)}` : '';
    
    if (name === "") {
      nameArg = 'name: ""';
    }

    const roleCreateOneMutation = `
      mutation CreateOneRole {
        RoleCreateOne(${nameArg}) {
          createdAt
          deletedAt
          id
          name
          skills {
            createdAt
            deletedAt
            id
            roleId
            skill {
                createdAt
                deletedAt
                id
                name
                updatedAt
            }
            skillId
            updatedAt
            weight
          }
          updatedAt
        }
      }
    `;

    const roleCreateOne = gql(roleCreateOneMutation);
    const roleCreateOneMutationResponse = await this.mutation(roleCreateOne);
    
    if (DEBUG) {
      this.showDebugLogs('RoleCreateOne mutation', roleCreateOneMutation, roleCreateOneMutationResponse);
    }

    return roleCreateOneMutationResponse?.RoleCreateOne;
  }

  async roleDeleteOne({ id } : {
    id?: number;
  }): Promise<DeleteResult> {
    const idArg = id ? `id: ${id}` : '';

    const roleDeleteOneMutation = `
      mutation DeleteOneRole {
        RoleDeleteOne(${idArg}) {
          affected
        }
      }
    `;

    const roleDeleteOne = gql(roleDeleteOneMutation);
    const roleDeleteOneMutationResponse = await this.mutation(roleDeleteOne);

    if (DEBUG) {
      this.showDebugLogs('RoleDeleteOne mutation', roleDeleteOneMutation, roleDeleteOneMutationResponse);
    }
    
    return roleDeleteOneMutationResponse?.RoleDeleteOne;
  }

  async roleSkillsOverwrite({ roleId, skills } : {
    roleId?: number,
    skills?: Asd[] ;
  }): Promise<RoleSkill[]> {
    const roleIdArg = roleId ? `roleId: ${roleId}` : '';
    const skillsArg = skills ? `skills: ${JSON.stringify(skills)}`.replaceAll('"', '') : '';
    const showComma = roleId && skills ? ', ' : '';
    
    const roleSkillsOverwriteMutation = `
      mutation UpdateRoleSkills {
        RoleSkillsOverwrite(${roleIdArg}${showComma}${skillsArg}) {
          createdAt
          deletedAt
          id
          roleId
          skill {        
            createdAt
            deletedAt
            id
            name
            updatedAt
          }
          skillId
          updatedAt
          weight
        }
      }
    `;

    const roleSkillsOverwrite = gql(roleSkillsOverwriteMutation);
    const roleSkillsOverwriteResponse = await this.mutation(roleSkillsOverwrite);
    
    if (DEBUG) {
      this.showDebugLogs('RoleSkillsOverwrite mutation', roleSkillsOverwriteMutation, roleSkillsOverwriteResponse);
    }
    
    return roleSkillsOverwriteResponse?.RoleSkillsOverwrite;
  }

  async roleUpdateOne({ id, name } : {
    id?: number;
    name?: string;
  }): Promise<Role> {
    const idArg = id ? `id: ${id}` : '';
    const showComma = id && name ? ', ' : '';
    let nameArg = name ? `name: ${JSON.stringify(name)}` : '';

    // Workaround so that we can pass in empty strings to graphql queries and mutations
    if (name === "") {
      nameArg = 'name: ""';
    }

    const roleUpdateOneMutation = `
      mutation UpdateOneRole {
        RoleUpdateOne(${idArg}${showComma}${nameArg}) {
          createdAt
          deletedAt
          id
          name
          skills {
            createdAt
            deletedAt
            id
            roleId
            skill {
                createdAt
                deletedAt
                id
                name
                updatedAt
            }
            skillId
            updatedAt
            weight
          }
          updatedAt
        }
      }
    `;

    const roleUpdateOne = gql(roleUpdateOneMutation);
    const roleUpdateOneResponse = await this.mutation(roleUpdateOne);

    if (DEBUG) {
      this.showDebugLogs('RoleUpdateOne mutation', roleUpdateOneMutation, roleUpdateOneResponse);
    }

    return roleUpdateOneResponse?.RoleUpdateOne;
  }

  async skillCreateOne({ name } : {
    name?: string;
  }): Promise<Skill> {
    let nameArg = name ? `name: ${JSON.stringify(name)}` : '';

    // Workaround so that we can pass in empty strings to graphql queries and mutations
    if (name === "") {
      nameArg = 'name: ""';
    }

    const skillCreateOneMutation = `
      mutation CreateOneSkill {
        SkillCreateOne(${nameArg}) {
          createdAt
          deletedAt
          id
          name
          updatedAt
        }
      }
    `;

    const skillCreateOne = gql(skillCreateOneMutation);
    const skillCreateOneResponse = await this.mutation(skillCreateOne);

    if (DEBUG) {
      this.showDebugLogs('SkillCreateOne mutation', skillCreateOneMutation, skillCreateOneResponse);
    }
    
    return skillCreateOneResponse?.SkillCreateOne;
  }

  async skillDeleteOne({ id } : {
    id?: number;
  }): Promise<DeleteResult> {
    const idArg = id ? `id: ${id}` : '';
    
    const skillDeleteOneMutation = `
      mutation DeleteOneSkill {
        SkillDeleteOne(${idArg}) {
          affected
        }
      }
    `;

    const skillDeleteOne = gql(skillDeleteOneMutation);
    const skillDeleteOneResponse = await this.mutation(skillDeleteOne);

    if (DEBUG) {
      this.showDebugLogs('SkillDeleteOne mutation', skillDeleteOneMutation, skillDeleteOneResponse);
    }
    
    return skillDeleteOneResponse?.SkillDeleteOne;
  }

  async skillUpdateOne({ id, name } : {
    id?: number;
    name?: string;
  }): Promise<Skill> {
    const idArg = id ? `id: ${id}` : '';
    const showComma = id && name ? ', ' : '';
    let nameArg = name ? `name: ${JSON.stringify(name)}` : '';

    // Workaround so that we can pass in empty strings to graphql queries and mutations
    if (name === "") {
      nameArg = 'name: ""';
    }
    
    const skillUpdateOneMutation = `
      mutation UpdateOneSkill {
        SkillUpdateOne(${idArg}${showComma}${nameArg}) {
          createdAt
          deletedAt
          id
          name
          updatedAt
        }
      }
    `;

    const skillUpdateOne = gql(skillUpdateOneMutation);
    const skillUpdateOneResponse = await this.mutation(skillUpdateOne);

    if (DEBUG) {
      this.showDebugLogs('SkillUpdateOne mutation', skillUpdateOneMutation, skillUpdateOneResponse);
    }
    
    return skillUpdateOneResponse?.SkillUpdateOne;
  }
};
