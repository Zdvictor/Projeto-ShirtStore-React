import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { toast } from "react-toastify";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store";
import { validateAccount } from "../../redux/reducers/authReducer";

//VALIDATION FORM
import { yupResolver } from "@hookform/resolvers/yup";

// API
import api from "../../services/api";

// LOGO
import logo from "../../assets/logos/logo-menus.png";

// LOADING
import Loading from "../../components/loading";

//SCHEMA
import { schema, FormValidate } from "./schema";
import { useForm } from "react-hook-form";



const Validate: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loadingValidate } = useSelector((state: RootState) => state.auth)
  const [hasSentCode, setHasSentCode] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValidate>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const handleGenerateCode = async () => {

      if (!user?.hasValidated && !hasSentCode) {
        setHasSentCode(true)

        try {

          console.log("Enviando código...")

          const result = await api.post("/generate_code", { email: user?.email })

          console.log(result);

          toast.success("Código enviado para o seu email com sucesso!")

        } catch (err) {

          console.log(err)
          toast.error("Erro ao enviar o código.")
        }
      }
    };

    handleGenerateCode();

  }, [user, hasSentCode]);
  const handleEmailSubmit = async (data: FormValidate ) => {

    if(user?.email) {

      const action = await dispatch(validateAccount({ email: user.email, code: data.code, user: user }))

      if (action.type === "auth/validateAccount/fulfilled") {

        toast.success("Conta validada com sucesso!");
        navigate("/", { replace: true })

      }else {

        toast.error(action.payload as string)
      }

    }else{

      toast.error("Erro ao validar conta.")

    }

  };

  return (
    <>
      <Link to="/">
        <FaLongArrowAltLeft className="relative top-5 left-11 cursor-pointer" size={40} />
      </Link>

      <section className="w-full container mx-auto grid grid-cols-12 h-screen">
        <div className="col-span-12 md:col-span-6 w-full text-center flex flex-col items-center justify-center">
          <h1 className="text-5xl">Validar Email</h1>
          <p className="text-2xl mt-3 text-neutral-500">Digite o Código que enviamos para o seu email</p>

          <form className="flex flex-col w-3/4 mx-auto mt-5" onSubmit={handleSubmit(handleEmailSubmit)}>
            <label htmlFor="code" className="text-left mt-2">Código</label>
            <input
              id="code"
              type="text"
              placeholder="Digite o código de validação"
              className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none"
              {...register("code")}
            />

            {errors.code && (<p className="text-left text-red-600">{errors.code.message}</p>)}

            <button
              type="submit"
              className="bg-red-500 text-lg p-3 rounded-xl text-white mt-5 hover:bg-red-600 ease-in-out duration-300"
            >
              Verificar Código
            </button>
          </form>
        </div>

        <div className="hidden md:flex md:col-span-6 items-center justify-center">
          <img className="w-2/3 object-contain" src={logo} alt="Logo" />
        </div>
      </section>

      {loadingValidate && <Loading />}
    </>
  );
};

export default Validate;
