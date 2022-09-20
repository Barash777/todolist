export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    success: null as null | string
}

type AppInitialStateType = typeof initialState

export const appReducer = (state: AppInitialStateType = initialState, action: UnionAppActionsType): AppInitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
        case 'APP/SET-ERROR':
        case 'APP/SET-SUCCESS':
            return {...state, ...action.payload}
        default:
            return state
    }
}

// types
export type UnionAppActionsType = SetAppStatusAC
    | SetAppErrorAC
    | SetAppSuccessAC
type SetAppStatusAC = ReturnType<typeof setAppStatusAC>
type SetAppErrorAC = ReturnType<typeof setAppErrorAC>
type SetAppSuccessAC = ReturnType<typeof setAppSuccessAC>

// ACs
export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        payload: {
            status
        }
    }
}
export const setAppErrorAC = (error: string | null) => {
    return {
        type: 'APP/SET-ERROR',
        payload: {
            error
        }
    }
}
export const setAppSuccessAC = (success: string | null) => {
    return {
        type: 'APP/SET-SUCCESS',
        payload: {
            success
        }
    }
}