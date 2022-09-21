import {authApi} from '../api/api';
import {AppThunk} from '../state/store';
import {checkWithResultCode, errorUtils} from '../utils/error-utils';
import {setIsLoggedInAC} from '../components/Login/auth-reducer';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    success: null as null | string,
    isInitialized: false
}

type AppInitialStateType = typeof initialState

export const appReducer = (state: AppInitialStateType = initialState, action: UnionAppActionsType): AppInitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
        case 'APP/SET-ERROR':
        case 'APP/SET-SUCCESS':
        case 'APP/SET-IS-INITIALIZED':
            return {...state, ...action.payload}
        default:
            return state
    }
}

// types
export type UnionAppActionsType = SetAppStatusActionType
    | SetAppErrorActionType
    | SetAppSuccessActionType
    | SetAppIsInitializedActionType
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppSuccessActionType = ReturnType<typeof setAppSuccessAC>
export type SetAppIsInitializedActionType = ReturnType<typeof setAppIsInitializedAC>

// ACs
export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        payload: {
            status
        }
    } as const
}
export const setAppErrorAC = (error: string | null) => {
    return {
        type: 'APP/SET-ERROR',
        payload: {
            error
        }
    } as const
}
export const setAppSuccessAC = (success: string | null) => {
    return {
        type: 'APP/SET-SUCCESS',
        payload: {
            success
        }
    } as const
}
export const setAppIsInitializedAC = (isInitialized: boolean) => {
    return {
        type: 'APP/SET-IS-INITIALIZED',
        payload: {
            isInitialized
        }
    } as const
}

// thunk
export const initializeAppTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authApi.me()
        .then(res => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(setIsLoggedInAC(true))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
        .finally(() => {
            dispatch(setAppIsInitializedAC(true))
        })
}
