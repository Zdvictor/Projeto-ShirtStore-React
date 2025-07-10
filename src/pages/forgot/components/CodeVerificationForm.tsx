import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaCode, FormCode } from "../schema";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { verifyCode } from "../../../redux/reducers/authReducer";
import { toast } from "react-toastify";

interface CodeVerificationFormProps {
  email: string;
  onSuccess: () => void;
  setCode: (code: string) => void;
}

const CodeVerificationForm: React.FC<CodeVerificationFormProps> = ({ onSuccess, email, setCode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormCode>({
    resolver: yupResolver(schemaCode),
  });

  const onSubmit = async (data: FormCode) => {

    const action = await dispatch(verifyCode({ email, code: data.code }));
    if (action.type === "auth/verifyCode/fulfilled") {
      toast.success("Código correto! Continue para alterar a senha.");
      setCode(data.code)
      onSuccess();
    } else {
      toast.error(action.payload as string);
    }
  };

  return (
    <form className="flex flex-col w-3/4 mx-auto mt-5" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="code" className="text-left mt-2">
        Código
      </label>
      <input
        id="code"
        type="text"
        placeholder="Digite o código de recuperação"
        className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none"
        {...register("code")}
      />
      {errors.code && <p className="text-left text-red-600">{errors.code.message}</p>}

      <button
        type="submit"
        className="bg-red-500 text-lg p-3 rounded-xl text-white mt-5 hover:bg-red-600 ease-in-out duration-300"
      >
        Verificar Código
      </button>
    </form>
  );
};

export default CodeVerificationForm;
