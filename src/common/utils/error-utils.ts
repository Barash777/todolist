import {setAppError, SetAppErrorActionType, setAppStatus, SetAppStatusActionType} from '../../app/app-reducer'
import {Dispatch} from 'redux'
import {ResponseType} from '../../api/api'
import axios, {AxiosError, AxiosResponse} from 'axios';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError('Some error occurred'))
    }
    dispatch(setAppStatus('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppError(error.message))
    dispatch(setAppStatus('failed'))
}

export const errorUtils = (e: Error | AxiosError<{ error: string }>, dispatch: ErrorUtilsDispatchType) => {
    const err = e as Error | AxiosError<{ error: string }>
    if (axios.isAxiosError(err)) {
        const error = err.response?.data ? err.response.data.error : err.message
        dispatch(setAppError(error))
    } else {
        dispatch(setAppError(`Native error ${err.message}`))
    }
    dispatch(setAppStatus('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorActionType | SetAppStatusActionType>

export const checkWithResultCode = (res: AxiosResponse, dispatch: ErrorUtilsDispatchType, fn: () => void) => {
    if (res.data.resultCode === 0) {
        fn()
        dispatch(setAppStatus('succeeded'))
    } else {
        if (res.data.messages.length) {
            dispatch(setAppError(res.data.messages[0]))
        } else {
            dispatch(setAppError('Some error occurred'))
        }
        dispatch(setAppStatus('failed'))
    }
}