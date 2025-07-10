import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//REDUX
import { useDispatch } from "react-redux";
import { login ,changePassword } from "../../../redux/reducers/authReducer"
import { AppDispatch } from "../../../redux/store";

//YUP
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaChangePassword, FormChange } from "../schema";  

//TOASTIFY
import { toast } from "react-toastify";




const ChangePassword: React.FC<{ email: string, code: string }> = ({ email, code }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormChange>({
    resolver: yupResolver(schemaChangePassword),
  });

  const onSubmit = async (data: FormChange) => {

      const action = await dispatch(changePassword({code, newPassword: data.password}))

      if(action.type === "auth/changePassword/fulfilled") {

        const user = {

          email,
          password: data.password

        }

        const actionLogin = await dispatch(login(user))

        if(actionLogin.type === "auth/login/fulfilled") {

          toast.success("Senha alterada com sucesso");
          navigate("/", {replace: true } )

        }else {

          toast.error(actionLogin.payload as string)

        }


      }else {

        toast.error(action.payload as string)

      }
      
      

  };

  return (
    <form className="flex flex-col w-3/4 mx-auto mt-5" onSubmit={handleSubmit(onSubmit)}>
      <label className="text-left mt-2" htmlFor="email">
        Email
      </label>
      <input
        type="email"
        value={email}
        disabled
        id="email"
        className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none cursor-not-allowed bg-gray-200"
        placeholder="Email que será recuperado"
      />

      <label className="text-left mt-2" htmlFor="password">
        Nova Senha
      </label>
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none"
        placeholder="*******"
        {...register("password")}
      />
      {errors.password && (
        <p className="text-left text-red-600">{errors.password.message}</p>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          onChange={() => setShowPassword(!showPassword)}
          type="checkbox"
          name="Lembrar-me"
          id="showPassword"
          className="w-4 h-4 rounded"
        />
        <label htmlFor="showPassword">Mostrar Senha</label>
      </div>

      <label className="text-left mt-2" htmlFor="confirmPassword">
        Confirmar Nova Senha
      </label>
      <input
        type={confirmShowPassword ? "text" : "password"}
        id="confirmPassword"
        className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none"
        placeholder="*******"
        {...register("confirmPassword")}
      />
      {errors.confirmPassword && (
        <p className="text-left text-red-600">{errors.confirmPassword.message}</p>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          onChange={() => setConfirmShowPassword(!confirmShowPassword)}
          type="checkbox"
          name="Lembrar-me"
          id="showConfirmPassword"
          className="w-4 h-4 rounded"
        />
        <label htmlFor="showConfirmPassword">Mostrar Senha</label>
      </div>

      <button
        type="submit"
        className="bg-red-500 text-lg p-3 rounded-xl text-white mt-5 hover:bg-red-600 ease-in-out duration-300"
      >
        Alterar Senha
      </button>
    </form>
  );
};

export default ChangePassword;
