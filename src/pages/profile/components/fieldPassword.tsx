import React, {useState} from "react"

//REDUX
import { AppDispatch, RootState } from "../../../redux/store"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { alterPassword } from "../../../redux/reducers/authReducer";

//YUP
import {useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSchema, FormData } from "../schema/fieldPassword";

//ICONS
import { FaEye, FaEyeSlash } from "react-icons/fa";


//TOAST
import { toast } from "react-toastify";


interface FieldPasswordProps {

    setOpenModal: (openModal: boolean) => void
}


const FieldPassword: React.FC<FieldPasswordProps> = ({setOpenModal}) => {

    const {user} = useSelector( (state: RootState) => state.auth )
    const dispatch = useDispatch<AppDispatch>()
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false)
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false)

    const schema = createSchema()

    const {register,handleSubmit, formState: {errors} } = useForm<FormData>({

        resolver: yupResolver(schema)
    })

    console.log(user)

    const handlePassword = async (data: FormData) => {

        const currentlyEmail = user?.email as string

        const action = await dispatch(alterPassword({currentlyEmail, oldPassword: data.oldPassword, newPassword: data.newPassword}))

        if(action.type === "auth/alterPassword/fulfilled") {

            setOpenModal(false)
            toast.success("Senha alterada com sucesso!")    
        
        }else {
            
            toast.error(action.payload as string)

        }

        
    }


  return (
        

      <form onSubmit={handleSubmit(handlePassword)} className="flex flex-col gap-10 justify-between relative">

        <div className="flex flex-row justify-between relative">
        
        <label htmlFor="oldPassword">Senha Antiga</label>
        <input
          {...register("oldPassword")}
          id="oldPassword"
          type={showOldPassword ? "text" : "password"}
          className="border border-gray-400 rounded-md outline-none p-2"
        />
        <span
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={() => setShowOldPassword(!showOldPassword)}
        >
          {showOldPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
        </span>

        </div>

        {errors.oldPassword && <span className="text-red-500 -mt-8 text-right">{errors.oldPassword.message}</span>}


      <div className="flex flex-row justify-between relative">
        <label htmlFor="newPassword">Senha Nova</label>
        <input
          {...register("newPassword")}
          id="newPassword"
          type={showNewPassword ? "text" : "password"}
          className="border border-gray-400 rounded-md outline-none p-2"
        />
        <span
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={() => setShowNewPassword(!showNewPassword)}
        >
          {showNewPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
        </span>

      </div>

      {errors.newPassword && <span className="text-red-500 -mt-8 text-right">{errors.newPassword.message}</span>}

      <button
        className="border border-blue-700 text-black hover:text-white ease-in-out duration-300 hover:bg-blue-700 py-3 rounded-lg"
      >
        Alterar Senha
      </button>

      </form>

  );
};



export default FieldPassword
