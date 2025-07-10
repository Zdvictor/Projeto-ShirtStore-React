import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface IProductCart {
    id: number;
    id_user: number;
    id_product: number;
    name: string,
    price: number,
    image: string;
    size: string;
    qtd: number;
}

export interface IAddProductCart {
    id_user: number;
    id_product: number;
    size: string;
    qtd: number;
}

export interface IBuyNowProduct {
  id: number;
  id_user: number;
  id_product: number;
  name: string;
  price: number;
  image: string;
  size: string;
  qtd: number;
}

export interface IHandleCart {
    productsCart: IProductCart[];
    buyNowProduct: IBuyNowProduct | null;
    coupon: string | null;
    loading: boolean;
    error: string | null;
    couponError: string | null;
}

const initialState: IHandleCart = {
    productsCart: [],
    buyNowProduct: null,
    coupon: null,
    loading: false,
    error: null,
    couponError: null
}

export const handleListCart = createAsyncThunk<
    IProductCart[], 
    number, 
    { rejectValue: string }
>(
    "cart/handleListCart",
    async(id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/cart/${id}`);
            return response.data;

        } catch(err) {
            const error = err as { response?: { data?: { err?: string } } };
            const message = typeof error.response?.data?.err === 'string' ? error.response?.data?.err : 'Problema ao Buscar Produtos do Carrinho';
            return rejectWithValue(message);
        }
    }
)

export const fetchCart = createAsyncThunk<
  IProductCart, 
  IAddProductCart,
  { rejectValue: string }
>(
  "cart/fetchCart",
  async ({ id_user: idUser, id_product: idProduct, size, qtd }: IAddProductCart, {dispatch, rejectWithValue }) => {
    try {
      
      const response = await api.post(`/cart`, { idUser, idProduct, size, qtd });
      await dispatch(handleListCart(idUser));
      return response.data;
    } catch (err) {
    
      console.log(err)      
      const error = err as { response?: { data?: { err?: string } } };
      const message = typeof error.response?.data?.err === 'string' ? error.response?.data?.err : 'Problema ao Adicionar Produtos do Carrinho';
      return rejectWithValue(message);
    }
  }
)

export const updateCart = createAsyncThunk(
    "cart/updateCart",
    async ({ id, qtd }: { id: number, qtd: number }, {rejectWithValue}) => {

        try {

            console.log(id)
            const response = await api.put("/cart/update-quantity", { id, qtd });

            return response.data


        }catch(err) {

            console.log(err)
            const error = err as {response?: {data?: {err?: string}}};
            const message = typeof error.response?.data?.err === 'string' ? error.response?.data?.err : 'Problema ao Atualizar Quantidade de Produtos do Carrinho';
            return rejectWithValue(message)

        }
        
    }
)

export const deleteItemCart = createAsyncThunk(
    "cart/deleteItemCart",
    async (id: number, {rejectWithValue}) => {

        try {

            const response = await api.delete(`/cart/${id}`);

            return response.data


        }catch(err) {

            console.log(err)
            const error = err as {response?: {data?: {err?: string}}};
            const message = typeof error.response?.data?.err === 'string' ? error.response?.data?.err : 'Problema ao Deleter Produtos do Carrinho';
            return rejectWithValue(message)

        }
        
    }
)

export const checkCoupon = createAsyncThunk(
    "cart/checkCoupon",

    async (name: string, {rejectWithValue}) => {

        try {

            await api.post("/coupons", {name: name})

            return name


        }catch(err) {

            const error = err as {response?: {data?: {err?: string}}};
            const message = typeof error.response?.data?.err === 'string' ? error.response?.data?.err : 'Problema ao Valdar Cupom';
            return rejectWithValue(message)

        }

    }
)

export const buyNow = createAsyncThunk<
  IBuyNowProduct,
  IAddProductCart,
  { rejectValue: string }
>(
  "cart/buyNow",
  async ({ id_user: idUser, id_product: idProduct, size, qtd }: IAddProductCart, { rejectWithValue }) => {
    try {
      // Apenas busca os dados do produto
      const response = await api.get(`/product/${idProduct}`);
      
      return {
        id: Date.now(), // ID temporário
        id_user: idUser,
        id_product: idProduct,
        name: response.data.name,
        price: response.data.price,
        image: response.data.image,
        size,
        qtd
      };
    } catch (err) {
      const error = err as { response?: { data?: { err?: string } } };
      const message = typeof error.response?.data?.err === 'string' ? error.response?.data?.err : 'Problema ao Processar Compra';
      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        
        addQtdCart: (state, action) => {

            const id = action.payload.id
            const updatedQtdItems = action.payload.updatedQtdItems

            const qtd = updatedQtdItems.find((i: IProductCart) => i.id === id).qtd ?? 0
    
            const item = state.productsCart.find(item => item.id === id )

            if(item) {

                item.qtd = qtd
                
            }


        },

        addCoupom: (state,action) => {

            const coupon = action.payload

            state.coupon = coupon

        },

        deleteItem: (state,action) => {

            const id = action.payload

            const newProductsCart = state.productsCart.filter(products => products.id !== id)

            state.productsCart = newProductsCart
            

        },

        clearCart: (state) => {
            state.productsCart = [];
            state.error = null;
        },

        clearBuyNowProduct: (state) => {
            state.buyNowProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleListCart.pending, (state) => { 
                state.loading = true; 
            })
            .addCase(handleListCart.fulfilled, (state, action) => { 
                state.loading = false; 
                state.productsCart = action.payload; 
            })
            .addCase(handleListCart.rejected, (state, action) => { 
                state.loading = false; 
                state.error = action.payload as string; 
            })
            .addCase(fetchCart.pending, (state) => { 
                state.loading = true; 
            })
            .addCase(fetchCart.fulfilled, (state) => { 
                state.loading = false; 
                
            })
            .addCase(fetchCart.rejected, (state, action) => { 
                state.loading = false; 
                state.error = action.payload as string; 
            })

            .addCase(updateCart.pending, (state) => {

                state.loading = false

            })

            .addCase(updateCart.fulfilled, (state) => {

                state.loading = false

            })

            .addCase(updateCart.rejected, (state,action) => {

                state.loading = false
                state.error = action.payload as string
                
            })

            .addCase(deleteItemCart.pending, (state) => {

                state.loading = false

            })
            .addCase(deleteItemCart.fulfilled, (state) => {

                state.loading = false

            })
            .addCase(deleteItemCart.rejected, (state, action) => {

                state.loading = false
                state.error = action.payload as string

            })

            .addCase(checkCoupon.pending, (state) => {

                state.loading = false

            })

            .addCase(checkCoupon.fulfilled, (state, action) => {

                state.loading = false
                state.couponError = action.payload

            })

            .addCase(checkCoupon.rejected, (state, action) => {

                state.loading = false
                state.couponError = action.payload as string
            })

            .addCase(buyNow.pending, (state) => {
                state.loading = true;
            })
            .addCase(buyNow.fulfilled, (state, action) => {
                state.loading = false;
                state.buyNowProduct = action.payload;
            })
            .addCase(buyNow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

    }
});

export const {addQtdCart, addCoupom, clearCart, deleteItem, clearBuyNowProduct } = cartSlice.actions;
export default cartSlice.reducer;

