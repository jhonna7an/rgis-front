import { BaseModel } from '../base-model';
import { District } from '../equipments/district';

export class BranchOffice extends BaseModel {
    public branchOfficeName: string;
    public districtId: number;
    public isCentralOffice: boolean;

    public district: District;
}
