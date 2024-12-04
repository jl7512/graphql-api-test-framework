export type RoleSkill = {
  createdAt: string;
  deletedAt: string;
  id: number;
  roleId: number;
  skill: Skill;
  skillId: number;
  updatedAt: string;
  weight: number;
};

export type Skill = {
  createdAt: string;
  deletedAt: string;
  id: number;
  name: string;
  updatedAt: string;
};

export type Role = {
  createdAt: string;
  deletedAt: string;
  id: number;
  name: string;
  skills: RoleSkill[];
  updatedAt: string;
};

export type DeleteResult = {
  affected: number;
};

export type Asd = {
  skillId: number;
  weight: number;
};
