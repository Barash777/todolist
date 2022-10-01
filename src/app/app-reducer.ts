import {authApi} from '../api/api';
import {checkWithResultCode, errorUtils} from '../common/utils/error-utils';
import {setIsLoggedIn} from '../components/Login/auth-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

// thunk
export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI

    dispatch(setAppStatus('loading'))
    try {
        let res = await authApi.me()
        if (checkWithResultCode(res, dispatch, () => {
            dispatch(setIsLoggedIn(true))
        })) {
            return true
        } else {
            return rejectWithValue(res)
        }
    } catch (e: any) {
        errorUtils(e, dispatch)
        return rejectWithValue(e)
    }
})

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    success: null as null | string,
    isInitialized: false
}

const appSlice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatus(state, action: PayloadAction<RequestStatusType>) {
            state.status = action.payload
        },
        setAppError(state, action: PayloadAction<null | string>) {
            state.error = action.payload
        },
        setAppSuccess(state, action: PayloadAction<null | string>) {
            state.success = action.payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(initializeAppTC.fulfilled, (state) => {
                state.isInitialized = true
            })
            .addCase(initializeAppTC.rejected, (state) => {
                state.isInitialized = true
            })
    }
})

export const appReducer = appSlice.reducer;
export const {setAppStatus, setAppError, setAppSuccess} = appSlice.actions

// types
export type UnionAppActionsType = SetAppStatusActionType
    | SetAppErrorActionType
    | SetAppSuccessActionType
export type SetAppStatusActionType = ReturnType<typeof setAppStatus>
export type SetAppErrorActionType = ReturnType<typeof setAppError>
export type SetAppSuccessActionType = ReturnType<typeof setAppSuccess>



