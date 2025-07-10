import React, { useState } from "react";

//REDUX
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { updateProfile } from "../../../redux/reducers/authReducer";

//YUP
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSchema, FormData } from "../schema/fieldUser";

//DATA
import { FormatData } from "../../../utils/formatData";

//TOAST
import { toast } from "react-toastify";

//ICONS
import { HiOutlineLockClosed } from "react-icons/hi";
import { FaCamera } from "react-icons/fa";

//PHOTO
import userPhoto from "../../../assets/foto_user.png";

const urlUser = import.meta.env.VITE_URL_USERS

interface FieldUserProps {
  openAdress: boolean;
  setOpenAdress: (openAdress: boolean) => void;
}

const FieldUser: React.FC<FieldUserProps> = ({ openAdress, setOpenAdress }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [photo, setPhoto] = useState(user?.image ? urlUser + user.image : userPhoto);
  const [filePhoto, setFilePhoto] = useState<File | null>(null);

  const schema = createSchema();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name,
      birthat: FormatData(user?.birthAt as string),
    },
  });

  const handleChangeProfile: SubmitHandler<FormData> = async (data) => {
    const id = Number(user?.id);
    const currentlyEmail = user?.email as string;
    const loaderToast = toast.loading('Atualizando perfil...');

    try {
      const action = await dispatch(updateProfile({ id, currentlyEmail, name: data.name, birthat: data.birthat, image: filePhoto }));

      if (action.type === 'auth/updateProfile/fulfilled') {
        toast.update(loaderToast, {
          render: 'Perfil atualizado com sucesso!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(loaderToast, {
          render: action.payload as string,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.log(err);
      toast.update(loaderToast, {
        render: 'Erro ao atualizar o perfil.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida!');
      return;
    }

    setFilePhoto(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
  };

  return (
    <form onSubmit={handleSubmit(handleChangeProfile)}>
      <div className="flex justify-between items-center border-b border-gray-300 py-5">
        <h1 className="font-bold">Perfil Pessoal</h1>
        <button type="submit" className="bg-blue-500 text-white px-5 py-1 ease-out duration-300">
          Salvar Alterações
        </button>
      </div>

      <div className="w-full bg-gray-200 mt-5 sm:w-96 p-1 flex justify-between gap-8 rounded-lg">
        <button
          type="button"
          onClick={() => setOpenAdress(false)}
          className={!openAdress ? "py-1 px-5 rounded-lg bg-white" : "py-1 px-5 "}
        >
          Informações Principais
        </button>
        <button
          type="button"
          onClick={() => setOpenAdress(true)}
          className={openAdress ? "py-1 px-5 rounded-lg bg-white" : "py-1 px-5 "}
        >
          Endereço
        </button>
      </div>

      <div className="mt-5">
        <div className="flex flex-col items-center w-40">
          <img
            className="w-32 h-32 rounded-full overflow-hidden"
            src={photo}
            alt="Imagem de Perfil"
          />
          <button type="button" className="bg-gray-300 py-2 px-16 flex justify-center items-center rounded-sm mt-1 ">
            <input
              onChange={handleImage}
              className="opacity-0 absolute cursor-pointer"
              type="file"
            />
            <FaCamera color="#fff" size={25} />
          </button>
        </div>

        <div className="w-full flex flex-col mt-4 gap-1 sm:w-7/12">
          <label htmlFor="name">Nome</label>
          <input
            {...register("name")}
            id="name"
            type="text"
            className="border border-gray-400 rounded-md outline-none p-2 mb-4"
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}

          <label className="text-left mt-2" htmlFor="dataNascimento">
            Data de Nascimento
          </label>
          <input
            {...register("birthat")}
            id="dataNascimento"
            type="date"
            className="border border-gray-400 rounded-md outline-none p-2 mb-4"
          />
          {errors.birthat && (
            <span className="text-red-500">{errors.birthat.message}</span>
          )}

          <div className="bg-sky-100 flex flex-row gap-3 items-center rounded-md">
            <div className="bg-gray-200 w-11 p-2 rounded-md">
              <HiOutlineLockClosed size={25} color="#4c5b62" />
            </div>
            <p className="text-sm">
              Mantemos seus dados privados e nunca os compartilhamos com
              terceiros.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FieldUser;

