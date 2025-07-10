import api from "../../../services/api"
import {ICart} from "../../../interfaces/cart/cart"

export const handleCart = async (id: string | undefined): Promise<ICart[]> => {

    const response = await api.get(`/cart/${id ?? 0}`)

    return response.data

}