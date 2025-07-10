import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../assets/logos/logo_shirt_resized_200px.png";

//REDUX
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { logout } from "../../redux/reducers/authReducer";

//REACT ICONS
import { BsCart3 } from "react-icons/bs";

//USER
import userPhoto from "../../assets/foto_user.png"


import { IProducts } from "../../interfaces/products/products";

const urlUser = import.meta.env.VITE_URL_USERS
const urlProduct = import.meta.env.VITE_URL_PRODUCTS



const Header: React.FC = React.memo( () => {

  const {user} = useSelector((state: RootState) => state.auth)
  const {productsCart} = useSelector((state: RootState) => state.cart)
  const {allProducts} = useSelector((state: RootState) => state.products)
  const dispatch = useDispatch<AppDispatch>()
  const [showOptions, setShowOptions] = useState(false)
  const [searchProducts, setSearchProducts] = useState<string>('')
  const [filteredProducts, setFilteredProducts] = useState<IProducts[]>([])
  const navigate = useNavigate()

  
  useEffect(() => {
    if(searchProducts === '') return setFilteredProducts([])
    const filterProducts = allProducts.filter( product => 
      product.name.toLowerCase().includes(searchProducts.toLowerCase())
    );
  
    setFilteredProducts(filterProducts);


  }, [searchProducts, allProducts]);

  const handleRedirectForProduct = (id: number) => {

    setFilteredProducts([])
    setSearchProducts('')
    navigate(`/product/${id}`)

  }
  
  return (
    <header className="relative z-20 flex items-center justify-around px-10 py-4 border-gray-200 h-20">

      <div className="hidden md:block  items-center space-x-2">
        <Link to="/">
          <img className="w-40 mt-24 h-auto object-contain" src={logo} alt="Shirt Store Logo" />
        </Link>
        
      </div>

      <nav className="hidden md:block  space-x-8">

        <Link to="/">
          <button className="text-gray-600 hover:text-gray-900">Home</button>
        </Link>

        <Link to="/products">
          <button  className="text-gray-600 hover:text-gray-900">Produtos</button>
        </Link>
        
      </nav>


      <div className="relative">
  {/* Input de pesquisa */}
  <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 2a8 8 0 106.32 13.906l4.387 4.387a1 1 0 001.414-1.414l-4.387-4.387A8 8 0 0010 2zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"/>
    </svg>
    <input
      value={searchProducts}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchProducts(e.target.value)}
      type="text" 
      placeholder="Pesquisar" 
      className="bg-transparent outline-none text-gray-700" 
    />
  </div>

  {/* Contêiner para as sugestões */}
  {filteredProducts.length > 0 && (
    <div className="absolute top-full left-1/2  transform -translate-x-1/2 mt-2 w-96 bg-white shadow-lg rounded-lg z-10">
      {filteredProducts?.slice(0, 2).map((product, index) => (
        <div key={index} className="p-4 flex items-center space-x-4 border-b last:border-none">
          {/* Imagem do produto */}
          <div className="w-16 h-16">
            <img 
              src={urlProduct + product.image} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Informações do produto */}
          <div className="flex-1">

              <button onClick={() => handleRedirectForProduct(product.id)} className="text-left text-lg font-bold text-gray-800">{product.name}</button>

          </div>

          {/* Preço do produto */}
          <div>
            <data 
              value={product.price} 
              className="text-xl font-semibold text-green-500"
            >
              R$ {product.price}
            </data>
          </div>
        </div>
      ))}
    </div>
  )}
</div>








      <div className="flex space-x-4">

      {!user ?

        <>
          <Link to="/register">
            <button className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">Register</button>
          </Link>

          <Link to="/login">
            <button className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">Login</button>
          </Link> 
        </> 

        :

        (
        <>

          <div className="relative inline-block">

            <div className="gap-12 md:gap-5 flex items-center">
              <button onClick={() => setShowOptions(!showOptions)} className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">

                <img 
                  src={user.image ? urlUser + user.image : userPhoto} 
                  className="w-full h-full object-cover" 
                  alt="Foto do Usuario" 
                />
              </button>

              <Link to="/cart">
                <button title="Carrinho" aria-label="Adicionar no Carrinho" className="w-10 border border-gray-400 lg:w-12 h-10 flex items-center justify-center border-none">
                    <BsCart3  className="text-4xl " />
                    { productsCart.length > 0 && <div className="flex items-center text-white justify-center bg bg-red-500 w-5 h-5 p-2 rounded-xl absolute bottom-7 left-24">{productsCart.length}</div> }
                </button>
              </Link>


            </div>

            {showOptions && (

              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-black text-white rounded-md shadow-lg opacity-100 transition-opacity duration-300">

                <ul className="py-1">

                  <li>
                    <Link onClick={() => setShowOptions(false)} to="/profile" className="block px-4 py-2 hover:bg-gray-900">Perfil</Link>
                  </li>

                  <li>
                    <Link onClick={() => setShowOptions(false)} to="/orders" className="block px-4 py-2 hover:bg-gray-900">Meus Pedidos</Link>
                  </li>

                  {!user.hasValidated && (

                    <li>
                    <Link onClick={() => setShowOptions(false)} to="/validate" className="block px-4 py-2 hover:bg-gray-900">Validar Conta <span className="float-end">⚠️</span> </Link>
                    </li>

                  )}

                  {/* <li>
                    <Link onClick={() => setShowOptions(false)}  to="/settings" className="block px-4 py-2 hover:bg-gray-900">Configurações</Link>
                  </li> */}

                  <li>
                    <button onClick={async () =>  {setShowOptions(false); await dispatch(logout())}}  className="w-full text-left px-4 py-2 hover:bg-gray-900 ">Sair</button>
                  </li>
                </ul>

              </div>



            )}



          </div>

        </>
        )

      }




      </div>

      
    </header>
  );
} );

export default Header;
