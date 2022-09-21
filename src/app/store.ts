import {/*applyMiddleware, compose,*/ combineReducers} from 'redux';
// import {legacy_createStore as createStore} from 'redux'
import {todolistsReducer, UnionTodolistsActionType} from '../components/Todolists/todolists-reducer';
import {tasksReducer, UnionTasksActionType} from '../components/Todolists/tasks-reducer';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {appReducer, UnionAppActionsType} from './app-reducer';
import {authReducer, UnionAuthActionsType} from '../components/Login/auth-reducer';
import {configureStore} from '@reduxjs/toolkit';

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
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
})

export type AppStateType = ReturnType<typeof rootReducer>

export type AppActionsType = UnionTodolistsActionType
    | UnionTasksActionType
    | UnionAppActionsType
    | UnionAuthActionsType
// export type AppDispatch = typeof store.dispatch
export type AppDispatch = ThunkDispatch<AppStateType, unknown, AppActionsType>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, AppActionsType>

// @ts-ignore
window.store = store