import * as yup from "yup"

export interface FormValidate {

    code: string


}

const schema = yup.object().shape({

    
    code: yup.string().min(35, "Código inválido").required("O código é obrigatório"),


})


export {schema}
