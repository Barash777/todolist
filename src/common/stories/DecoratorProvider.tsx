import {Provider} from 'react-redux';
import React from 'react';
import {combineReducers} from 'redux';
import {todolistsReducer} from '../../components/Todolists/todolists-reducer';
import {tasksReducer,} from '../../components/Todolists/tasks-reducer';
import {AppStateType} from '../../app/store';
import {TaskPriorities, TaskStatuses} from '../../api/api';
import {appReducer, RequestStatusType} from '../../app/app-reducer';
import {authReducer} from '../../components/Login/auth-reducer';
import {configureStore, MiddlewareArray} from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

let todoId1 = 'todolistId1'
let todoId2 = 'todolistId2'

const initialGlobalState = {
    todolists: [
        {id: todoId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: todoId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}
    ],
    tasks: {
        [todoId1]: [
            {
                id: '1',
                title: 'CSS',
                description: '',
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 0,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '2',
                title: 'JS',
                description: '',
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 1,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '3',
                title: 'React',
                description: '',
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 2,
                addedDate: '',
                entityStatus: 'idle'
            }
        ],
        [todoId2]: [
            {
                id: '1',
                title: 'bread',
                description: '',
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 0,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '2',
                title: 'milk',
                description: '',
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 1,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '3',
                title: 'tea',
                description: '',
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 2,
                addedDate: '',
                entityStatus: 'idle'
            }
        ]
    },
    app: {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        success: null as null | string,
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
}

// export const storyBookStore = createStore(rootReducer, initialGlobalState as AppStateType)
export const storyBookStore = configureStore({
    reducer: rootReducer,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
    middleware: new MiddlewareArray().concat(thunkMiddleware),
    preloadedState: initialGlobalState as AppStateType
})


export const DecoratorProvider = (Story: React.ElementType) => (
    <Provider store={storyBookStore}>
        <Story/>
    </Provider>
)