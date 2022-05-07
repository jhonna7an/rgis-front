import { BaseModel } from "./base-model.model";

export interface District extends BaseModel{
    districtName: string;
    shortName: string;
    location: string;
    countryId: number;
}
