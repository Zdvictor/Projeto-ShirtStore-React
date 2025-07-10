import { Link } from "react-router-dom"

const NotFound: React.FC = () => {

    return (

        <div className="text-center w-full h-96 flex justify-center items-center flex-col gap-5 py-72">

            <h1 className="text-5xl font-bold uppercase">Página não encontrada 404 </h1>
            <p className="text-2xl">A página que você está procurando não foi encontrada</p>
            
            <Link to="/">
                <button className="border border-black text-black hover:text-white ease-in-out duration-300 hover:bg-black px-6 py-4 rounded">Voltar para a página inicial</button>
            </Link>
    

        </div>

    )

}

export default NotFound