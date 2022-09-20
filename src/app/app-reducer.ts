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
            return {...state, ...action.payload}
        default:
            return state
    }
}

// types
export type UnionAppActionsType = SetAppStatusAC
type SetAppStatusAC = ReturnType<typeof setAppStatusAC>

// ACs
export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        payload: {
            status
        }
    }
}