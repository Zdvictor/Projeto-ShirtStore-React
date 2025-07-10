export interface IOrderDetails {
    Order: {
        Status: {
            paid: number;
            date: string;
            totalPrice: number;
        };
        User: {
            id: number;
            name: string;
            cpf: string;
            email: string;
            cellphone: string;
        };
        Adress: {
            id: number;
            number: number;
            neighborhood: string;
            street: string;
            city: string;
            state: string;
            cep: string;
        };
        Product: {
            id: number;
            name: string;
            price: number;
            description: string;
            img: string;
            size: string;
            qtd: number;
        };
        Link: {
            url: string;
        };
    };
}

export interface IGroupedOrder {
    id_order: string;
    created_at: string;
    total_price: number;
    isPaid: number;
    address: {
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
    };
    products: {
        id_product: number;
        nome_produto: string;
        preço_produto: number;
        size: string;
        qtd: number;
        image: string;
    }[];
} 