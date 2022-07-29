import {combineReducers} from 'redux';
import {legacy_createStore as createStore} from 'redux'
import {todolistsReducer} from './todolists-reducer';
import {tasksReducer} from './tasks-reducer';


export const rootReducer = combineReducers({
        todolists: todolistsReducer,
        tasks: tasksReducer
    }
)

export const store = createStore(rootReducer)
export type AppStateType = ReturnType<typeof rootReducer>

// @ts-ignore
// window.store = store