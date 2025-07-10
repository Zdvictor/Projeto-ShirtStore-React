import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";


//UTILS
import { calcDistance } from "../../../utils/calcDistance";

import {ThreeDot} from "react-loading-indicators"

interface ModalCepProps {

    setCloseModal: () => void
    passData: ({cepDestination, finalPrice}: {cepDestination: string, finalPrice: number}) => void
}

import { getCoordinates } from "../../../utils/coordinates";

const ModalCep:React.FC<ModalCepProps> = ({setCloseModal, passData}) => {
  
  const [cepDestination, setCepDestination] = useState<string>("");
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false)

  const originCep: string = import.meta.env.VITE_ORIGIN_CEP

  const closeModal = () => {
    setIsOpen(false);
    setCloseModal()
  }


  const handleShipping = async () => {


    if (cepDestination.replace(/_/g, "").length === 9) {

      setShippingCost(0)
      setLoading(true)

      try {

        const origin = await getCoordinates(originCep)
        const destination = await getCoordinates(cepDestination)

        const distance = calcDistance(

          origin.lat,
          origin.lng,
          destination.lat,
          destination.lng

        )

        const priceForKm = 0.2

        const finalPrice = distance * priceForKm

        passData({cepDestination, finalPrice})

        setShippingCost(finalPrice)

        setLoading(false)
      

      }catch(err) {

        console.log(err)
        setLoading(false)

      }

      
      return
      
    }

    toast.error("Cep invalido");

  }


  return (
    <>


      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-scroll overflow-x-hidden">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-10 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-3xl font-medium leading-6 text-gray-900"
                  >
                    Calcular Valor do Frete
                  </Dialog.Title>
                  <div className="mt-10">
                    
                    <p className="text-xl text-gray-500">
                      Informe o CEP para calcular o valor do frete com base na transportadora da Shirt Store.
                    </p>

                    <div className="flex flex-col mt-5">
                    <label className="text-gray-500 text-xl" htmlFor="cep">Digite o CEP</label>
                    <InputMask value={cepDestination} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCepDestination(e.target.value)} mask="99999-999" type="text" id="cep" className="mt-2 px-4 py-2 border border-gray-300" placeholder="Insira seu CEP" />

                    <button onClick={handleShipping} className="mt-4 px-4 py-4 bg-blue-500 text-white rounded hover:bg-blue-600 duration-300">{!loading ? "Calcular Frete" : ( <ThreeDot color="#00be39" size="small" text="" textColor="" /> ) }</button>

                    </div>

                    {shippingCost > 0 && (
                      <div className="mt-5">
                      <p className="text-xl text-gray-500">
                        O valor do frete é de R${shippingCost.toFixed(2)}
                      </p>
                    </div>
                    )}



                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </>
  );
};

export default ModalCep;




