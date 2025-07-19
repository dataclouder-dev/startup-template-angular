import { CloudStorageData } from '@dataclouder/ngx-cloud-storage';
import { IAuditable } from '@dataclouder/ngx-core';

export enum GenericType {
  Gen1 = 'gen1',
  Gen2 = 'gen2',
  Gen3 = 'gen3',
}

export interface IGenericRelation {
  id: string;
  name: string;
  description: string;
}

export interface IGeneric {
  _id: string;
  id: string;
  name?: string;
  image?: CloudStorageData;
  description?: string;
  type?: string;
  relation?: IGenericRelation;
  auditable?: IAuditable;
}
