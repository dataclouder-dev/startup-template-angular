export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

export interface IGenericLLM extends AuditDate {
  id: string;
  name: string;
  description: string;
}
