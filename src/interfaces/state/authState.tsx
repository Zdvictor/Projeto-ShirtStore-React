import { IUserProfile } from "../user/userProfile";

export interface AuthState {
    user: IUserProfile | null; //MUDEI ID PARA NUMBER ERA STRING CASO HAJA PROBLEMA AQUI
    loading: boolean;
    loadingValidate: boolean;
    error: string | null;
  }