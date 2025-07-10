import { IUserProfile } from "../user/userProfile"

export interface IUserValidateAccount {
    email: string,
    code: string,
    user: IUserProfile
}