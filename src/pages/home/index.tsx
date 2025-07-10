import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Imagens e Logos (sem alterações)
import jerseyOne from "../../assets/images/camisa-main-neymar.png";
import jerseyTwo from "../../assets/images/camisa-main-messi.png";
import MercadoPagoLogo from "../../assets/logos/logo-mercadopago.png";
import PixLogo from "../../assets/logos/Logo-Pix.png";

// Redux e outros (sem alterações)
import { useSelector } from "react-redux";
import Loading from "../../components/loading";
import { RootState } from "../../redux/store";

const urlProduct = import.meta.env.VITE_URL_PRODUCTS;

// Animações (sem alterações)
const fadeInUp = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", bounce: 0.4, duration: 1 },
  },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const Home: React.FC = () => {
  const { bestOffersProducts, lendaryJerseysProducts, loading, error } =
    useSelector((state: RootState) => state.products);
  // O resto dos hooks e funções permanecem iguais
  const [idImg, setIdImg] = useState<number>(1);
  const [fade, setFade] = useState<boolean>(false);

  const toggleImage = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      setIdImg((prevId) => (prevId === 2 ? 1 : prevId + 1));
      setFade(false);
    }, 300);
  }, []);

  useEffect(() => {
    const interval = setInterval(toggleImage, 8000);
    return () => clearInterval(interval);
  }, [toggleImage]);

  if (loading)
    return (
      <div className="flex w-full h-full items-center justify-center text-7xl mt-52 mb-96">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="flex w-full h-full items-center justify-center text-3xl mt-52 mb-96">
        Erro: {error}
      </div>
    );

  return (
    <>
      {/* Hero Section - Sem alterações */}
      <motion.article
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative text-center md:text-left mt-20 container mx-auto p-20 grid grid-cols-12 gap-4 overflow-hidden"
      >
        {/* ...código da hero section... */}
        <motion.section
          variants={fadeInUp}
          className="col-span-12 md:col-span-6 md:p-5 relative z-10"
        >
          <motion.h1
            className="text-7xl bg-gradient-to-r from-black via-red-500 to-black bg-clip-text text-transparent"
            animate={{
              scale: [0.9, 1],
              opacity: [0, 1],
            }}
            transition={{ duration: 0.8 }}
          >
            SHIRT STORE
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-6 text-2xl">
            A Shirt Store é a sua loja especializada em camisas de
            futebol! Oferecemos uma variedade de modelos e estilos
            para você torcer pelo seu time com paixão e estilo.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <Link to="/products">
              <button className="border border-black mt-5 px-8 py-4 rounded-full hover:bg-black hover:text-white ease-in-out duration-300 transform hover:shadow-xl">
                Garanta sua camisa
              </button>
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 className="mt-52 text-2xl">ACEITAMOS PAGAMENTOS</h3>
            <motion.div
              className="flex items-center gap-4"
              animate={{ opacity: [0, 1] }}
              transition={{ delay: 1 }}
            >
              <motion.img
                whileHover={{ scale: 1.1 }}
                className="w-20"
                src={PixLogo}
                alt="Logo do Pix"
              />
              <motion.img
                whileHover={{ scale: 1.1 }}
                className="w-52"
                src={MercadoPagoLogo}
                alt="Logo do Mercado Pago"
              />
            </motion.div>
          </motion.div>
        </motion.section>
        <motion.section
          className="hidden md:block md:col-span-6 relative"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            title="Camisa"
            className={`${fade
                ? "opacity-0 transition-opacity duration-500"
                : "opacity-100 transition-opacity duration-500"
              } ${idImg === 2 ? "-mt-10" : ""}`}
            src={idImg === 1 ? jerseyOne : jerseyTwo}
            alt="Imagem da camisa"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.section>
      </motion.article>

      {/* Seção de Melhores Ofertas - AJUSTADA */}
      <motion.article
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto flex mt-32 flex-col p-10"
      >
        <motion.h1
          className="text-5xl text-center font-bold bg-gradient-to-r from-purple-600 via-red-500 to-yellow-500 bg-clip-text text-transparent"
          initial={{ scale: 0.5 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <span className="hidden md:inline">💥</span> MELHORES OFERTAS <span className="hidden md:inline">💥</span>
        </motion.h1>

        {/* MUDANÇA 1: Adicionado 'flex', 'overflow-x-auto' e a nova classe 'hide-scrollbar' */}
        <motion.section className="mt-10 gap-6 flex overflow-x-auto hide-scrollbar md:grid md:grid-cols-12 md:gap-12 pb-4">
          {bestOffersProducts?.map((products, index) => (
            // MUDANÇA 2: Voltamos ao layout 'flex-col' original, mas com largura fixa 'w-80' e 'flex-shrink-0'
            <motion.div
              key={products.id}
              className="flex-shrink-0 w-60 sm:col-span-6 lg:col-span-4 md:w-auto rounded-lg bg-gradient-to-br from-purple-900 via-black to-purple-900 flex flex-col items-center text-white p-4 space-y-4 shadow-lg transform transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.1 } }}
            >
              <motion.div
                className="relative w-full flex justify-center"
                whileHover="animate"
              >
                <motion.img
                  src={urlProduct + products.image}
                  alt="Imagem da camisa"
                  className="w-2/5 rounded-t-lg relative z-10"
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
              <div className="flex flex-col flex-grow md:flex-row justify-between items-center w-full px-1">
                <div>
                  <Link to={`/product/${products.slug}`}>
                    <h1 className="text-lg font-bold">{products.name}</h1>
                  </Link>
                  <p className="text-lg bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent font-bold">
                    R$ {products.price}
                  </p>
                </div>
                <Link
                  to={`/product/${products.slug}`}
                  className="w-full text-center mt-4 md:w-auto md:text-left md:mt-0 border border-white py-1 px-4 rounded-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 hover:shadow-lg"
                >
                  COMPRAR
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </motion.article>

      {/* Seção de Camisas Lendárias - AJUSTADA */}
      <motion.article
        className="container mx-auto flex mt-40 flex-col p-10 mb-52"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.h1
          className="text-5xl text-center font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ scale: 0.5 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <span className="hidden md:inline">👑</span> CAMISAS LENDÁRIAS <span className="hidden md:inline">👑</span>
        </motion.h1>

        {/* MUDANÇA 1: Mesma lógica da seção anterior */}
        <motion.section className="mt-10 gap-6 flex overflow-x-auto hide-scrollbar md:grid md:grid-cols-12 md:gap-12 pb-4">
          {lendaryJerseysProducts?.map((products, index) => (
            // MUDANÇA 2: Mesma lógica da seção anterior
            <motion.div
              key={products.id}
              className="flex-shrink-0 w-60 sm:col-span-6 lg:col-span-4 md:w-auto rounded-lg bg-gradient-to-br from-yellow-900 via-black to-yellow-900 flex flex-col items-center text-white p-4 space-y-4 shadow-lg  transform transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.1 } }}
            >
              <motion.div
                className="relative w-full flex justify-center"
                whileHover="animate"
              >
                <motion.img
                  src={urlProduct + products.image}
                  alt="Imagem da camisa"
                  className="w-2/5 rounded-t-lg relative z-10"
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
              <div className="flex flex-col flex-grow md:flex-row justify-between items-center w-full px-1">
                <div>
                  <Link to={`/product/${products.slug}`}>
                    <h1 className="text-lg font-bold">{products.name}</h1>
                  </Link>
                  <p className="text-lg bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent font-bold">
                    R$ {products.price}
                  </p>
                </div>
                <Link
                  to={`/product/${products.slug}`}
                  className="w-full text-center mt-4 md:w-auto md:text-left md:mt-0 border border-white py-1 px-4 rounded-full transition-all duration-300 bg-gradient-to-r from-yellow-600 to-red-600 hover:from-red-600 hover:to-yellow-600 hover:shadow-lg"
                >
                  COMPRAR
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </motion.article>
    </>
  );
};

export default Home;
