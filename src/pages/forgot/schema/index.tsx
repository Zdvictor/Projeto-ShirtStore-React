import * as yup from "yup";

export interface FormData {
    email: string;
}
export interface FormCode {
    code: string;
}

export interface FormChange {

    password: string
    confirmPassword: string
}

const schema = yup.object().shape({
    email: yup.string().email("Email inválido").required("O email é obrigatório"),
});
const schemaCode = yup.object().shape({
    code: yup.string().min(35, "Código inválido").required("O código é obrigatório"),
});
const schemaChangePassword = yup.object().shape({
    password: yup
    .string()
    .required("A senha é obrigatória")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])/, "A senha deve ter ao menos uma letra maiúscula e uma letra minúscula")
    .matches(/^(?=.*[0-9])/, "A senha deve ter ao menos um número"),
  confirmPassword: yup
    .string()
    .required("A confirmação de senha é obrigatória")
    .oneOf([yup.ref("password")], "As senhas não são iguais"),
});

export {schema,schemaCode, schemaChangePassword}

