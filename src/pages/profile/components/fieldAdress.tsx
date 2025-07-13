import React, {useState } from "react";

//MASK
import InputMask from "react-input-mask";

///ICONS
import { HiOutlineLockClosed } from "react-icons/hi";

//ESTADOS
import { states } from "../states";

//YUP
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { createSchema, FormData } from "../schema/fieldAdress";

//REDUX
import { useDispatch, useSelector } from "react-redux";
import {editAdress, registerAdress} from "../../../redux/reducers/adressReducer"
import { AppDispatch, RootState } from "../../../redux/store";



//TOAST
import { toast } from "react-toastify";

//LOADING
import Loading from "../../../components/loading";


interface FieldAdressProps {
    openAdress: boolean;
    setOpenAdress: (openAdress: boolean) => void;
}

const FieldAdress: React.FC<FieldAdressProps> = ({ openAdress, setOpenAdress }) => {
    
    const { user } = useSelector((state: RootState) => state.auth);
    const { loading } = useSelector((state: RootState) => state.adress)
    const dispatch = useDispatch<AppDispatch>()
    const [cep, setCep] = useState<string>(user?.cep || "");
    const [loadingCep, setLoadingCep] = useState<boolean>(false);

    console.log(user)


    const schema = createSchema();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            cep: user?.cep || "",
            number: user?.number || 0,
            neighborhood: user?.neighborhood || "",
            street: user?.street || "",
            city: user?.city || "",
            state: user?.state || "",
        }
    });

    const handleCepComplete = async () => {
        if (cep.replace(/_/g, "").length === 9) {
            setLoadingCep(true);
            try {
                const response = await fetch(`http://viacep.com.br/ws/${cep.replace(/_/g, "")}/json/`);
                const data = await response.json(); 

                setValue("cep", cep);
                setValue("neighborhood", data.bairro);
                setValue("street", data.logradouro);
                setValue("city", data.localidade);
                setValue("state", data.uf);
                setLoadingCep(false);

                if (data.erro) {
                    toast.error("CEP inválido");
                    setValue("neighborhood", "");
                    setValue("street", "");
                    setValue("city", "");
                    setValue("state", "");
                    setLoadingCep(false);
                }
            } catch (err) {
                console.log(err);
                setValue("neighborhood", "");
                setValue("street", "");
                setValue("city", "");
                setValue("state", "");
                setLoadingCep(false);
            }
        }
    };

    const handleChangeAdress = async (data: any) => {

        const adress = {

            id: user?.id,
            ...data

        }
            if(user?.endereco_id) {

                const action = await dispatch(editAdress(adress))
            
                if(action.type ===  "adress/editAdress/fulfilled") {
        
                    toast.success("Endereço Atualizado com sucesso!");       
                    return
        
                }
        
                    toast.error(action.payload as string);
                    
                    return


            }

                const action = await dispatch(registerAdress(adress))

                if(action.type === "adress/registerAdress/fulfilled") {

                    toast.success("Endereço cadastrado com sucesso!");
                    return

                }

                    toast.error(action.payload as string)
                    return

                

            




        

    };

    return (
        <form onSubmit={handleSubmit(handleChangeAdress)}>
            <div className="flex justify-between items-center border-b border-gray-300 py-5">
                <h1 className="font-bold">Endereço</h1>
                <button type="submit" className="bg-blue-500 text-white px-5 py-1 ease-out duration-300">
                    Salvar Alterações
                </button>
            </div>

            <div className="w-full bg-gray-200 mt-5 sm:w-96 p-1 flex justify-between gap-8 rounded-lg">
                <button
                    type="button"
                    onClick={() => setOpenAdress(false)}
                    className={!openAdress ? "py-1 px-5 rounded-lg bg-white" : "py-1 px-5 "}
                >
                    Informações Principais
                </button>
                <button
                    type="button"
                    onClick={() => setOpenAdress(true)}
                    className={openAdress ? "py-1 px-5 rounded-lg bg-white" : "py-1 px-5 "}
                >
                    Endereço
                </button>
            </div>

            <div className="mt-5">
                <div className="w-full flex flex-col mt-4 gap-1 sm:w-7/12">
                    <label className="text-left mt-2" htmlFor="cep">Cep</label>
                    <InputMask
                        id="cep"
                        mask="99999-999"
                        placeholder="Digite seu CEP"
                        className="border border-gray-400 rounded-md outline-none p-2 mb-4"
                        {...register("cep")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCep(e.target.value)}
                        value={cep}
                        onBlur={handleCepComplete}
                    />
                    {errors.cep && <span className="text-red-500">{errors.cep.message}</span>}

                    <label htmlFor="number">Número</label>
                    <input
                        id="number"
                        placeholder="Digite seu Número"
                        type="number"
                        className="border border-gray-400 rounded-md outline-none p-2 mb-4"
                        {...register("number")}
                    />
                    {errors.number && <span className="text-red-500">{errors.number.message}</span>}

                    <label className="text-left mt-2" htmlFor="neighborhood">Bairro</label>
                    <input
                        placeholder="Digite seu Bairro"
                        id="neighborhood"
                        type="text"
                        className="border border-gray-400 rounded-md outline-none p-2 mb-4"
                        {...register("neighborhood")}
                    />

                    {errors.neighborhood && <span className="text-red-500">{errors.neighborhood.message}</span>}

                    <label className="text-left mt-2" htmlFor="street">Rua</label>
                    <input
                        placeholder="Digite sua Rua"
                        id="street"
                        type="text"
                        className="border border-gray-400 rounded-md outline-none p-2 mb-4"
                        {...register("street")}
                    />

                    {errors.street && <span className="text-red-500">{errors.street.message}</span>}


                    <label className="text-left mt-2" htmlFor="city">Cidade</label>
                    <input
                        placeholder="Digite sua Cidade"
                        id="city"
                        type="text"
                        className="border border-gray-400 rounded-md outline-none p-2 mb-4"
                        {...register("city")}
                    />

                    {errors.city && <span className="text-red-500">{errors.city.message}</span>}

                    <label className="text-left mt-2" htmlFor="state">Estado</label>
                    <select
                        id="state"
                        className="border border-gray-400 rounded-md outline-none p-2 mb-4"
                        {...register("state")}
                    >
                        <option value="">Selecione seu Estado</option>
                        {states.map((state, index) => (
                            <option key={index} value={state.sigla}>{state.nome}</option>
                        ))}
                    </select>

                    {errors.state && <span className="text-red-500 mb-5">{errors.state.message}</span>}

                    <div className="bg-sky-100 flex flex-row gap-3 items-center rounded-md">
                        <div className="bg-gray-200 w-11 p-2 rounded-md">
                            <HiOutlineLockClosed size={25} color="#4c5b62" />
                        </div>
                        <p className="text-sm">Mantemos seus dados privados e nunca os compartilhamos com terceiros.</p>
                    </div>
                </div>
            </div>

            {(loadingCep || loading) && (

                <Loading />
            )}
        </form>
    );
};

export default FieldAdress;

