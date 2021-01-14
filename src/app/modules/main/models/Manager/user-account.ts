import { User } from '../Manager/user';

export class UserAccount extends User{
    public resetPasswordCode: string;
    public isMailVerified: boolean;
    public activationCode: string;
    public password: string;
}
