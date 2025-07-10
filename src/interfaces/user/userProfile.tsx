export interface IUserProfile {

    id: number;
    name: string;
    email: string;
    cpf: string;
    birthAt: string;
    registered: string;
    admin: number;
    endereco_id: string | null;
    image: string | null;
    hasValidated: boolean;
    isGoogle: boolean;
    number: number;
    neighborhood: string;
    street: string;
    city:string;
    state:string;
    cep: string;
    
}