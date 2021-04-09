import { User } from './user';
import { UserProfile } from './userProfile';

export interface UserView extends User {
    userProfileId: number;
    photoName: string;

    userProfile: UserProfile;
}