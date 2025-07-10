import React from "react";
import { motion } from "framer-motion";
import { ArrowBack } from "../../components/back";
import { useInView } from "react-intersection-observer";

// React Icons
import { FaShieldAlt, FaTruck, FaMedal, FaHeadset } from "react-icons/fa";
import { BiTargetLock } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { RiTeamFill } from "react-icons/ri";
import { MdSecurity, MdPayments, MdVerified } from "react-icons/md";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
};

// Adicione estas novas variantes de animação
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const slideUp = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 1
        }
    }
};

// Imagens fictícias para os avaliadores
const reviewers = [
    {
        name: "Carlos Silva",
        role: "Especialista em E-commerce",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        review: "Uma das melhores lojas online de camisas de futebol que já analisei. Sistema de entrega eficiente e produtos de alta qualidade."
    },
    {
        name: "Ana Santos",
        role: "Influenciadora Esportiva",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        review: "Compro regularmente na Shirt Store e sempre fico impressionada com a qualidade do atendimento e a autenticidade dos produtos."
    },
    {
        name: "Roberto Martins",
        role: "Ex-jogador Profissional",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        review: "Como ex-jogador, posso atestar a qualidade das camisas. São idênticas às que usávamos em campo."
    }
];

const About: React.FC = () => {
    const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [missionRef, missionInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [whyUsRef, whyUsInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [reviewsRef, reviewsInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [trustRef, trustInView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <div className="min-h-[80vh] overflow-x-hidden overflow-y-hidden">
            <div className="md:hidden">
                <ArrowBack />
            </div>

            {/* Hero Section Melhorado */}
            <motion.section 
                ref={heroRef}
                initial="hidden"
                animate={heroInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-red-50 text-gray-900 overflow-hidden"
            >
                {/* Efeito de Partículas */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-100/20 via-transparent to-transparent animate-pulse"></div>
                </div>

                {/* Efeito de Linhas Animadas */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-px bg-gradient-to-r from-transparent via-red-300 to-transparent w-full"
                            style={{ top: `${i * 25}%` }}
                            animate={{
                                x: [-1000, 1000],
                                transition: {
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.5
                                }
                            }}
                        />
                    ))}
                </div>

                {/* Conteúdo Principal */}
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        variants={slideUp}
                        className="mb-16"
                    >
                        <motion.div
                            className="text-8xl font-bold mb-4 inline-block"
                            animate={{ 
                                rotateX: [90, 0],
                                opacity: [0, 1]
                            }}
                            transition={{
                                duration: 1,
                                ease: "easeOut"
                            }}
                        >
                            <span className="bg-gradient-to-r from-gray-900 via-red-500 to-gray-900 bg-clip-text text-transparent">
                                SHIRT STORE
                            </span>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={slideUp}
                        className="space-y-8"
                    >
                        <motion.h1 
                            className="text-6xl md:text-8xl font-bold mb-6 text-gray-900"
                            animate={{ 
                                y: [50, 0],
                                opacity: [0, 1]
                            }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            Sobre Nós
                        </motion.h1>

                        <motion.p 
                            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                            variants={slideUp}
                        >
                            Somos apaixonados por futebol e comprometidos em trazer a melhor experiência 
                            de compra de camisas de times para nossos clientes.
                        </motion.p>

                        {/* Badges Animados */}
                        <motion.div 
                            className="flex justify-center gap-6 mt-12"
                            variants={slideUp}
                        >
                            {[
                                { text: "100% Online", icon: <FaShieldAlt className="text-2xl" /> },
                                { text: "Entrega Segura", icon: <FaTruck className="text-2xl" /> },
                                { text: "Produtos Autênticos", icon: <FaMedal className="text-2xl" /> }
                            ].map((badge, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-red-50 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 text-gray-900 border border-red-100"
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(254,226,226,0.5)" }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 + (index * 0.2) }}
                                >
                                    {badge.icon}
                                    <span className="text-sm font-medium">{badge.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            className="hidden md:block absolute translate-y-32 left-1/2 transform -translate-x-1/2"
                            animate={{ 
                                y: [0, 10, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Missão e Valores com Cards Flutuantes */}
            <motion.section 
                ref={missionRef}
                className="py-24 bg-white"
                initial="hidden"
                animate={missionInView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.6 }}
            >
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        <motion.div 
                            className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-red-500 text-4xl mb-6">
                                <BiTargetLock className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
                            <p className="text-gray-600">
                                Conectar torcedores aos seus times do coração através de produtos autênticos e de qualidade.
                            </p>
                        </motion.div>

                        <motion.div 
                            className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-red-500 text-4xl mb-6">
                                <RiTeamFill className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Nossa Visão</h3>
                            <p className="text-gray-600">
                                Ser a principal referência em e-commerce de camisas de futebol no Brasil.
                            </p>
                        </motion.div>

                        <motion.div 
                            className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-red-500 text-4xl mb-6">
                                <AiFillHeart className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Nossos Valores</h3>
                            <p className="text-gray-600">
                                Autenticidade, Qualidade, Confiança e Paixão pelo futebol.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Por que nos escolher com Cards Animados */}
            <motion.section 
                ref={whyUsRef}
                className="py-24 bg-gray-50"
                initial="hidden"
                animate={whyUsInView ? "visible" : "hidden"}
                variants={fadeIn}
            >
                <div className="container mx-auto px-4">
                    <motion.h2 
                        className="text-4xl font-bold text-center mb-16"
                        variants={scaleIn}
                    >
                        Por que escolher a Shirt Store?
                    </motion.h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <FaShieldAlt />, title: "100% Online", text: "Operamos totalmente online, oferecendo praticidade e segurança." },
                            { icon: <FaMedal />, title: "Produtos Autênticos", text: "Garantimos a autenticidade de todos os produtos." },
                            { icon: <FaTruck />, title: "Entrega Segura", text: "Enviamos para todo o Brasil com rapidez e segurança." },
                            { icon: <FaHeadset />, title: "Suporte 24/7", text: "Atendimento ao cliente disponível todos os dias." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                variants={scaleIn}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-red-500 text-4xl mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Avaliações com Cards Deslizantes */}
            <motion.section 
                ref={reviewsRef}
                className="py-24 bg-white"
                initial="hidden"
                animate={reviewsInView ? "visible" : "hidden"}
                variants={fadeIn}
            >
                <div className="container mx-auto px-4">
                    <motion.h2 
                        className="text-4xl font-bold text-center mb-16"
                        variants={scaleIn}
                    >
                        O que dizem sobre nós
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {reviewers.map((reviewer, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                                variants={scaleIn}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <motion.img 
                                    src={reviewer.image} 
                                    alt={reviewer.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-red-500"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.8 }}
                                />
                                <h3 className="text-xl font-bold text-center mb-2">{reviewer.name}</h3>
                                <p className="text-red-500 text-center mb-4">{reviewer.role}</p>
                                <p className="text-gray-600 text-center italic">"{reviewer.review}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Confiança e Segurança com Ícones Animados */}
            <motion.section 
                ref={trustRef}
                className="py-24 bg-gray-50"
                initial="hidden"
                animate={trustInView ? "visible" : "hidden"}
                variants={fadeIn}
            >
                <div className="container mx-auto px-4 text-center">
                    <motion.h2 
                        className="text-4xl font-bold mb-16"
                        variants={scaleIn}
                    >
                        Compre com Confiança
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-12 mb-16">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center"
                        >
                            <MdSecurity className="text-6xl text-red-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Segurança Garantida</h3>
                            <p className="text-gray-600">Suas informações estão protegidas</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center"
                        >
                            <MdPayments className="text-6xl text-red-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Pagamento Seguro</h3>
                            <p className="text-gray-600">Transações 100% seguras</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center"
                        >
                            <MdVerified className="text-6xl text-red-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Produtos Verificados</h3>
                            <p className="text-gray-600">Qualidade garantida</p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default About; 