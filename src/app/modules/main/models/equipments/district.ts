import { BaseModel } from '../base-model';
import { Country } from './country';

export class District extends BaseModel{
    public districtName: string;
    public shortName: string;
    public location: string;
    public countryId: number;

    public country: Country;
}
