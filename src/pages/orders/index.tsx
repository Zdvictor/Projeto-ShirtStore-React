import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchOrders } from "../../redux/reducers/orderReducer";
import Loading from "../../components/loading";
import { ArrowBack } from "../../components/back";

const urlProduct = import.meta.env.VITE_URL_PRODUCTS;

const Orders: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { orders, loading, error } = useSelector((state: RootState) => state.order);
    console.log(orders)

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchOrders(String(user.id)));
        }
    }, [dispatch, user?.id]);

    const getStatusColor = (paid: number) => {
        switch (paid) {
            case 0:
                return "bg-yellow-500";
            case 1:
                return "bg-green-500";
            case 2:
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusText = (paid: number) => {
        switch (paid) {
            case 0:
                return "Pendente";
            case 1:
                return "Pago";
            case 2:
                return "Cancelado";
            default:
                return "Desconhecido";
        }
    };

    if (loading) return <div className="flex w-full h-full items-center justify-center text-7xl mt-52 mb-96"><Loading /></div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
    if (!orders || orders.length === 0) return (
        <div className="container mx-auto flex min-h-[70vh] flex-col">
            <div className="md:hidden">
                <ArrowBack />
            </div>
            <div className="flex-grow flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold mb-8">Meus Pedidos</h1>
                <div className="text-center text-gray-500">
                    Você ainda não possui pedidos
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="md:hidden">
                <ArrowBack />
            </div>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

                <div className="space-y-8">
                    {orders.map((orderData, index) => {
                        if (!orderData?.Order) return null;
                        
                        const { Order: order } = orderData;
                        return (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                    <div>
                                        <p className="text-lg font-semibold">Pedido #{order.Product.id}</p>
                                        <p className="text-sm text-gray-500">{order.Status.date}</p>
                                    </div>
                                    <div className={`${getStatusColor(order.Status.paid)} text-white px-4 py-2 rounded-full mt-2 md:mt-0`}>
                                        {getStatusText(order.Status.paid)}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex flex-col md:flex-row items-start md:items-center mb-4 pb-4 border-b border-gray-100">
                                        <div className="w-full md:w-1/4 mb-4 md:mb-0">
                                            <img
                                                src={`${urlProduct}${order.Product.img}`}
                                                alt={order.Product.name}
                                                className="w-full md:w-32 h-32 object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex-1 md:ml-6">
                                            <h3 className="text-lg font-semibold">{order.Product.name}</h3>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-gray-600">
                                                    Tamanho: <span className="font-medium">{order.Product.size}</span>
                                                </p>
                                                <p className="text-gray-600">
                                                    Quantidade: <span className="font-medium">{order.Product.qtd}</span>
                                                </p>
                                                <p className="text-gray-800 font-medium">
                                                    R$ {order.Status.totalPrice}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex flex-col md:flex-row justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <h4 className="font-semibold text-gray-800 mb-2">Endereço de entrega</h4>
                                            <div className="text-gray-600 space-y-1">
                                                <p>{order.Adress.street}, {order.Adress.number}</p>
                                                <p>{order.Adress.neighborhood}</p>
                                                <p>{order.Adress.city} - {order.Adress.state}</p>
                                                <p>CEP: {order.Adress.cep}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-600 mb-1">Total do pedido:</p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                R$ {(order.Status.totalPrice)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {order.Status.paid === 0 && order.Link?.url && (
                                    <div className="mt-6 flex justify-end">
                                        <button 
                                            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                                            onClick={() => window.location.href = order.Link.url}
                                        >
                                            Pagar Pedido
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Orders;