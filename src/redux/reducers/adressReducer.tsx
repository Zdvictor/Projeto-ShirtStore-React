import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import api from "../../services/api"
import { AdressState } from "../../interfaces/adress/adressState"
import { IAdressRegister } from "../../interfaces/adress/adressRegister"
import { checkedLogin } from "./authReducer"



const initialState: AdressState = {

    loading: false,
    error: null

}

export const registerAdress = createAsyncThunk(
    "adress/registerAdress",
    async({id, cep, number, neighborhood, street, city, state}: IAdressRegister, {dispatch, rejectWithValue}) => {

        try {

            await api.post("/adress", {id, cep, number, neighborhood, street, city, state})

            await dispatch(checkedLogin()).unwrap()
            
            return true


        }catch(err: unknown) {


            const error = err as { response?: { data?: { err?: string } } };

            return rejectWithValue(error.response?.data?.err || "Problema ao registrar endereço")
        }

    }
)

export const editAdress = createAsyncThunk(
    "adress/editAdress",
    async({id, cep, number, neighborhood, street, city, state}: IAdressRegister, {dispatch, rejectWithValue}) => {

        try {

            await api.put("/adress", {id, cep, number, neighborhood, street, city, state})

            await dispatch(checkedLogin()).unwrap()
            
            return true



        }catch(err: unknown) {


            const error = err as { response?: { data?: { err?: string } } };

            return rejectWithValue(error.response?.data?.err || "Problema ao registrar endereço")
        }

    }
)


const adressSlice = createSlice({

    name: 'adress',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder

        .addCase(registerAdress.pending, (state) => {

            state.loading = true;
            state.error = null; 

        })

        .addCase(registerAdress.fulfilled , (state) => {

            state.loading = false;
            state.error = null;
        })

        .addCase(registerAdress.rejected, (state, action) => {

            state.loading = false;
            state.error = action.payload as string
        })

        .addCase(editAdress.pending, (state) => {

            state.loading = true;
            state.error = null; 

        })

        .addCase(editAdress.fulfilled , (state) => {

            state.loading = false;
            state.error = null;
        })

        .addCase(editAdress.rejected, (state, action) => {

            state.loading = false;
            state.error = action.payload as string
        })

    }

})

export default adressSlice.reducer


