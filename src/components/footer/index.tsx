import React from "react"
import { Link } from "react-router-dom"
import { handleScrollUp } from "../../utils/hadleScoll" // Corrigido para "handleScroll"

const Footer: React.FC = () => {
    return (
        <div className="bg-black">
            <footer className="container text-white mx-auto flex flex-col gap-12 p-10 md:flex-row md:justify-between md:items-center md:p-20">

                {/* Seção de Informações */}
                <div className="w-full text-center md:text-left md:w-1/2">
                    <h1 className="text-4xl md:text-5xl">SHIRT STORE</h1>
                    <p className="text-base mt-5 max-w-lg mx-auto md:mx-0 md:text-lg">
                        A Shirt Store é o lugar perfeito para quem ama futebol! Com uma variedade de camisas de times,
                        garantimos qualidade e conforto em cada peça. Aqui você encontra desde lançamentos até modelos clássicos,
                        tudo com ótimos preços. Compre agora e mostre sua paixão pelo futebol!
                    </p>
                </div>

                {/* Seção de Navegação */}
                <nav className="text-center md:text-left">
                    <h2 className="text-3xl mb-5">EXPLORE</h2>
                    <ul className="flex flex-col gap-4 text-lg">
                        <li>
                            <Link to="/products" onClick={handleScrollUp}>
                                Produtos
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" onClick={handleScrollUp}>
                                Carrinho
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" onClick={handleScrollUp}>
                                Sobre Nós
                            </Link>
                        </li>
                        {/* <li> <a href="#"> Contato </a> </li> */}
                    </ul>
                </nav>

            </footer>
        </div>
    )
}

export default Footer;