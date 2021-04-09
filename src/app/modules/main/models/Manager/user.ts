import { BaseModel } from '../base-model';
import { BranchOffice } from './branch-office';
import { EmployeePosition } from './employee-position';

export class User extends BaseModel{
    public name: string;
    public lastName: string;
    public badgeId: string;
    public employeePositionId: number;
    public branchOfficeId: number;
    public mail: string;

    public branchOffice: BranchOffice;
    public employeePosition: EmployeePosition;
}
