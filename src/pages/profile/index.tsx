import React, {useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//COMPONENTS
import FieldUser from "./components/fieldUser";
import FieldAdress from "./components/fieldAdress";
import FieldPassword from "./components/fieldPassword";


//REDUX
import {RootState } from "../../redux/store"


//ICONS
import { ArrowBack } from "../../components/back";

//REDUX
import {useSelector } from "react-redux";


//LOADING
import Loading from "../../components/loading";

//LOGO
import google from "../../assets/logos/google.png";








const Profile: React.FC = () => {

    const { user, loading } = useSelector((state: RootState) => state.auth)
    const {action} = useParams()
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [openAddress, setOpenAddress] = useState<boolean>(false)

    useEffect(() => {

        if(action === "adress") {

            setOpenAddress(true)
            return
        }

    }, [action])

    return (

        <>
        
        <div className="md:hidden">
            <ArrowBack />
        </div>

        <div className="container mx-auto mt-20 mb-40 w-full lg:w-1/2"> 

            <h1 className="text-3xl text-gray-800 ">Perfil e Segurança</h1>

            <div className="border border-gray-300 mt-5 p-5 rounded-md mb-10">


                {!openAddress && (
                
                <FieldUser openAdress={openAddress} setOpenAdress={setOpenAddress} />

                )}

                {openAddress && (

                <FieldAdress openAdress={openAddress} setOpenAdress={setOpenAddress} />

                )}


                
            </div>

            <div className="border border-gray-300 mt-5 p-8 rounded-md ">

                <div className="flex justify-between items-center border-b border-gray-300 py-2">
                    <h1 className="font-bold">Acesso e Segurança</h1>
                </div>


                <div className="bg-gray-200 mt-5 w-28 p-1 flex rounded-lg justify-center">
                    <button className="py-1 px-4 rounded-lg bg-white">Segurança</button>
                </div>


                <div className="w-full  mt-7 flex flex-col gap-9 sm:w-7/12">

                    <div className="flex flex-row justify-between">
                        <h1 className="text-lg" >E-mail de Login:</h1>
                        <p>{user?.email}</p>
                    </div>

                    
                    <div className="flex flex-row justify-between">
                        <h1 className="text-lg" >Senha:</h1>
                        {user?.isGoogle ? 
                        (
                    
                            <div className="flex">
                                <img className="w-6 h-6 mr-2" src={google} alt="Logo do Google" />
                                <button className="cursor-default ">Autenticado Pelo Google</button>
                            </div>
                        
                        )

                        :
                        
                        (
                            <button onClick={() => setOpenModal(!openModal)} className="text-blue-700">Alterar Senha</button>
                        )
                        }
                    </div>

                    {openModal && (

                        <FieldPassword setOpenModal={setOpenModal} />

                    )}
                    

                </div>

                
            </div>

        </div>

        {loading && (

            <Loading/>

        )}

        </>

    )


}


export default Profile