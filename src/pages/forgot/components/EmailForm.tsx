import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema, FormData } from "../schema";

interface EmailFormProps {
  onSubmit: (data: FormData) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-3/4 mx-auto mt-5">
      <label htmlFor="email" className="text-left mt-2">
        Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="Digite seu email"
        className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none"
        {...register("email")}
      />
      {errors.email && <p className="text-left text-red-600">{errors.email.message}</p>}

      <button
        type="submit"
        className="bg-red-500 text-lg p-3 rounded-xl text-white mt-5 hover:bg-red-600 ease-in-out duration-300"
      >
        Enviar Código de Recuperação
      </button>
    </form>
  );
};

export default EmailForm;
