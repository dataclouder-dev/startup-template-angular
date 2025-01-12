import { ConversationUserSettings } from '@dataclouder/conversation-system';

export enum PlanType {
  Basic = 'basic',
  Follower = 'follower',
  Premium = 'premium',
  Beta = 'beta',
}

export const PlanLevel = {
  [PlanType.Basic]: { level: 1 },
  [PlanType.Follower]: { level: 2 },
  [PlanType.Beta]: { level: 3 },
  [PlanType.Premium]: { level: 4 },
};

export enum PermissionType {
  Vocabulary = 'vocabulary',
  LearningExampleRequest = 'leRequest',
  Conversation = 'conversation',
}

export enum RolType {
  Admin = 'admin',
}

export type PermissionClaim = Record<PermissionType, { exp: Date; num: number }>;

export type SubscriptionClaim = { type: PlanType; exp?: Date };

export type RolClaim = Record<RolType, any>;

export interface AppAuthClaims {
  plan: SubscriptionClaim;
  permissions: PermissionClaim;
  roles?: RolClaim;
}

export interface IPersonalData {
  firstname: string;
  lastname: string;
  nickname: string;
  username: string;
  gender: string;
  birthday: Date;
}

export interface IUser {
  id: string;
  urlPicture: string;
  email: string;
  personalData: Partial<IPersonalData>;
  claims: AppAuthClaims;
  authStrategy: string;
  conversationSettings: ConversationUserSettings;
}
