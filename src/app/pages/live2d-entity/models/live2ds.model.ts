import { FileStorageData } from '@dataclouder/ngx-cloud-storage';
import { IAuditable } from '@dataclouder/ngx-core';

export enum Live2dType {
  Gen1 = 'gen1',
  Gen2 = 'gen2',
  Gen3 = 'gen3',
}

export interface ILive2dRelation {
  id: string;
  name: string;
  description: string;
}

export interface ILive2d {
  _id: string;
  id: string;
  name?: string;
  image?: FileStorageData;
  description?: string;
  type?: string;
  relation?: ILive2dRelation;
  auditable?: IAuditable;
}
