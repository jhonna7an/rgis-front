import { BaseModel } from '../base-model';

export class Country extends BaseModel{
    public country: string;
    public shortName: string;
    public code: number;
}
