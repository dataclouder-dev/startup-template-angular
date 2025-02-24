import { ChatUserSettings } from '@dataclouder/conversation-system';

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
  Teacher = 'teacher',
  Tester = 'tester',
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
  conversationSettings: ChatUserSettings;
}

export const RolOptions = [
  { name: 'Administrador', value: RolType.Admin },
  { name: 'Profesor', value: RolType.Teacher },
  { name: 'Tester', value: RolType.Tester },
];

export const PlanOptions = [
  { name: 'Básico', value: PlanType.Basic },
  { name: 'Beta', value: PlanType.Beta },
  { name: 'Follower', value: PlanType.Follower },
  { name: 'Premium', value: PlanType.Premium },
];

// TODO: move this to admin
export const ExpireDateOptions = [
  { name: 'No expira', value: null },
  { name: '1 Mes', value: 1 },
  { name: '2 Meses', value: 2 },
  { name: '3 Meses', value: 3 },
  { name: '4 Meses', value: 4 },
  { name: '6 Meses', value: 6 },
  { name: '1 Año', value: 12 },
];
