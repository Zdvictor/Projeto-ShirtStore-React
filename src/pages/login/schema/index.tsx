//YUP
import * as yup from "yup"

export interface FormData {

    email: string,
    password: string


}

const schema = yup.object().shape({

    email: yup.string().email("Email inválido").required("O email é obrigatório"),
    password: yup.string().required("A senha é obrigatória").min(4, "A senha deve ter no mínimo 4 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])/, "A senha deve ter ao menos uma letra máiuscula e uma letra mínuscula")
    .matches(/^(?=.*[0-9])/, "A senha deve ter ao menos um número"),


})


export {schema}
