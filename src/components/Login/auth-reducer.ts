import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {authApi, LoginParamsType} from '../../api/api';
import {checkWithResultCode, errorUtils} from '../../utils/error-utils';
import {AppThunk} from '../../state/store';

const initialState = {
    isLoggedIn: false
}
type AuthInitialStateType = typeof initialState

export const authReducer = (state: AuthInitialStateType = initialState, action: AuthActionsType): AuthInitialStateType => {
    switch (action.type) {
        case 'LOGIN/SET-IS-LOGGED-IN':
            return {...state, ...action.payload}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (isLoggedIn: boolean) => {
    return {
        type: 'LOGIN/SET-IS-LOGGED-IN',
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
                alert('YO')
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
}

// types
type AuthActionsType =
    SetIsLoggedInActionType
    | SetAppStatusActionType
    | SetAppErrorActionType
type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>
