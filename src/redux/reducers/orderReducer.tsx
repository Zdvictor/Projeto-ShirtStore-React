import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api";
import { IOrder } from "../../interfaces/order/order";
import { IOrderDetails } from "../../interfaces/order/orderDetails";

interface OrderState {
    orders: IOrderDetails[];
    loading: boolean;
    error: string | null;
    paymentId: string | null;
    qrCode: string | null;
    qrCodeBase64: string | null;
    urlPayment: string | null;
    totalPrice: number | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
    paymentId: null,
    qrCode: null,
    qrCodeBase64: null,
    urlPayment: null,
    totalPrice: null
};

export const handleOrder = createAsyncThunk(
    "order/handleOrder",
    async ({idUser, products, cellphone, cepDestination, coupon}: IOrder, {rejectWithValue}) => {
        try {
            const response = await api.post("/create_payment", {
                idUser, 
                products, 
                cellphone, 
                cepDestination, 
                coupon
            });
            return response.data;
        } catch(err) {
            const error = err as { response?: { data?: { err?: string } } };
            return rejectWithValue(error.response?.data?.err || "Problema ao Processar Pagamento");
        }
    }
);

export const fetchOrders = createAsyncThunk<
    IOrderDetails[],
    string,
    { rejectValue: string }
>(
    "order/fetchOrders",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/order/${userId}`);
            return response.data;
        } catch (err) {
            console.log(err)
            const error = err as { response?: { data?: { err?: string } } };
            return rejectWithValue(error.response?.data?.err || "Erro ao buscar pedidos");
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        clearOrderData: (state) => {
            state.paymentId = null;
            state.qrCode = null;
            state.qrCodeBase64 = null;
            state.urlPayment = null;
            state.totalPrice = null;
            state.error = null;
        },
        clearOrders: (state) => {
            state.orders = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentId = action.payload.id;
                state.qrCode = action.payload.qrCode;
                state.qrCodeBase64 = action.payload.qrCodeBase64;
                state.urlPayment = action.payload.url;
                state.totalPrice = action.payload.totalPrice;
            })
            .addCase(handleOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearOrderData, clearOrders } = orderSlice.actions;
export default orderSlice.reducer