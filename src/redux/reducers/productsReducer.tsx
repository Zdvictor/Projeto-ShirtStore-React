import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IProducts } from "../../interfaces/products/products";
import api from "../../services/api";

interface IProductReducer {

    allProducts: IProducts[],
    bestOffersProducts: IProducts[],
    lendaryJerseysProducts: IProducts[],
    loading: boolean,
    error: null | string

}

const initialState: IProductReducer = {

    allProducts: [],
    bestOffersProducts: [],
    lendaryJerseysProducts: [],
    loading: false,
    error: null

}


export const fetchAllProducts = createAsyncThunk(
    "products/fetchAllProducts",
    async (_, {rejectWithValue}) => {

        try {

            const response = await api.get("/products")
            console.log(response.data)
            return response.data

        }catch(err: unknown) {

            const error = err as { response?: { data?: { err?: string } } };
            return rejectWithValue(error.response?.data?.err || 'Não foi possível conectar ao servidor.');

        }

    }
)

export const fetchBestOffersProducts = createAsyncThunk(
    "products/fetchBestOffersProducts",
    async (_, {rejectWithValue}) => {

        try {

            const response = await api.get("/best_offers")
            console.log(response.data)
            return response.data

        }catch(err: unknown) {

            const error = err as { response?: { data?: { err?: string } } };
            return rejectWithValue(error.response?.data?.err || 'Não foi possível conectar ao servidor.');

        }

    }
)
export const fetchLendaryJerseysProducts = createAsyncThunk(
    "products/fetchLendaryJerseysProducts",
    async (_, {rejectWithValue}) => {

        try {

            const response = await api.get("/lendary_jerseys")

            return response.data

        }catch(err: unknown) {

            const error = err as { response?: { data?: { err?: string } } };
            return rejectWithValue(error.response?.data?.err || 'Não foi possível conectar ao servidor.');

        }

    }
)


const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // fetchAllProducts
        .addCase(fetchAllProducts.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAllProducts.fulfilled, (state, action) => {
          state.allProducts = action.payload;
          state.loading = false;
        })
        .addCase(fetchAllProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string | null;
        })
  
        // fetchBestOffersProducts
        .addCase(fetchBestOffersProducts.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchBestOffersProducts.fulfilled, (state, action) => {
          state.bestOffersProducts = action.payload;
          state.loading = false;
        })
        .addCase(fetchBestOffersProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string | null ;
        })
  
        // fetchLendaryJerseysProducts
        .addCase(fetchLendaryJerseysProducts.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchLendaryJerseysProducts.fulfilled, (state, action) => {
          state.lendaryJerseysProducts = action.payload;
          state.loading = false;
        })
        .addCase(fetchLendaryJerseysProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string | null;
        });
    },
  });
  
  export default productsSlice.reducer;