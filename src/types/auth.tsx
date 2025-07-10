export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const LOGOUT = 'LOGOUT';

export interface User {
  id: number;
  name: string;
  cpf: string;
  email: string;
  endereco_id: string;
  registered: string;
  image: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Ações de login
export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: {
    user: User; // Usuário com os dados especificados
  };
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string; // Erro como string
}

// Ações de registro
export interface RegisterRequestAction {
  type: typeof REGISTER_REQUEST;
}

export interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
  payload: {
    user: User; // Usuário com os dados especificados
  };
}

export interface RegisterFailureAction {
  type: typeof REGISTER_FAILURE;
  payload: string; // Erro como string
}

// Ação de logout
export interface LogoutAction {
  type: typeof LOGOUT;
}

// Combinação de todas as ações de autenticação
export type AuthActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction
  | LogoutAction;
