import {setAppStatusAC} from '../../app/app-reducer'
import {authApi, LoginParamsType} from '../../api/api';
import {checkWithResultCode, errorUtils} from '../../common/utils/error-utils';
import {AppThunk} from '../../state/store';

const initialState = {
    isLoggedIn: false
}
type AuthInitialStateType = typeof initialState

export const authReducer = (state: AuthInitialStateType = initialState, action: UnionAuthActionsType): AuthInitialStateType => {
    switch (action.type) {
        case 'AUTH/SET-IS-LOGGED-IN':
            return {...state, ...action.payload}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (isLoggedIn: boolean) => {
    return {
        type: 'AUTH/SET-IS-LOGGED-IN',
        payload: {
            isLoggedIn
        }
    } as const
}

// thunks
export const loginTC = (data: LoginParamsType): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authApi.login(data)
        .then((res) => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(setIsLoggedInAC(true))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
}
export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authApi.logout()
        .then(res => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(setIsLoggedInAC(false))
            })
        })
        .catch((e) => {
            errorUtils(e, dispatch)
        })
}


// types
export type UnionAuthActionsType = SetIsLoggedInActionType
type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>
