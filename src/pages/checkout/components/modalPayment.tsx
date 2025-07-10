import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import SuccessAnimation from "./success";
import { toast } from "react-toastify";

interface IModalPayment {
  qrCode: string;
  totalPrice: number;
  paymentId: number;
  closeModal: () => void;
}

const ModalPayment: React.FC<IModalPayment> = ({ qrCode, totalPrice, paymentId, closeModal }) => {

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasPay, setHasPay] = useState<boolean>(false);

  useEffect(() => {
    // Conecta ao servidor Socket.IO
    const socket: Socket = io("http://localhost:8080", {
      withCredentials: true, // Necessário se estiver lidando com cookies entre domínios
    });

    // Escuta eventos do servidor
    socket.on("payment_success", (data) => {
      if (Number(data) === paymentId) {
        setHasPay(true)
        toast.success("Pagamento realizado com sucesso!");
        setTimeout(() => {
          closeModal(); 
        }, 3000);
      }
    });


    return () => {
      socket.disconnect();
    };
  }, [paymentId, closeModal]);

  useEffect(() => {
    setIsVisible(true); // Ativa a animação de entrada
  }, []); // Executa apenas ao montar o componente

  const handleClose = () => {
    setIsVisible(false); // Ativa a animação de saída
    setTimeout(() => {
      closeModal(); // Fecha o modal após a animação
    }, 300); // Tempo deve corresponder ao da animação no CSS
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <div
        className={`bg-white w-11/12 md:w-1/3 rounded-lg shadow-lg overflow-hidden transform ${
          isVisible ? "scale-100" : "scale-95"
        } transition-transform duration-300`}
      >
        <div className="bg-blue-500 p-5 text-center">
          <h2 className="text-2xl font-bold text-white">Pagamento com QR Code</h2>
        </div>
        <div className="p-6 space-y-6 text-center">
          <p className="text-gray-600 text-lg">
            Escaneie o QR Code abaixo para concluir seu pagamento!
          </p>

          
          {hasPay ? (
            <SuccessAnimation />
          ) : (
            <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center rounded-lg shadow-md my-6">
            <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />
          </div>
          )}


            
          <div className="mt-4">
            <p className="text-lg text-gray-800 font-semibold">
              Valor:{" "}
              <span className="text-blue-500 font-bold">R$ {totalPrice.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className="p-2 text-center mb-4">
          <p className="text-gray-700 text-lg mt-4">
            O pagamento será aprovado automaticamente assim que concluído, e você será
            redirecionado para a confirmação em seguida. Agradecemos pela sua compra!
          </p>
        </div>
        <div className="flex justify-center items-center p-4 bg-gray-100">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPayment;
