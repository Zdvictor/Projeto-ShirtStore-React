import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ICredentials } from '../../interfaces/user/credentials';
import { IUserData } from '../../interfaces/user/userData';
import { IUserProfile } from '../../interfaces/user/userProfile';
import { IUserRecovery } from '../../interfaces/recovery/userRecovery';
import { AuthState } from '../../interfaces/state/authState';
import { IUserVerifyCode } from '../../interfaces/recovery/userVerifyCode';
import { IUserChangePassword } from '../../interfaces/recovery/userChangePassword';
import { IUserValidateAccount } from '../../interfaces/recovery/validateAccount';
import { IUserAlterPassword } from '../../interfaces/recovery/alterPassword';
import { IUserUpdate } from '../../interfaces/user/userUpdate';

import { handleListCart } from './cartReducer';

const initialState: AuthState = {
  user: null,
  loading: true,
  loadingValidate: false,
  error: null,
};


// Action para verificar login quando entrar
export const checkedLogin = createAsyncThunk(
  'auth/checkedLogin',
  async (_, { rejectWithValue }) => {
    
    try {

      const response = await api.get<IUserProfile>('/my_profile');
      return response.data;

    } catch (err: unknown) {
      
      const errorMessage = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Erro desconhecido';
      return rejectWithValue(errorMessage);

    }
  }
);

// Action para login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: ICredentials, {dispatch ,rejectWithValue }) => {

    try {
      await api.post('/login', credentials);
      const response = await api.get<IUserProfile>('/my_profile');
      await dispatch(handleListCart(response.data.id))
      
      return response.data;

      

    } catch (err: unknown) {
      const error = err as { response?: { data?: { err?: string } } };
      console.log(error)
      return rejectWithValue(error.response?.data?.err  || 'Problema ao logar');
    }
  }
);

// Action para registro
export const register = createAsyncThunk(
  'auth/register',
  async (userData: IUserData, { rejectWithValue }) => {
    try {
      await api.post('/register', userData);
      const response = await api.get<IUserProfile>('/my_profile');
      return response.data;
    } catch (err: unknown) {

      const error = err as { response?: { data?: { err?: string } } };
      return rejectWithValue(error.response?.data?.err  || 'Problema ao Registrar');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (userData: IUserRecovery, { rejectWithValue }) => {
    try {
      await api.post('/recovery', userData);
      return
    } catch (err: unknown) {
      
      const error = err as { response?: { data?: { err?: string } } };
      return rejectWithValue(error.response?.data?.err || "Problema ao recuperar senha");
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, currentlyEmail, name, birthat, image }: IUserUpdate, { rejectWithValue }) => {
      try {

        if (image) {
          const formData = new FormData()
          formData.append('image', image)

          await api.post(`/upload_user/${id}`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          })
      }
      
          await api.put('/user', { name, currentlyEmail, birthat })

          const response = await api.get<IUserProfile>('/my_profile');
          return response.data;

      } catch (err: unknown) {
          const error = err as { response?: { data?: { err?: string } } };
          return rejectWithValue(error.response?.data?.err || 'Problema ao editar perfil');
      }
  }
);




export const verifyCode = createAsyncThunk(
  "auth/verifyCode", 
  
  async({code, email}: IUserVerifyCode, {rejectWithValue}) => {

    try {

      const response = await api.post("/verify_code", {code,email})

      return response.data
      
    }catch(err: unknown) {

      const error = err as {response? : {data?: {err?: string}} }

      return rejectWithValue(error.response?.data?.err || "Problema ao recuperar senha")

    }


  }

)
export const changePassword = createAsyncThunk(
  "auth/changePassword", 
  
  async(data: IUserChangePassword, {rejectWithValue}) => {

    try {

      const response = await api.put("/change_password", data)

      return response.data
      
    }catch(err: unknown) {

      const error = err as {response? : {data?: {err?: string}} }

      return rejectWithValue(error.response?.data?.err || "Problema ao trocar senha")

    }


  }

)

export const sendCodeForValidate = createAsyncThunk(
  "auth/sendCodeForValidate",
  async(email: string, {rejectWithValue}) => {

    try {

      const response = await api.post("/generate_code", {email})

      return response.data
      
    }catch(err: unknown) {

      const error = err as {response? : {data?: {err?: string}} }
      

      return rejectWithValue(error.response?.data?.err || "Problema ao enviar código de validação")

    }
  }

)


export const validateAccount = createAsyncThunk(
  "auth/validateAccount", 
  async({email, code, user}: IUserValidateAccount, { rejectWithValue }) => {
    try {
      const response = await api.post('/validate_account', {email, code,user})
      return response.data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { err?: string } } };
      return rejectWithValue(error.response?.data?.err || "Problema ao validar conta");
    }
  }

)
export const alterPassword = createAsyncThunk(
  "auth/alterPassword", 
  async({currentlyEmail, oldPassword, newPassword}: IUserAlterPassword, { rejectWithValue }) => {

    try {
      const response = await api.post('/alter_password', {currentlyEmail, oldPassword, newPassword})
      return response.data

    } catch (err: unknown) {
      const error = err as { response?: { data?: { err?: string } } };
      return rejectWithValue(error.response?.data?.err || "Problema ao alterar senha");
    }
  }

)



export const logout = createAsyncThunk(
  "auth/logout", 
  async(_, { rejectWithValue }) => {
    try {
      await api.post('/logout');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { err?: string } } };
      return rejectWithValue(error.response?.data?.err || "Problema ao deslogar");
    }
  }
)

const authSlice = createSlice({
  
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases para checkedLogin
      .addCase(checkedLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkedLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload as IUserProfile;
      })
      .addCase(checkedLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Cases para login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload as IUserProfile;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Cases para register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload as IUserProfile;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload as IUserProfile;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyCode.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;  
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(sendCodeForValidate.pending, (state) => {
        state.loading = true;
        state.error = null;  
      })

      .addCase(sendCodeForValidate.fulfilled, (state) => {
        state.loading = false;
        state.error = null
      })

      .addCase(sendCodeForValidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

      })

      .addCase(validateAccount.pending, (state) => {
        state.loadingValidate = true;
        state.error = null;  
      })  

      .addCase(validateAccount.fulfilled, (state) => {
        state.loadingValidate = false;
        state.error = null
        if(state.user) {

          state.user.hasValidated = true

        }
      })

      .addCase(validateAccount.rejected, (state, action) => {
        state.loadingValidate = false;
        state.error = action.payload as string;  
      })
      
      .addCase(alterPassword.pending, (state) => {

        state.loading = true;
        state.error = null;
        
      })

      .addCase(alterPassword.fulfilled, (state) => {

        state.loading = false;
        state.error = null;
      })

      .addCase( alterPassword.rejected, (state, action) => {

        state.loading = false;
        state.error = action.payload as string;

      })

      .addCase(logout.pending, (state) => {
        state.user = null;
        state.loading = true;  
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;  
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.loading = false;  
      })


  },
});

export default authSlice.reducer;
