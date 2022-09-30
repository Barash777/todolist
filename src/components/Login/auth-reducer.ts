import {setAppStatus, setAppSuccess} from '../../app/app-reducer'
import {authApi, LoginParamsType} from '../../api/api';
import {checkWithResultCode, errorUtils} from '../../common/utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setTodolists} from '../Todolists/todolists-reducer';

const initialState = {
    isLoggedIn: false
}

export const loginTC = createAsyncThunk('auth/login', (data: LoginParamsType, thunkAPI) => {
    const {dispatch} = thunkAPI

    dispatch(setAppStatus('loading'))
    return authApi.login(data)
        .then((res) => {
            if (checkWithResultCode(res, dispatch, () => {
                // dispatch(setIsLoggedIn(true))
                dispatch(setAppSuccess('You are successfully login'))
            })) {
                return true
            } else {
                return thunkAPI.rejectWithValue(res)
            }
        })
        .catch(e => {
            errorUtils(e, dispatch)
            return thunkAPI.rejectWithValue(e)
        })
})
export const logoutTC = createAsyncThunk('auth/logout', (arg, thunkAPI) => {
    const {dispatch} = thunkAPI

    dispatch(setAppStatus('loading'))
    return authApi.logout()
        .then(res => {
            if (checkWithResultCode(res, dispatch, () => {
                // dispatch(setIsLoggedIn(false))
                dispatch(setTodolists([]))
                dispatch(setAppSuccess('You are successfully logout'))
            })) {
                return false;
            } else {
                return thunkAPI.rejectWithValue(res)
            }
        })
        .catch((e) => {
            errorUtils(e, dispatch)
            return thunkAPI.rejectWithValue(e)
        })
})


const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<boolean>) {
            state.isLoggedIn = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginTC.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload
            })
            .addCase(logoutTC.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload
            })
    }
})

// get reducer
export const authReducer = authSlice.reducer;
// get AC
export const {setIsLoggedIn} = authSlice.actions

// thunks
/*export const loginTC_ = (data: LoginParamsType): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    authApi.login(data)
        .then((res) => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(setIsLoggedIn(true))
                dispatch(setAppSuccess('You are successfully login'))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
}*/
/*export const logoutTC_ = (): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    authApi.logout()
        .then(res => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(setIsLoggedIn(false))
                dispatch(setAppSuccess('You are successfully logout'))
            })
        })
        .catch((e) => {
            errorUtils(e, dispatch)
        })
}*/


// types
export type UnionAuthActionsType = SetIsLoggedInActionType
type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedIn>
