import React from "react"

import { useSelector } from "react-redux"


//LOADING
import Loading from "../../components/loading"

//ICONS
import { ArrowBack } from "../../components/back"
import { Link } from "react-router-dom"
import { RootState } from "../../redux/store"


const urlProduct = import.meta.env.VITE_URL_PRODUCTS

const Products: React.FC = () => {


    const {allProducts, loading, error} = useSelector((state: RootState) => state.products)

      if (loading) return ( <div className="flex w-full h-full items-center justify-center text-7xl mt-52 mb-96"> <Loading /> </div>)
      if (error) return <div className="flex w-full h-full items-center justify-center text-3xl mt-52 mb-96">Erro: {error}</div>
    
    return (

        <>

        <div className="md:hidden">
            <ArrowBack />
        </div>
        
        <article className="container mx-auto flex flex-col  mt-20 mb-96">

            <h1 className="text-center text-4xl">TODOS PRODUTOS</h1>

            <section className="mt-10 gap-12 mx-auto md:grid grid-cols-12  ">
                
                { 
                
                allProducts?.map( (products) => (

                <div
                key={products.id}
                className="mt-10 sm:col-span-6 lg:col-span-4 border-black h-auto w-auto md:w-72 lg:w-80 xl:w-96 rounded-lg bg-black flex flex-col items-center text-white p-4 space-y-4"
                >
                <img
                    src={urlProduct + products.image}
                    alt="Imagem da camisa"
                    className="w-2/5 rounded-t-lg"
                />

                <div className="flex justify-between items-center w-full px-1">
                    <div>
                    <h1 className="text-lg font-bold">{products.name}</h1>
                    <p className="text-lg">R$ {products.price}</p>
                    </div>

                    <Link to={`/product/${products.slug}`} className="border border-white py-1 px-4 rounded transition-colors duration-300 hover:bg-white hover:text-black">
                        COMPRAR
                    </Link>
                </div>
                </div>


                ))

                }
            </section>

        </article>
            
        </>


    )


}

export default  Products