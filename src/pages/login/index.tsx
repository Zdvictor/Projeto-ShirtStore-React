import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

//VALIDATION-FORM
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//REDUX
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/reducers/authReducer";	
import { AppDispatch, RootState } from "../../redux/store";

//LOGO
import logo from "../../assets/logos/logo-menus.png";
import google from "../../assets/logos/google.png";


//SCHEMA YUP
import { schema, FormData } from "./schema";

//LOADING
import Loading from "../../components/loading";

//TOASTIFY
import { toast } from "react-toastify";

import { handleGoogleLogin } from "../../utils/authGoogle";

import { ArrowBack } from "../../components/back";

const Login: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const { loading } = useSelector((state: RootState) => state.auth)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        buttonRef.current?.click(); 
      }
    }

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    const action = await dispatch(login(data));

    if (action.type === "auth/login/fulfilled") {
      toast.success("Logado com sucesso")
      navigate("/")
    } else {
      toast.error(action.payload as string)
    }
  }



  return (
    <>
      
      <ArrowBack />

      <section className="w-full container mx-auto grid grid-cols-12 mt-36">
        <div className="col-span-12 md:col-span-6 w-full text-center flex flex-col items-center justify-center">
          <h1 className="text-5xl">BEM-VINDO DE VOLTA</h1>
          <p className="text-2xl mt-3 text-neutral-500">
            Bem-vindo de volta! Por favor, insira seus dados.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-3/4 mx-auto mt-5"
          >
            <label className="text-left mt-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none"
              placeholder="Insira seu email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-left text-red-600">{errors.email.message}</p>
            )}

            <label className="text-left mt-2" htmlFor="senha">
              Senha
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="senha"
              className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none"
              placeholder="*******"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-left text-red-600">
                {errors.password.message}
              </p>
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

            <div className="flex items-center mt-8 justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  name="Lembrar-me"
                  id="remember"
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="remember">Lembrar-me</label>
              </div>

              <Link to="/forgot-password">
                <button>Esqueceu a senha?</button>
              </Link>
            </div>

            <button
              ref={buttonRef}
              type="submit"
              className="bg-red-500 text-lg p-3 rounded-xl text-white mt-5 hover:bg-red-600 ease-in-out duration-300"
            >
              Entrar
            </button>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="text-lg font-bold flex items-center justify-center w-full bg-white border border-gray-300 rounded-xl py-3 px-4 mt-5 hover:bg-gray-100 ease-in-out duration-300"
            >
              <img
                className="w-6 h-6 mr-2"
                src={google}
                alt="Logo do Google"
              />
              Entrar com o Google
            </button>

            <Link to="/register">
              <button className="mt-5">
                Não tem uma conta?{" "}
                <span className="text-red-600">Cadastre-se gratuitamente!</span>
              </button>
            </Link>
          </form>
        </div>

        <div className="hidden md:flex md:col-span-6 items-center justify-center">
          <img className="w-2/3 object-contain" src={logo} alt="Logo" />
        </div>
      </section>
      {loading && <Loading />}
    </>
  )
}

export default Login;
