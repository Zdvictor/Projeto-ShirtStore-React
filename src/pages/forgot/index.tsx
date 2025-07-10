import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { toast } from "react-toastify";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store";
import { forgotPassword } from "../../redux/reducers/authReducer";

// COMPONENTES
import EmailForm from "./components/EmailForm";
import CodeVerificationForm from "./components/CodeVerificationForm";
import ChangePasswordForm from "./components/ChangePasswordForm";

// LOGO
import logo from "../../assets/logos/logo-menus.png";

// LOADING
import Loading from "../../components/loading";

const ForgotPassword: React.FC = () => {

  const [step, setStep] = useState<"email" | "code" | "change">("email");
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);


  const handleEmailSubmit = async (data: { email: string }) => {

    const action = await dispatch(forgotPassword(data))

    if (action.type === "auth/forgotPassword/fulfilled") {

      setEmail(data.email)
      setStep("code")
      toast.success("Código de recuperação enviado com sucesso!");

    } else {
      toast.error(action.payload as string);
    }
  }

  return (
    <>
      <Link to="/">
        <FaLongArrowAltLeft
          className="relative top-5 left-11 cursor-pointer"
          size={40}
        />
      </Link>

      <section className="w-full container mx-auto grid grid-cols-12 h-screen">

        <div className="col-span-12 md:col-span-6 w-full text-center flex flex-col items-center justify-center">

          <h1 className="text-5xl">Recuperar Senha</h1>

          <p className="text-2xl mt-3 text-neutral-500">

            {step === "email" && "Digite seu email para receber o código"}
            {step === "code" && "Digite o código de recuperação"}
            {step === "change" && "Digite a nova senha"}
            
          </p>

          {
            step === "email" && <EmailForm onSubmit={handleEmailSubmit} />
          }

          {
          step === "code" && (

            <CodeVerificationForm
              email={email}
              onSuccess={() => setStep("change")}
              setCode={(code) => setCode(code)}
            />

          )}
          {step === "change" && <ChangePasswordForm email={email} code={code} />}
        </div>

        <div className="hidden md:flex md:col-span-6 items-center justify-center">

          <img className="w-2/3 object-contain" src={logo} alt="Logo" />

        </div>

      </section>

      {loading && <Loading />}
    </>
  );
};

export default ForgotPassword;
