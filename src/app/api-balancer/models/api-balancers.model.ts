import { CloudStorageData } from '@dataclouder/ngx-cloud-storage';
import { IAuditable } from '@dataclouder/ngx-core';

export enum ApiBalancerType {
  Gen1 = 'gen1',
  Gen2 = 'gen2',
  Gen3 = 'gen3',
}

export interface IApiBalancerRelation {
  id: string;
  name: string;
  description: string;
}

export interface RateLimits {
  RPM: number;
  RPD: number;
  TPM: number;
}

export const ProviderLimits = {
  // N/A OpenAI, Claude, GROK
  GROQ: {
    RPM: 10,
    RPD: 10,
    TPM: 10,
  },
};

export interface IApiBalancer {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  provider?: string;
  key?: string;
  model?: string;
  rateLimits?: RateLimits;
  auditable?: IAuditable;
}
