import React, { useCallback, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"

//REDUX
import { useDispatch, useSelector } from "react-redux"
import { fetchCart, buyNow } from "../../redux/reducers/cartReducer"

//COMPONENTS
import Rating from "./components/rating"
import { ArrowBack } from "../../components/back"
import ModalCep from "./components/modalCep"

//FORMAT
import { FormatSecondData } from "../../utils/formatSecondData"

//REACT ICONS
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { TfiReload } from "react-icons/tfi";
import ModalReturn from "./components/modalReturn"


//USER
import userPhoto from "../../assets/foto_user.png"
import Loading from "../../components/loading"
import { IRandomProductResult } from "../../interfaces/products/otherProducts"


//METHODS QUERY
import {fetchProducts, fetchReviews, fetchOtherProducts} from "./services/index"


//UTILS
import { handleItems } from "../../utils/handleItems"
import { handleScrollUp } from "../../utils/hadleScoll"
import { AllReviews } from "../../interfaces/reviews/reviews"
import { AppDispatch, RootState } from "../../redux/store"
const urlUser = import.meta.env.VITE_URL_USERS
const urlProduct = import.meta.env.VITE_URL_PRODUCTS

import { toast } from "react-toastify"

const Product: React.FC = () => {

    
    const { slug } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const {user} = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()

    const {data, isLoading, isSuccess, error} = useQuery({

        queryKey: ['product', slug],
        queryFn: () => fetchProducts(slug)
    })

    const {data: dataReviews, isLoading: isLoadingReviews, error: errorReviews} = useQuery({

        queryKey: ['reviews', slug],
        queryFn: () => fetchReviews(slug)
    })

    const {data: dataOtherProducts, isLoading: isLoadingOtherProducts, error: errorOtherProducts} = useQuery<IRandomProductResult>({

        queryKey: ['otherProducts', slug],
        queryFn: fetchOtherProducts,
    })

    const [qtdItems, setQtdItems] = useState<number>(1)
    const [price, setPrice] = useState<number>(0)
    const [pricePerItem, setPricePerItem] = useState<number>(0)
    

    const [size, setSize] = useState<string>("")
    const [openModalCep, setOpenModalCep] = useState<boolean>(false)
    const [openModalReturn, setOpenModalReturn] = useState<boolean>(false)
    const [dataCostShipping, setDataCostShipping] = useState<{ cepDestination: string, finalPrice: number }>()

    const [loading, setLoading] = useState<boolean>(false)

    const [allReviews, setAllReviews] = useState<AllReviews[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage: number = 5
    
    useEffect(() => {

        if(dataReviews) {

            setAllReviews(dataReviews?.reviews.slice(0, itemsPerPage))

        }

    }, [dataReviews])
    

    useEffect(() => {


        //ADICIONAR COMENTARIOS

        if(isSuccess && data.price) {

    
            setPrice(Number(Number(data.price).toFixed(2))); 
            setPricePerItem(Number(Number(data.price).toFixed(2)));

            return

        }


    }, [isSuccess, data])


    useEffect(() => {
        if (dataReviews) {
            setAllReviews(dataReviews.reviews.slice(0, itemsPerPage));
        }
    }, [dataReviews]);


    const handleSelectSize = useCallback((selectedSize: string) => {

        
        setSize(selectedSize)
        if(size === selectedSize) setSize("")
        

    }, [size] )


    const handleLoadMore = () => {

        setLoading(true)

        setTimeout(() => {

            if(dataReviews) {

                const startIndex = currentPage * itemsPerPage
                const newReviews = dataReviews?.reviews.slice(
        
                    startIndex,
                    startIndex + itemsPerPage
        
                )
    
                setAllReviews((prevReviews) => [...prevReviews, ...newReviews])
                setCurrentPage((prevCurrentPage) => prevCurrentPage + 1)

                setLoading(false)
    
            }

            setLoading(false)

        }, 200)
        


    }

    const redirectProduct = async (slug: string) => {

        handleScrollUp()
        navigate(`/product/${slug}`)
    }

    const handleCart = async () => {
        
        if(!user) return toast.error("Efetue o login para adicionar ao carrinho")

        if(size === "") return toast.error("Tamanho do produto não selecionado")

            const action = await dispatch(fetchCart({id_user: user!.id, id_product: Number(data?.id), qtd: qtdItems, size: size}))

            if(action.type === "cart/fetchCart/fulfilled") {

                toast.success("Produto adicionado ao carrinho com sucesso!")
                return

            }


        toast.error(action.payload as string)
            
    }

    const handleBuyNow = async () => {
        if (!user) {
            toast.error("Faça login para continuar");
            navigate("/login");
            return;
        }

        if (!size) {
            toast.error("Selecione um tamanho");
            return;
        }

        const action = await dispatch(
            buyNow({
                id_user: user.id,
                id_product: Number(data?.id),
                size: size,
                qtd: qtdItems,
            })
        );

        if (action.type === "cart/buyNow/fulfilled") {
            navigate("/checkout");
        } else {
            toast.error(action.payload as string);
        }
    };




    
    if (isLoading) return ( <div className="flex w-full h-full items-center justify-center text-7xl mt-52 mb-96"> <Loading /> </div>)
    if (error instanceof Error) return <div className="flex w-full h-full items-center justify-center text-3xl mt-52 mb-96">Erro: {error.message}</div>

    if (isLoadingReviews) return ( <div className="flex w-full h-full items-center justify-center text-7xl mt-52 mb-96"> <Loading /> </div>)
    if (errorReviews instanceof Error) return <div className="flex w-full h-full items-center justify-center text-3xl mt-52 mb-96">Erro: {errorReviews.message}</div>

    if (isLoadingOtherProducts) return ( <div className="flex w-full h-full items-center justify-center text-7xl mt-52 mb-96"> <Loading /> </div>)
    if (errorOtherProducts instanceof Error) return <div className="flex w-full h-full items-center justify-center text-3xl mt-52 mb-96">Erro: {errorOtherProducts.message}</div>

    return (
        <>

            <div className="md:hidden">
                <ArrowBack />
            </div>

            <article className="text-center md:text-left mt-20 container mx-auto p-20 grid grid-cols-12 gap-4 items-center">

                <section className="col-span-12 md:col-span-6 p-5">

                    <img src={`${urlProduct + data?.image}`} alt={data?.name} />

                </section>

                <section className="col-span-12 md:col-span-6 p-5 flex flex-col gap-5">

                    <h1 className="text-5xl">{data?.name}</h1>

                    <div className="flex-col sm:flex-row flex items-center gap-5">
                        <Rating setValue={dataReviews?.stars as number} />
                        <h1 className="text-gray-400">({dataReviews?.reviews.length ?? 0} Avaliações)</h1>
                        <div className="hidden sm:block border border-gray-400 h-5 "></div>
                        { data?.stock ? ( <h1 className="text-green-400">Em Estoque</h1> ) : ( <h1 className="text-red-600">Sem Estoque</h1> )}
                    </div>

                    <data className="text-3xl" value={price}>R$ {price?.toFixed(2)}</data>

                    <p className="text-lg">
                        {data?.description.split(".")[0]}
                    </p>

                    <div className="flex-col lg:flex-row flex items-center gap-5">

                        <h1 className="text-2xl">Tamanho: </h1>

                        <div className="flex gap-5">

                        {data?.size && data.size.split(',').map((sizeMap, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelectSize(sizeMap)}
                                className={size === sizeMap 
                                    ? "bg-black text-white px-3 py-2 rounded" 
                                    : "border border-black text-black hover:text-white ease-in-out duration-300 hover:bg-black px-3 py-2 rounded"
                                }
                            >
                                {sizeMap}
                            </button>
                        ))}



                        </div>


                    </div>

                    <div className="justify-center md:justify-start flex items-center gap-5">

                        <div className="flex items-center">

                            <button onClick={() => handleItems( {qtdItems, setQtdItems, setPrice, pricePerItem, operation: "remove" })} className="w-10 border border-gray-400 text-black text-lg lg:w-16 h-10 flex items-center justify-center">
                                <FaMinus />
                            </button>

                            <button
                                className="w-10 border border-gray-400 text-black text-lg lg:w-20 h-10 flex items-center justify-center"
                                disabled
                            >
                                {qtdItems}
                            </button>

                            <button
                                onClick={() => handleItems( {qtdItems, setQtdItems, setPrice, pricePerItem, operation: "add" }) }
                                className="w-10 border border-red-500 bg-red-500 text-white text-lg lg:w-16  h-10 flex items-center justify-center hover:bg-red-600 ease-out duration-300"
                            >
                                <FaPlus />
                            </button>

                        </div>


                        <div>
                            <button
                                onClick={handleBuyNow}
                                className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 ease-in-out duration-300"
                            >
                                Comprar Agora
                            </button>
                        </div>


                        <div>
                            <button onClick={handleCart} title="Carrinho" aria-label="Adicionar no Carrinho" className="w-10 border border-gray-400 lg:w-12 h-10 flex items-center justify-center">
                                <BsCart3 className="text-2xl" />
                            </button>
                        </div>

                    </div>

                    <div className="w-auto border border-gray-400 rounded-xl">

                        <div className="flex flex-col p-5 lg:flex-row lg:justify-between items-center lg:gap-12 md:p-10">

                            <div className="text-2xl lg:text-5xl">
                                <TbTruckDelivery />
                            </div>

                            <div className="text-center lg:mr-auto lg:text-left">
                                <h1 className="text-2xl">Calcular Frete</h1>
                                {!dataCostShipping ?
                                    (

                                        <button onClick={() => setOpenModalCep(true)} className="underline ">Insira seu CEP para Calcular e Obter o Valor do Frete.</button>)

                                    :

                                    (
                                        <>

                                            <div className="text-lg mt-2 font-bold">
                                                <p>CEP: {dataCostShipping.cepDestination} </p>
                                                <p>FRETE: R$ {dataCostShipping.finalPrice.toFixed(2)} </p>
                                                <p>VALOR FINAL: R$ {( Number(price) + Number(dataCostShipping.finalPrice.toFixed(2)) ) }</p>
                                            </div>

                                            <button onClick={() => setOpenModalCep(true)} className="underline ">Se desejar, altere o CEP para calcular um novo valor de frete.</button>

                                        </>
                                    )


                                }
                            </div>

                        </div>

                        <div className="border border-gray-200"></div>

                        <div className="flex flex-col p-5 lg:flex-row lg:justify-between items-center lg:gap-12 lg:p-10">

                            <div className="text-2xl lg:text-5xl">
                                <TfiReload />
                            </div>

                            <div className="text-center lg:mr-auto lg:text-left">
                                <h1 className="text-2xl">Devolução de Entrega</h1>
                                <p>Devoluções Grátis em até 30 Dias. <span onClick={() => setOpenModalReturn(true)} className="text-blue-400 underline cursor-pointer">Saiba Mais.</span> </p>
                            </div>

                        </div>




                    </div>

                </section>

            </article>


            <section className="text-center md:text-left mt-5 container mx-auto p-6 md:p-20 grid grid-cols-1 md:grid-cols-12 sm:gap-8 md:gap-16 items-center">
                <h1 className="col-span-12 text-2xl md:text-3xl font-bold mx-auto">Avaliações</h1>

                <div className="col-span-12 md:col-span-5 flex flex-col items-center md:items-end mt-6">

                    <div className="flex flex-col gap-3 text-center md:text-left">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-800">{dataReviews?.stars.toFixed(1)}</h1>
                        <Rating setValue={dataReviews?.stars as number} />
                        <p className="text-gray-400 text-sm md:text-lg">{dataReviews?.reviews.length ?? 0}</p>
                    </div>

                </div>
                
                <div className="col-span-12 flex justify-center md:col-span-7 mt-6">
                    <div className="w-2/3 flex flex-col gap-4">
                        {[5, 4, 3, 2, 1].map((star) => {
                            
                            const starData = dataReviews?.averageStars?.find((review) => review.stars === star);
                            const percentage = starData ? parseFloat(starData.percentage.toString()) || 0 : 0;


                            const ratingColors: Record<number, {color: string}> = {
                                5: { color: "bg-blue-500" },
                                4: { color: "bg-blue-400" },
                                3: { color: "bg-blue-300" },
                                2: { color: "bg-blue-200" },
                                1: { color: "bg-blue-100" },
                            };

                            const { color } = ratingColors[star] || {};

                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <p className="w-6 text-gray-800 font-medium">{star}</p>
                                    <div className="flex-grow h-3 bg-gray-300 rounded-xl overflow-hidden">
                                        <div
                                            className={`${color} h-3 rounded-xl`}
                                            style={{ width: `${percentage}%` }} // Usando o valor do percentage
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>


            </section>
            
            <section className="text-center md:text-left mt-20 container p-5 mx-auto md:p-20 grid grid-cols-12 gap-y-20">
            {allReviews.map((review) => (
                <div key={review.id} className="col-span-12 md:w-2/3">
                    <div className="flex flex-row items-center gap-2 md:gap-5">
                        <button className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                            <img
                                src={
                                    review.image
                                        ? urlUser + review.image
                                        : userPhoto
                                }
                                className="w-full h-full object-cover"
                                alt="Foto do Usuario"
                            />
                        </button>

                        <p className="text-lg md:text-2xl">{review.name}</p>
                        <div className="w-2 h-2 rounded-xl bg-black"></div>
                        <p className="text-lg text-gray-600">
                            {FormatSecondData(review.created_at)}
                        </p>
                        <Rating setValue={review.stars} />
                    </div>
                    <div className="mt-5 text-left text-md md:text-2xl">
                        <p>{review.commentary}</p>
                    </div>
                </div>
            ))}

            
                {dataReviews && allReviews.length < dataReviews.reviews.length &&
                
                    <div className="col-span-12">
                        <button
                        onClick={handleLoadMore}
                        className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                        >
                            Ver Mais Comentários
                        </button>
                     </div>

                }

            </section>

            <section className="text-center md:text-left mt-24 container p-5 mx-auto md:p-20 gap-y-20">
                    
                <div className="flex items-center text-red-500 text-xl gap-10">
                    <div className="w-8 h-14 bg-red-500 rounded-b-xl"></div>
                    <h1>Itens Relacionados</h1>
                </div>

                <div className="grid grid-cols-12 mt-24 mb-20 gap-y-12 md:gap-10">
                    
                {dataOtherProducts?.products?.map( (product, index) => (

                    <div key={product.id} className="col-span-12 md:col-span-6 lg:col-span-3">
                        
                        <div onClick={() => redirectProduct(product.slug)} className="w-full h-auto bg-slate-100 p-5 flex flex-col items-center overflow-hidden cursor-pointer">

                        <div className="w-full flex items-center">
                        <div className="bg-red-500 text-white w-16 text-center rounded-md p-1 mr-auto">-40%</div>
                        {product.id === Number(data?.id) && (<div className="bg-black text-white w-16 text-center rounded-md p-1 ml-auto">ATUAL</div>)}
                        </div>

                            <img className="w-1/3 md:w-2/3" src={urlProduct + product.image } alt={product.name} /> 
                            
                        </div>

                        <div onClick={() => redirectProduct(product.slug)} className="flex w-auto mt-5">
                            <button className="text-start text-xl min-h-20">{product.name}</button>
                        </div>


                        <div className="flex gap-5 text-lg mt-4">   
                            <data className="text-red-500" value="200">R${product.price}</data>
                            <p className="text-gray-400 line-through">R${product.price * (1 + 0.4)}</p>
                        </div>

                        <div className="flex mt-4 items-center gap-4">
                            <Rating setValue={ dataOtherProducts.reviews?.[index]?.stars } /> <h1 className="text-lg text-gray-400">( { dataOtherProducts.reviews?.[index]?.reviews.length } )</h1>
                        </div>


                    </div>

                    )
   

                    )}
                    



                </div>

            </section>




            {openModalCep && <ModalCep setCloseModal={() => setOpenModalCep(false)} passData={(data) => setDataCostShipping(data)} />}
            {openModalReturn && <ModalReturn setCloseModal={() => setOpenModalReturn(false)} />}
            {loading && <Loading />}
        </>

    )

}


export default Product