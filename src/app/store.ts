import {applyMiddleware, combineReducers, compose} from 'redux';
import {legacy_createStore as createStore} from 'redux'
import {todolistsReducer, UnionTodolistsActionType} from '../components/Todolists/todolists-reducer';
import {tasksReducer, UnionTasksActionType} from '../components/Todolists/tasks-reducer';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {appReducer, UnionAppActionsType} from './app-reducer';
import {authReducer, UnionAuthActionsType} from '../components/Login/auth-reducer';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

export const rootReducer = combineReducers({
        todolists: todolistsReducer,
        tasks: tasksReducer,
        app: appReducer,
        auth: authReducer
    }
)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// export const store: Store<AppStateType> = createStore(rootReducer, composeEnhancers());
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)))
// export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))
// export const store = createStore(rootReducer)
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