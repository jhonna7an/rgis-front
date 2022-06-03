import { BaseModel } from '../base-model.model';

export interface Country extends BaseModel{
  name: string;
  shortName: string;
  code: number;
}
