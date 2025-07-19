import { IAuditable } from '@dataclouder/ngx-core';

export enum DeckCommanderType {
  Gen1 = 'gen1',
  Gen2 = 'gen2',
  Gen3 = 'gen3',
}

export interface IDeckCommanderRelation {
  id: string;
  name: string;
  description: string;
}

export enum CommandType {
  Button = 'button',
}

export interface IDeckCommander {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  img?: string;
  type?: CommandType;
  command?: string;
  action?: string;
  emoji?: string;
  auditable?: IAuditable;
}
