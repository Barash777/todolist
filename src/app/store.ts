import {/*applyMiddleware, compose,*/ combineReducers} from 'redux';
// import {legacy_createStore as createStore} from 'redux'
import {todolistsReducer, UnionTodolistsActionType} from '../components/Todolists/todolists-reducer';
import {tasksReducer, UnionTasksActionType} from '../components/Todolists/tasks-reducer';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {appReducer, RequestStatusType} from './app-reducer';
import {authReducer} from '../components/Login/auth-reducer';
import {configureStore, MiddlewareArray, PayloadAction} from '@reduxjs/toolkit';

/*declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;*/

export const rootReducer = combineReducers({
        todolists: todolistsReducer,
        tasks: tasksReducer,
        app: appReducer,
        auth: authReducer
    }
)

// export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)))
export const store = configureStore({
    reducer: rootReducer,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
    middleware: new MiddlewareArray().concat(thunkMiddleware),
})


export type AppStateType = ReturnType<typeof rootReducer>
/*// type two = ReturnType<typeof appSlice.actions>
type three = ReturnType<typeof appSlice.actions.setAppError>

console.log('1', typeof appSlice.actions)
// console.log('2', two)
console.log('3', three)*/


export type MyAppActionsType = {
    payload: RequestStatusType | boolean | null | string
    type: string
}

type PayloadTypes = RequestStatusType | boolean | null | string

export type AppActionsType = UnionTodolistsActionType
    | UnionTasksActionType
    | PayloadAction<PayloadTypes>
// | UnionAppActionsType
// | UnionAuthActionsType

// export type AppDispatch = typeof store.dispatch
export type AppDispatch = ThunkDispatch<AppStateType, unknown, AppActionsType>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, AppActionsType>

// @ts-ignore
window.store = store