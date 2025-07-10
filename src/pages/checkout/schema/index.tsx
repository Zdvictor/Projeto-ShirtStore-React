import * as yup from "yup";
import { isValid as isValidCpf } from "cpf-validator";

export interface FormData {
    name: string,
    email: string,
    cpf: string,
    cellphone: string
}

const schema = yup.object().shape({

    name: yup.string().required("O nome é obrigatório").min(4, "O nome deve ter no mínimo 4 caracteres"),
    email: yup.string().email("Email inválido").required("O email é obrigatorio"),
    cpf: yup
        .string()
        .required("O CPF é obrigatório")
        .test("cpf", "CPF inválido", (value) => isValidCpf(value || "")),
    cellphone: yup.string().required("O celular é obrigatorio").matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Celular inválido"),

});

export {schema}
