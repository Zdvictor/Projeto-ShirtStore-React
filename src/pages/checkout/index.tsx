import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//REDUX

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { checkCoupon, clearBuyNowProduct } from "../../redux/reducers/cartReducer";
import { handleOrder } from "../../redux/reducers/orderReducer";

//ZOD
import {useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {schema, FormData} from "./schema"

import InputMask from "react-input-mask"

//IMG
import mercadoPago from "../../assets/logos/logo-mercadopago.png"
import pix from "../../assets/logos/Logo-Pix.png"
import { getCoordinates } from "../../utils/coordinates";
import { calcDistance } from "../../utils/calcDistance";
import { toast } from "react-toastify";
import Loading from "../../components/loading";

//MODAL PAYMENT
import ModalPayment from "./components/modalPayment";

const urlProduct = import.meta.env.VITE_URL_PRODUCTS;
const originCep: string = import.meta.env.VITE_ORIGIN_CEP

const Checkout: React.FC = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const {user} = useSelector((state: RootState) => state.auth)
    const {productsCart, coupon, loading, error, couponError, buyNowProduct} = useSelector((state: RootState) => state.cart)
    // const [isChecked, setIsChecked] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement | null>(null)
    const [finalCostShipping, setFinalCostShipping] = useState<number>(0);
    const [loadingCheckout, setLoadingCheckout] = useState<boolean>(false);
    const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
    const [validatedCoupon, setValidatedCoupon] = useState<boolean>(false);
    const [couponName, setCouponName] = useState<string>(coupon || "");
    const [methodPayment, setMethodPayment] = useState<"pix" | "mercadopago" | "">("");
    const [price, setPrice] = useState<{ id: number; price: number }[]>([]);
    const [openModalPayment, setOpenModalPayment] = useState<boolean>(false);

    const [orderId, setOrderId] = useState<number>(0);
    const [qrCode, setQrCode] = useState<string>("");
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // Use este array para renderizar os produtos
    const productsToShow = buyNowProduct ? [buyNowProduct] : productsCart;

    useEffect(() => {

        const finalPrice = productsToShow.reduce((acc, product) => acc + Number(product.price), 0);

        console.log(finalPrice)

    }, [productsToShow])


    useEffect(() => {
        if (productsToShow) {
            const price = productsToShow.map((product) => ({
                id: product.id,
                price: product.price * product.qtd,
            }));
            setPrice(price);
        }
    }, [productsToShow]); // Remove 'price' from the dependency array

    useEffect(() => {
    
        if (user?.endereco_id) {
    
          const handleShipping = async () => {
    
            setFinalCostShipping(0);
            setLoadingCheckout(true);
      
            try {
              const origin = await getCoordinates(originCep);
              const destination = await getCoordinates(user!.cep);
      
              const distance = calcDistance(
                origin.lat,
                origin.lng,
                destination.lat,
                destination.lng
              );
      
              const priceForKm = 0.2;
      
              const finalPrice = distance * priceForKm;
      
              setLoadingCheckout(false);
    
              setFinalCostShipping(finalPrice);

              console.log(finalPrice)
      
              return 
    
            } catch (err) {
              console.log(err);
              setLoadingCheckout(false);
            }
      
            return;
    
          }
    
         handleShipping()
    

        }else {

            toast.warn("Por favor, cadastre um endereço para continuar!");
            navigate("/profile/adress");
            return
        }

      }, [user]);

    useEffect(() => {
        if (error) navigate("/login", { replace: true });
    }, [error, navigate]);

    useEffect(() => {
        // Limpa o produto de compra imediata quando sair do checkout
        return () => {
            dispatch(clearBuyNowProduct());
        };
    }, []);

    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({

        resolver: yupResolver(schema),

    });


    const handleFormSubmit = async (data: FormData) => {

        if(methodPayment === "") return toast.error("Selecione um meio de pagamento")
        if(methodPayment === "mercadopago") return toast.error("Em Manutenção")

        setLoadingPayment(true)
        const action = await dispatch(handleOrder( {idUser: user!.id, products: productsToShow ,cellphone: data.cellphone, cepDestination: user!.cep, coupon: validatedCoupon ? couponName : ""} ))
        
        if(action.type === "order/handleOrder/fulfilled") {


            setOpenModalPayment(true)

            toast.success("Efetue o pagamento e aguarde a confirmação")

            setOrderId(action.payload.id)
            setQrCode(action.payload.qrCodeBase64)
            setTotalPrice(action.payload.totalPrice)

            setLoadingPayment(false)

            return

        }else {

            toast.error(action.payload as string)
            setLoadingPayment(false)

            return
        }
    }

    const handleConfirmButtonClick = () => {

        handleSubmit(handleFormSubmit)();

    }

    const handleApplyCoupon = async () => {
    
          if(validatedCoupon || coupon) return
    
          if(couponName === "") return toast.error("Digite o Cupom")
    
          const action = await dispatch(checkCoupon(couponName))
    
          if(action.type === "cart/checkCoupon/fulfilled") {
    
            toast.success("Cupom aplicado com sucesso!");
            setValidatedCoupon(true)
            return 
    
          }
    
          setValidatedCoupon(false)
          return toast.error(couponError || action.payload as string)
    
    
    }

    const closeModal = () => {

        setOpenModalPayment(false)
        setTimeout(() => navigate("/orders", {replace: true}), 250)
        return
    }

    if (loading || loadingCheckout)
        return (
          <div className="flex w-full h-full items-center justify-center text-7xl mt-52 mb-96">
            {" "}
            <Loading />{" "}
          </div>
    );

    return (
        <div className="container mx-auto py-10 grid grid-cols-12 gap-y-32">
            
            <div className="col-span-12 md:col-span-6 mx-auto mt-10 p-5">
                <h1 className="text-4xl font-bold">Detalhes do Pagamento</h1>

                <form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)} className="text-lg flex flex-col mt-10 gap-1" action="">
                    <label htmlFor="name">Nome*</label>
                    <input
                        className="bg-gray-100 border-none py-3 px-4 rounded-lg mt-2 outline-none mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="text"
                        id="name"
                        defaultValue={user?.name || ""}
                        {...register("name")}
                    />
                    {errors.name && <p className="text-left text-red-600 mb-4">{errors.name.message}</p>}

                    <label htmlFor="email">Email*</label>
                    <input
                        className="bg-gray-100 border-none py-3 px-4 rounded-lg mt-2 outline-none mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="email"
                        id="email"
                        defaultValue={user?.email || ""}
                        {...register("email")}
                    />
                    {errors.email && <p className="text-left text-red-600 mb-4">{errors.email.message}</p>}

                    <label htmlFor="email">CPF*</label>
                    <InputMask
                        mask={"999.999.999-99"}
                        className="bg-gray-100 border-none py-3 px-4 rounded-lg mt-2 outline-none mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="text"
                        id="email"
                        defaultValue={user?.cpf || ""}
                        {...register("cpf")}
                    />
                    {errors.cpf && <p className="text-left text-red-600 mb-4">{errors.cpf.message}</p>}

                    <label htmlFor="cellphone">Telefone*</label>
                    <InputMask
                        mask="(99) 99999-9999"
                        className="bg-gray-100 border-none py-3 px-4 rounded-lg mt-2 outline-none mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="text"
                        id="cellphone"
                        {...register("cellphone")}
                    />

                    {errors.cellphone && <p className="text-left text-red-600 mb-4">{errors.cellphone.message}</p>}

                    {/* <div className="flex items-center gap-3">

                        <input checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="w-4 h-4" type="checkbox" name="checkbox" id="checkbox" />
                       
                        <span className="text-gray-800">
                            Salvar para check-out rápido?
                        </span>
                    </div> */}

                    
                </form>
            </div>

            <div className="col-span-12 md:col-span-6 flex h-full items-center w-2/3 mx-auto mt-9">

                <div className="flex-col gap-4">
                    
                    <h1 className="text-4xl font-bold mb-20">Detalhes do Pedido</h1>

                    {productsToShow.map(product => (
                        <div 
                            key={product.id} 
                            className="flex items-center w-full justify-between mb-10"
                        >
                            {/* Imagem e informações */}
                            <div className="flex flex-col lg:flex-row gap-4">
                                <img 
                                    src={urlProduct + product.image} 
                                    alt={product.name} 
                                    className="w-20 h-20 rounded-md" 
                                />
                                <div className="flex flex-col gap-y-2 w-1/2">
                                    <h1 className="text-lg font-semibold">
                                        {product.name} {product.size}
                                    </h1>
                                </div>
                            </div>

                            {/* Preço */}
                            <div className="text-right min-w-[80px]">
                                <h1 className="text-lg font-semibold">
                                    R$ {price.find((p) => p.id === product.id)?.price}
                                </h1>
                            </div>
                        </div>
                    ))}


                    <div className="mt-16 flex items-center w-full justify-between">
                        <h1 className="text-lg font-semibold">Subtotal</h1>
                        <h1 className="text-lg font-semibold">R$ {price.reduce((acc, product) => acc + Number(product.price) , 0)}</h1>
                    </div>

                    <div className="mt-5 border-b border-gray-300" />

                    <div className="mt-5 flex items-center w-full justify-between">
                        <h1 className="text-lg font-semibold">Frete</h1>
                        <h1 className={(validatedCoupon || coupon) ? "line-through text-lg font-semibold" : "text-lg font-semibold"}>{finalCostShipping > 0 ? `R$ ${finalCostShipping.toFixed(2)}` : "Gratis"}</h1>
                    </div>

                    <div className="mt-5 border-b border-gray-300" />

                    <div className="mt-5 flex items-center w-full justify-between">
                        <h1 className="text-lg font-semibold">Cupom</h1>
                        <h1 className="text-lg font-semibold">{(validatedCoupon || coupon) ? couponName : "Sem Cupom"}</h1>
                    </div>

                    <div className="mt-5 border-b border-gray-300" />

                    <div className="mt-5 flex items-center w-full justify-between">
                        <h1 className="text-lg font-semibold">Total</h1>
                        <h1 className="text-lg font-semibold">R$  {
                        price
                        .reduce((acc, item) => acc + Number(item.price), (validatedCoupon || coupon) ? finalCostShipping - finalCostShipping : finalCostShipping)
                        .toFixed(2) 
                        }</h1>
                    </div>

                    <div className="mt-10 flex items-center w-full justify-between">
                        <label className="flex items-center gap-x-5" htmlFor="mercadopago">
                        <div className="relative w-8 h-8">
                        <input
                            type="checkbox"
                            id="mercadopago"
                            name="mercadopago"
                            checked={methodPayment === "mercadopago"}
                            onChange={() => setMethodPayment("mercadopago")}
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-full h-full rounded-full border-2 border-gray-400 flex items-center justify-center">
                            <div
                            className={`w-4/5 h-4/5 rounded-full p-3 transition-all duration-300 ${
                                methodPayment === "mercadopago" ? "bg-gray-500" : "bg-transparent"
                            }`}
                            />
                        </div>
                        </div>
                            Mercado Pago
                        </label>

                        <img className="w-28" src={mercadoPago} alt="Mercado Pago" />
                    </div>

                    <div className="mt-10 flex items-center w-full justify-between">
                        <label className="flex items-center gap-x-5" htmlFor="mercadopago">
                        <div className="relative w-8 h-8">
                        <input
                            type="checkbox"
                            id="mercadopago"
                            name="mercadopago"
                            checked={methodPayment === "pix"}
                            onChange={() => setMethodPayment("pix")}
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-full h-full rounded-full border-2 border-gray-400 flex items-center justify-center">
                            <div
                            className={`w-4/5 h-4/5 rounded-full p-3 transition-all duration-300 ${
                                methodPayment === "pix" ? "bg-gray-500" : "bg-transparent"
                            }`}
                            />
                        </div>
                        </div>

                            PIX
                        </label>

                        <img className="w-16" src={pix} alt="Pix" />
                    </div>

                    <div className="w-full flex gap-4 mt-10">
                        <input
                            disabled={validatedCoupon || coupon !== null}
                            value={couponName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCouponName(e.target.value.toUpperCase())}
                            className="w-2/3 border border-gray-500 px-4 py-3 rounded-md outline-none"
                            type="text"
                            placeholder="Código do Cupom"
                        />
                        <button onClick={handleApplyCoupon} className={(validatedCoupon || coupon) ? "bg-green-500 text-white px-12 rounded-md uppercase cursor-not-allowed ease-in-out duration-500" : "bg-red-500 text-white px-12 rounded-md uppercase ease-in-out duration-500"}>
                            {(validatedCoupon || coupon) ? " Cupom Aplicado" : "Aplicar Cupom"}
                        </button>
                    
                    </div>

                    <div className="mt-10 flex justify-start">
                        <button onClick={handleConfirmButtonClick}
                            className="w-full md:w-auto bg-red-500 text-white px-16 py-3 rounded-md hover:bg-red-600 ease-in-out duration-300"
                        >
                            Confirmar Pedido
                        </button>
                    </div>


                </div>

            </div>
            {loadingPayment && <Loading />}

            {openModalPayment && <ModalPayment paymentId={orderId} qrCode={qrCode} totalPrice={totalPrice} closeModal={() => closeModal()} />}

        </div>
    );
};

export default Checkout;

