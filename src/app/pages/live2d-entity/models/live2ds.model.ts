import { FileStorageData, CloudStorage } from '@dataclouder/ngx-cloud-storage';
import { IAuditable } from '@dataclouder/ngx-core';

export interface ILive2d {
  _id: string;
  id: string;
  name?: string;
  image?: FileStorageData;
  description?: string;
  files: (FileStorageData & CloudStorage)[];
}
