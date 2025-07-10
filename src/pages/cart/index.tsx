import React, { useEffect, useState } from "react";

//REDUX
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux";
import { checkCoupon, addCoupom, deleteItem, deleteItemCart } from "../../redux/reducers/cartReducer";

// UTILS
import { handleItemsCart } from "../../utils/handleItemsCart";

// REACT-ICONS
import { FaMinus, FaPlus } from "react-icons/fa";

// COMPONENTS
import Loading from "../../components/loading";

// TYPES
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCoordinates } from "../../utils/coordinates";
import { calcDistance } from "../../utils/calcDistance";

const urlProduct = import.meta.env.VITE_URL_PRODUCTS;
const originCep: string = import.meta.env.VITE_ORIGIN_CEP

const Cart: React.FC = () => {


  const { user } = useSelector((state: RootState) => state.auth);
  const {productsCart, loading, error, coupon, couponError} = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const [qtdItems, setQtdItems] = useState<{ id: number; qtd: number }[]>([]);
  const [price, setPrice] = useState<{ id: number; price: number }[]>([]);
  const [pricePerItem, setPricePerItem] = useState<
    { id: number; pricePerItem: number }[]
  >([]);
  const [finalCostShipping, setFinalCostShipping] = useState<number>(0);
  const [couponName, setCouponName] = useState<string>(coupon || "");
  const [validatedCoupon, setValidatedCoupon] = useState<boolean>(false);
  const [loadingShipping, setLoading] = useState<boolean>(false);

  //IR PARA O PAGAMENTO
  useEffect(() => {
    if (productsCart) {
      const qtdItems = productsCart.map((product) => ({
        id: product.id,
        qtd: product.qtd,
      }));

      const price = productsCart.map((product) => ({
        id: product.id,
        price: product.price * product.qtd,
      }));

      const pricePerItem = productsCart.map((product) => ({
        id: product.id,
        pricePerItem: product.price,
      }));

      setQtdItems(qtdItems);
      setPrice(price);
      setPricePerItem(pricePerItem);

    }
  }, [productsCart]);

  useEffect(() => {

    if (user?.endereco_id) {

      const handleShipping = async () => {

        setFinalCostShipping(0);
        setLoading(true);
  
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
  
          setLoading(false);

          setFinalCostShipping(finalPrice);
  
          return 

        } catch (err) {
          console.log(err);
          setLoading(false);
        }
  
        return;

      }

     handleShipping()


    }
  }, [user]);

  useEffect(() => {
    if (error) navigate("/login", { replace: true });
  }, [error, navigate]);

  if (loading || loadingShipping)
    return (
      <div className="flex w-full h-full items-center justify-center text-7xl mt-52 mb-96">
        {" "}
        <Loading />{" "}
      </div>
    );

    const handleDeleteProduct = async (id: number) => {

      await dispatch(deleteItemCart(id))
      dispatch(deleteItem(id))
      toast.success("Produto removido com sucesso!")


    }


    const handleApplyCoupon = async () => {

      if(validatedCoupon || coupon) return

      if(couponName === "") return toast.error("Digite o Cupom")

      const action = await dispatch(checkCoupon(couponName))

      if(action.type === "cart/checkCoupon/fulfilled") {

        toast.success("Cupom aplicado com sucesso!");
        dispatch(addCoupom(couponName))
        setValidatedCoupon(true)
        return 

      }

      setValidatedCoupon(false)
      return toast.error(couponError || action.payload as string)


    } 
    
    const goToCheckout = () => {
      if (!user?.endereco_id) {
        toast.warn("Por favor, cadastre um endereço para continuar!");
        navigate("/profile/adress");
        return
      }

      navigate("/checkout")
    };




  return (
    <div className="container mx-auto px-1 py-20">
      <div className="w-full grid grid-cols-12 font-lg p-5 shadow-xl text-center">
        <div className="col-span-3">
          <h1>Produto</h1>
        </div>
        <div className="col-span-3">
          <h1>Preço</h1>
        </div>
        <div className="col-span-3">
          <h1>Quantidade</h1>
        </div>
        <div className="col-span-3">
          <h1>Tamanho</h1>
        </div>
      </div>

      {productsCart?.length === 0 ? (
        <div className="flex justify-center items-center text-3xl font-bold mt-10 mb-52">
            <h1>Nenhum Produto no Carrinho</h1>
        </div>
      ) : (
        productsCart?.map((cart) => (
          <div
            key={cart.id}
            className="relative p-0 w-full grid grid-cols-12 font-lg md:p-5 shadow-xl mt-10 justify-center items-center text-center"
          >
            <button
              onClick={() => handleDeleteProduct(cart.id)}
              title="Excluir Produto"
              className="absolute top-2 right-2 bg-red-500 flex justify-center items-center p-3 w-5 h-5 rounded-xl text-white hover:bg-red-600 ease-in-out duration-300"
            >
              ✕
            </button>

            <div className="gap-0 col-span-3 flex justify-center items-center md:gap-4">
              <img
                src={urlProduct + cart.image}
                className="w-12"
                alt={cart.name}
              />
              <p>{cart.name}</p>
            </div>

            <div className="col-span-3">
              <h1>R$ {price.find((p) => p.id === cart.id)?.price}</h1>
            </div>

            <div className="col-span-3">
              <div className="flex justify-center items-center">
                <button
                  onClick={() =>
                    handleItemsCart({
                      id: cart.id,
                      qtdItems,
                      setQtdItems,
                      setPrice,
                      pricePerItem,
                      operation: "remove",
                      dispatch
                    })
                  }
                  className="w-10 border border-gray-400 text-black text-lg lg:w-12 h-10 flex items-center justify-center"
                >
                  <FaMinus />
                </button>

                <span className="w-10 border border-gray-400 text-black text-lg lg:w-16 h-10 flex items-center justify-center">
                  {qtdItems.find((qtd) => qtd.id === cart.id)?.qtd || 0}
                </span>

                <button
                  onClick={() =>
                    handleItemsCart({
                      id: cart.id,
                      qtdItems,
                      setQtdItems,
                      setPrice,
                      pricePerItem,
                      operation: "add",
                      dispatch
                    })
                  }
                  className="w-10 border border-red-500 bg-red-500 text-white text-lg lg:w-12 h-10 flex items-center justify-center hover:bg-red-600 ease-out duration-300"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="col-span-3">
              <h1>{cart.size}</h1>
            </div>
          </div>
        ))
      )}
     
     {productsCart?.length !== 0 && (

        <div className="grid grid-cols-12 font-lg p-5 mt-10 gap-y-10">

        <div className="col-span-12 flex flex-row gap-4 md:col-span-5 items-start">
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

        <div className="justify-center col-span-12 md:col-span-7 flex md:justify-end">
        <div className="w-full md:w-2/3 border border-black p-10 rounded-lg">
            <h1 className="text-lg font-bold">Total do Carrinho</h1>
            <div className="flex justify-between items-center text-lg mt-5">
            <p>Preço:</p>
            <p>
              R${" "}
                {price
                .reduce((acc, item) => acc + Number(item.price), 0)
                .toFixed(2)}
            </p>
            </div>

            <div className="flex justify-between items-center text-lg mt-5">
            <p>Frete:</p>
            {user?.endereco_id ? (
                <p className={ (validatedCoupon || coupon) ? "line-through" : ""}>{finalCostShipping > 0 ? `R$ ${finalCostShipping.toFixed(2)}` : "Gratis"}</p>
            ) : (

                <p className="text-right">Endereço Não Cadastrado</p>

            )}
            </div>

            <div className="flex justify-between items-center text-lg mt-5">
            <p>Cupom:</p>

                <p className="text-right">{(validatedCoupon || coupon) ? couponName : "Sem Cupom"}</p>

            </div>

            <div className="flex justify-between items-center text-lg mt-5">
            <p>Total:</p>
            <p>
                R${" "}
                {
                price
                .reduce((acc, item) => acc + Number(item.price), (validatedCoupon || coupon) ? finalCostShipping - finalCostShipping : finalCostShipping)
                .toFixed(2) 
                }
            </p>
            </div>

            <div className="mt-4 flex justify-center">
            <button
                onClick={goToCheckout}
                className=" bg-red-500 text-white px-16 py-3 rounded-md hover:bg-red-600 ease-in-out duration-300"
            >
                Finalizar Compra
            </button>
            </div>
        </div>
        </div>
        </div>

     )}

    </div>
  );
};

export default Cart;
