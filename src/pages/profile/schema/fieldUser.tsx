import * as yup from "yup";


export interface FormData {
  name: string;
  birthat: string;
}

export const createSchema = () => {
  return yup.object<FormData>().shape({
    name: yup
      .string()
      .required("O nome é obrigatório")
      .min(4, "O nome deve ter no mínimo 4 caracteres"),

    birthat: yup
      .string()
      .required("A data de nascimento é obrigatória")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento inválida")
  });
};
