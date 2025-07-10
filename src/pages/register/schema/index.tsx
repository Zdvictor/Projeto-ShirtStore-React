import * as yup from "yup";
import { isValid as isValidCpf } from "cpf-validator";

export interface FormData {
  name: string;
  cpf: string;
  email: string;
  password: string;
  confirmPassword?: string;
  birthAt: string;
}

const schema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório").min(4, "O nome deve ter no mínimo 4 caracteres"),
  cpf: yup
    .string()
    .required("O CPF é obrigatório")
    .test("cpf", "CPF inválido", (value) => isValidCpf(value || "")), // Forçando `value` como string para o validador
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup
    .string()
    .required("A senha é obrigatória")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])/, "A senha deve ter ao menos uma letra maiúscula e uma letra minúscula")
    .matches(/^(?=.*[0-9])/, "A senha deve ter ao menos um número"),
  confirmPassword: yup
    .string()
    .required("A confirmação de senha é obrigatória")
    .oneOf([yup.ref("password")], "As senhas não são iguais"),
  birthAt: yup
    .string()
    .required("A data de nascimento é obrigatória")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento inválida"),
});

export { schema };
