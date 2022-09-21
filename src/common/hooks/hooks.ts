import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {AppStateType, AppDispatch} from '../../state/store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppStateType> = useSelector