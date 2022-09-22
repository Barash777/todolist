import {setAppStatus, setAppSuccess} from '../../app/app-reducer'
import {authApi, LoginParamsType} from '../../api/api';
import {checkWithResultCode, errorUtils} from '../../common/utils/error-utils';
import {AppThunk} from '../../app/store';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false
}


const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<boolean>) {
            state.isLoggedIn = action.payload
        }
    }
})

// get reducer
export const authReducer = authSlice.reducer;
// get AC
export const {setIsLoggedIn} = authSlice.actions

// thunks
export const loginTC = (data: LoginParamsType): AppThunk => (dispatch) => {
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
}
export const logoutTC = (): AppThunk => (dispatch) => {
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
}


// types
export type UnionAuthActionsType = SetIsLoggedInActionType
type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedIn>
