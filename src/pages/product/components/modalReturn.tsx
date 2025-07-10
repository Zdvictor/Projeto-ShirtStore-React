import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";


interface ModalCepProps {

    setCloseModal: () => void
    
}

const ModalReturn: React.FC<ModalCepProps> = ({ setCloseModal}) => {

  const [isOpen, setIsOpen] = useState<boolean>(true);



  const closeModal = () => {
    setIsOpen(false);
    setCloseModal();
  };




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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-3 text-left align-middle shadow-xl transition-all">
                  <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                      Termo de Devolução de Entrega
                    </h1>
                    <p className="text-gray-600 mb-6">
                      Na <strong>Shirt Store</strong>, a sua satisfação é nossa
                      prioridade. Por isso, oferecemos um processo simples e
                      seguro de devolução para que você tenha total confiança
                      nas suas compras. Leia atentamente as condições abaixo
                      para garantir que sua devolução seja processada de maneira
                      rápida e eficiente.
                    </p>

                    <div className="text-lg font-semibold text-gray-800 mt-6">
                      1. Prazo para Devolução
                    </div>
                    <p className="text-gray-600 mb-4">
                      Você pode solicitar a devolução dos produtos adquiridos em
                      até <strong>30 (trinta) dias corridos</strong> após o
                      recebimento da entrega. Esse prazo é válido para todas as
                      compras realizadas em nosso site.
                    </p>

                    <div className="text-lg font-semibold text-gray-800 mt-6">
                      2. Condições para Devolução
                    </div>
                    <p className="text-gray-600 mb-4">
                      Para que a devolução seja aceita, o(s) produto(s) deve(m)
                      estar nas seguintes condições:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 mb-4">
                      <li>Não ter sido usado, lavado ou danificado.</li>
                      <li>Estar com a etiqueta original intacta.</li>
                      <li>
                        Ser devolvido na embalagem original, quando possível.
                      </li>
                    </ul>

                    <div className="text-lg font-semibold text-gray-800 mt-6">
                      3. Devolução Grátis
                    </div>
                    <p className="text-gray-600 mb-4">
                      Oferecemos <strong>devolução gratuita</strong> para todos
                      os nossos clientes. Caso você solicite a devolução dentro
                      do prazo estipulado e dentro das condições mencionadas, o
                      custo de envio será por nossa conta.
                    </p>

                    <div className="text-lg font-semibold text-gray-800 mt-6">
                      4. Processo de Devolução
                    </div>
                    <p className="text-gray-600 mb-4">
                      - Solicite a devolução diretamente no nosso site ou entre
                      em contato com nossa central de atendimento.
                      <br />
                      - Após a solicitação, você receberá um código de devolução
                      e as instruções para enviar o produto de volta.
                      <br />- O reembolso será realizado após o recebimento e
                      conferência do produto em nosso centro de distribuição.
                    </p>

                    <div className="text-lg font-semibold text-gray-800 mt-6">
                      5. Reembolso
                    </div>
                    <p className="text-gray-600 mb-4">
                      O reembolso será efetuado no mesmo método de pagamento
                      utilizado na compra. O prazo para que o valor esteja
                      disponível pode variar conforme a forma de pagamento
                      escolhida:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 mb-4">
                      <li>Pix: até 3 dias úteis.</li>
                      <li>
                        Mercado Pago: até 5 dias úteis
                      </li>
                    </ul>

                    <div className="text-lg font-semibold text-gray-800 mt-6">
                      6. Exceções
                    </div>
                    <p className="text-gray-600 mb-4">
                      Não são aceitas devoluções nos seguintes casos:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 mb-4">
                      <li>Produtos personalizados ou feitos sob medida.</li>
                      <li>
                        Produtos com sinais de uso, danos ou alterações feitas
                        pelo cliente.
                      </li>
                      <li>
                        Produtos adquiridos com promoções especiais ou
                        liquidações, salvo em casos de defeito de fabricação.
                      </li>
                    </ul>

                    <div className="text-lg font-semibold text-gray-800 mt-6">
                      7. Atendimento ao Cliente
                    </div>
                    <p className="text-gray-600 mb-4">
                      Caso tenha dúvidas sobre o processo de devolução ou
                      precise de assistência, entre em contato com nossa equipe
                      de atendimento ao cliente através do e-mail{" "}
                      <strong>victor.zaidir@gmail.com</strong> ou pelo
                      telefone <strong>(15) 99110-5703</strong>.
                    </p>

                    <p className="mt-6 text-gray-600">
                      <strong>Shirt Store</strong> garante a transparência e a
                      satisfação em cada compra. Agradecemos a confiança em
                      nossos produtos e serviços.
                    </p>
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Fechar
                    </button>
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

export default ModalReturn;
