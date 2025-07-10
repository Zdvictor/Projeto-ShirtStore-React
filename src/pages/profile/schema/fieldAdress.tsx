import * as yup from "yup";



export interface FormData {
    cep: string,
    number: number,
    neighborhood: string,
    street: string,
    city: string,
    state: string
  }
  
  export const createSchema = () => {
    return yup.object<FormData>().shape({
      cep: yup.string().required("O Cep é obrigatório").min(8, "O cep deve ter no mínimo 8 caracteres"),
      number: yup.number()
      .typeError("O número deve ser um valor numérico")
      .required("O número é obrigatório"),
  
      neighborhood: yup.string().required("O Bairro é obrigatório").min(4, "O bairro deve ter no mínimo 4 caracteres"),
      street: yup.string().required("A Rua é obrigatória").min(4, "A rua deve ter no mínimo 4 caracteres"),
      city: yup.string().required("A Cidade é obrigatória").min(4, "A cidade deve ter no mínimo 4 caracteres"),
      state: yup.string().required("O Estado é obrigatório")
    });
  };
  
