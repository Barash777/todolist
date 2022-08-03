import {combineReducers, compose, Store} from 'redux';
import {legacy_createStore as createStore} from 'redux'
import {todolistsReducer} from './todolists-reducer';
import {tasksReducer} from './tasks-reducer';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

export const rootReducer = combineReducers({
        todolists: todolistsReducer,
        tasks: tasksReducer
    }
)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store: Store<AppStateType> = createStore(rootReducer, composeEnhancers());
// export const store = createStore(rootReducer)
export type AppStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store