import { BaseModel } from './base-model.model';

export interface BranchOffice extends BaseModel {
  branchOfficeName: string;
  districtId: number;
  isCentralOffice: boolean;
}
