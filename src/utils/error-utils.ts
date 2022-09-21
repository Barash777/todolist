import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../app/app-reducer'
import {Dispatch} from 'redux'
import {ResponseType} from '../api/api'
import axios, {AxiosError, AxiosResponse} from 'axios';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}

export const errorUtils = (e: Error | AxiosError<{ error: string }>, dispatch: ErrorUtilsDispatchType) => {
    const err = e as Error | AxiosError<{ error: string }>
    if (axios.isAxiosError(err)) {
        const error = err.response?.data ? err.response.data.error : err.message
        dispatch(setAppErrorAC(error))
    } else {
        dispatch(setAppErrorAC(`Native error ${err.message}`))
    }
    dispatch(setAppStatusAC('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorActionType | SetAppStatusActionType>

export const checkWithResultCode = (res: AxiosResponse, dispatch: ErrorUtilsDispatchType, fn: any) => {
    if (res.data.resultCode === 0) {
        fn()
        dispatch(setAppStatusAC('succeeded'))
    } else {
        if (res.data.messages.length) {
            dispatch(setAppErrorAC(res.data.messages[0]))
        } else {
            dispatch(setAppErrorAC('Some error occurred'))
        }
        dispatch(setAppStatusAC('failed'))
    }
}