import {/*applyMiddleware, compose,*/ combineReducers} from 'redux';
// import {legacy_createStore as createStore} from 'redux'
import {FilterValuesType, todolistsReducer, UnionTodolistsActionType} from '../components/Todolists/todolists-reducer';
import {tasksReducer, UnionTasksActionType} from '../components/Todolists/tasks-reducer';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {appReducer, RequestStatusType, UnionAppActionsType} from './app-reducer';
import {authReducer, UnionAuthActionsType} from '../components/Login/auth-reducer';
import {configureStore, MiddlewareArray, PayloadAction} from '@reduxjs/toolkit';
import {TaskType, TodolistType, UpdateTaskModelType} from '../api/api';

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

type PayloadTypes = RequestStatusType
    | boolean
    | null
    | string
    | TodolistType
    | { id: string, filter: FilterValuesType }
    | { id: string, title: string }
    | { id: string, entityStatus: RequestStatusType }
    | Array<TodolistType>
    | { todolistId: string, taskId: string }
    | TaskType
    | { todolistId: string, taskId: string, isDone: boolean }
    | { todolistId: string, taskId: string, entityStatus: RequestStatusType }
    | { todolistId: string, taskId: string, title: string }
    | { todolistId: string, tasks: TaskType[] }
    | { todolistId: string, taskId: string, model: UpdateTaskModelType }

// export type AppActionsType = PayloadAction<PayloadTypes>
export type AppActionsType =
    UnionAppActionsType
    | UnionAuthActionsType
    | UnionTasksActionType
    | UnionTodolistsActionType

// export type AppDispatch = typeof store.dispatch
export type AppDispatch = ThunkDispatch<AppStateType, unknown, AppActionsType>
// export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, AppActionsType>

// @ts-ignore
window.store = store