import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

// VALIDATION-FORM
import { yupResolver } from "@hookform/resolvers/yup";

// INPUT MASK CPF
import InputMask from "react-input-mask";

// SCHEMA
import { schema, FormData } from "./schema";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../../redux/reducers/authReducer"; 
import { AppDispatch, RootState } from "../../redux/store";


// LOGO
import logo from "../../assets/logos/logo-menus.png";
import google from "../../assets/logos/google.png";

// LOADING
import Loading from "../../components/loading";

// TOASTIFY
import { toast } from "react-toastify";

import { handleGoogleLogin } from "../../utils/authGoogle";

import { ArrowBack } from "../../components/back";

const Register: React.FC = () => {
    
    const [registeredByGoogle, setRegisteredByGoogle] = useState<string>("");


    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading } = useSelector((state: RootState) => state.auth);

    const [searchParams] = useSearchParams();
    const nameFromQuery = searchParams.get("name");
    const emailFromQuery = searchParams.get("email");

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: yupResolver<FormData>(schema),
    });


    useEffect(() => {
        if (emailFromQuery && nameFromQuery) {
          setValue("name", nameFromQuery);
          setValue("email", emailFromQuery);
          setValue("password", "registerByGoogle123.");
          setValue("confirmPassword", "registerByGoogle123.");
          setRegisteredByGoogle(emailFromQuery);
        }
      }, [setValue, emailFromQuery, nameFromQuery]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                event.preventDefault();
                buttonRef.current?.click();
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    const onSubmit = async (data: FormData) => {
        delete data.confirmPassword;

        const action = await dispatch(registerUser(data));

        if (action.type === "auth/register/fulfilled") {
       
            if(registeredByGoogle) {

                toast.success("Registrado com sucesso")
                return navigate("/")

            }else {

                return navigate("/validate")
            }
            

        } else {

            toast.error(action.payload as string);

        }
    };


    return (
        <>
            <ArrowBack />

            <section className={registeredByGoogle ? "w-full container mx-auto grid grid-cols-12 mt-32" : "w-full container mx-auto grid grid-cols-12 mt-9"}>
                <div className="col-span-12 md:col-span-6 w-full text-center flex flex-col items-center justify-center">
                    <h1 className="text-5xl">BEM VINDO</h1>
                    <p className="text-2xl mt-3 text-neutral-500">Bem-vindo! {registeredByGoogle ? "Vamos terminar de completar seu cadastro."  : "Vamos começar seu registro."}</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-3/4 mx-auto mt-5">
                        <label className="text-left mt-2" htmlFor="nome">Nome</label>
                        <input type="text" id="nome" className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none" placeholder="Insira seu nome" {...register("name")} />
                        {errors.name && <p className="text-left text-red-600">{errors.name.message}</p>}

                        <label className="text-left mt-2" htmlFor="cpf">CPF</label>
                        <InputMask mask="999.999.999-99" type="text" id="cpf" className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none" placeholder="Insira seu CPF" {...register("cpf")} />
                        {errors.cpf && <p className="text-left text-red-600">{errors.cpf.message}</p>}

                        <label className="text-left mt-2" htmlFor="email">Email</label>
                        <input disabled={registeredByGoogle ? true : false} type="email" id="email" className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none disabled:bg-gray-200 disabled:cursor-not-allowed" placeholder="Insira seu email" {...register("email")} />
                        {errors.email && <p className="text-left text-red-600">{errors.email.message}</p>}
                        
                        {!registeredByGoogle && (
                            <>

                            <label className="text-left mt-2" htmlFor="senha">Senha</label>
                            <input type={showPassword ? "text" : "password"} id="senha" className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none" placeholder="*******" {...register("password")} />
                            {errors.password && <p className="text-left text-red-600">{errors.password.message}</p>}

                            <div className="flex items-center gap-4 mt-3">
                                <input onChange={() => setShowPassword(!showPassword)} type="checkbox" name="Lembrar-me" id="showPassword" className="w-4 h-4 rounded" />
                                <label htmlFor="showPassword">Mostrar Senha</label>
                            </div>

                            <label className="text-left mt-2" htmlFor="confirmarSenha">Confirmar Senha</label>
                            <input type={confirmShowPassword ? "text" : "password"} id="confirmarSenha" className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none" placeholder="*******" {...register("confirmPassword")} />
                            {errors.confirmPassword && <p className="text-left text-red-600">{errors.confirmPassword.message}</p>}

                            <div className="flex items-center gap-4 mt-3">
                                <input onChange={() => setConfirmShowPassword(!confirmShowPassword)} type="checkbox" name="Lembrar-me" id="showConfirmPassword" className="w-4 h-4 rounded" />
                                <label htmlFor="showConfirmPassword">Mostrar Senha</label>
                            </div>

                            </>
                            
                        )}


                        <label className="text-left mt-2" htmlFor="dataNascimento">Data de Nascimento</label>
                        <input type="date" id="dataNascimento" className="border border-gray-400 py-3 px-4 rounded-lg mt-2 outline-none" {...register("birthAt")} />
                        {errors.birthAt && <p className="text-left text-red-600">{errors.birthAt.message}</p>}

                        <button ref={buttonRef} type="submit" className="bg-red-500 text-lg p-3 rounded-xl text-white mt-5 hover:bg-red-600 ease-in-out duration-300">
                            Registrar
                        </button>
                        
                        {!registeredByGoogle && (

                            <button onClick={handleGoogleLogin} type="button" className="text-lg font-bold flex items-center justify-center w-full bg-white border border-gray-300 rounded-xl py-3 px-4 mt-5 hover:bg-gray-100 ease-in-out duration-300">
                            <img className="w-6 h-6 mr-2" src={google} alt="Logo do Google" />
                            Registrar com o Google
                            </button>


                        )}

                        
                        <Link to="/login">
                            <button className="mt-5">Já tem uma conta?  <span className="text-red-600">Faça login!</span> </button>
                        </Link>
                    </form>
                </div>

                <div className="hidden md:flex md:col-span-6 items-center justify-center"> 
                    <img className="w-2/3 object-contain" src={logo} alt="Logo" />
                </div>
            </section>

            {loading && <Loading />}
        </>
    );
};

export default Register;
