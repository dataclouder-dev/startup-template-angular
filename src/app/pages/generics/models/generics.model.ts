export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

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

export interface IGeneric extends AuditDate {
  id: string;
  name?: string;
  description?: string;
  type?: string;
  relation?: IGenericRelation;
}
