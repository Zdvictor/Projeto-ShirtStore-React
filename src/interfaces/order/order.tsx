import { IProductCart } from "../../redux/reducers/cartReducer";


export interface IOrder {

    idUser: number,
    products: IProductCart[],
    cellphone: string,
    cepDestination: string,
    coupon: string

}