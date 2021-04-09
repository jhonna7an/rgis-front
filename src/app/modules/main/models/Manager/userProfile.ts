import { BaseModel } from '../base-model';

export interface UserProfile extends BaseModel{
    profile: string;
    isAdmin: boolean;
}