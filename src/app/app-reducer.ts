import {authApi} from '../api/api';
import {AppThunk} from './store';
import {checkWithResultCode, errorUtils} from '../common/utils/error-utils';
import {setIsLoggedIn} from '../components/Login/auth-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    success: null as null | string,
    isInitialized: false
}

// type AppInitialStateType = typeof initialState

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
        setAppIsInitialized(state, action: PayloadAction<boolean>) {
            state.isInitialized = action.payload
        }
    }
})

export const appReducer = appSlice.reducer;
export const {setAppStatus, setAppError, setAppSuccess, setAppIsInitialized} = appSlice.actions

/*export const appReducer = (state: AppInitialStateType = initialState, action: UnionAppActionsType): AppInitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
        case 'APP/SET-ERROR':
        case 'APP/SET-SUCCESS':
        case 'APP/SET-IS-INITIALIZED':
            return {...state, ...action.payload}
        default:
            return state
    }
}*/

// types
export type UnionAppActionsType = SetAppStatusActionType
    | SetAppErrorActionType
    | SetAppSuccessActionType
    | SetAppIsInitializedActionType
export type SetAppStatusActionType = ReturnType<typeof setAppStatus>
export type SetAppErrorActionType = ReturnType<typeof setAppError>
export type SetAppSuccessActionType = ReturnType<typeof setAppSuccess>
export type SetAppIsInitializedActionType = ReturnType<typeof setAppIsInitialized>

/*// ACs
export const setAppStatus = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        payload: {
            status
        }
    } as const
}
export const setAppError = (error: string | null) => {
    return {
        type: 'APP/SET-ERROR',
        payload: {
            error
        }
    } as const
}
export const setAppSuccess = (success: string | null) => {
    return {
        type: 'APP/SET-SUCCESS',
        payload: {
            success
        }
    } as const
}
export const setAppIsInitialized = (isInitialized: boolean) => {
    return {
        type: 'APP/SET-IS-INITIALIZED',
        payload: {
            isInitialized
        }
    } as const
}*/

// thunk
export const initializeAppTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    authApi.me()
        .then(res => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(setIsLoggedIn(true))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
        .finally(() => {
            dispatch(setAppIsInitialized(true))
        })
}
