import * as yup from "yup";


export interface FormData {

    oldPassword: string
    newPassword: string

}

export const createSchema = () => {

    return yup.object<FormData>().shape({

        oldPassword: yup
        .string()
        .required("A Senha Antiga é obrigatória")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])/, "A senha deve ter ao menos uma letra maiúscula e uma letra minúscula")
        .matches(/^(?=.*[0-9])/, "A senha deve ter ao menos um número"),

        newPassword: yup
        .string()
        .required("A Senha Nova é obrigatória")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])/, "A senha deve ter ao menos uma letra maiúscula e uma letra minúscula")
        .matches(/^(?=.*[0-9])/, "A senha deve ter ao menos um número"),

    })

}