import {Provider} from 'react-redux';
import React from 'react';
import {combineReducers, legacy_createStore as createStore} from 'redux';
import {todolistsReducer} from '../state/todolists-reducer';
import {tasksReducer,} from '../state/tasks-reducer';
import {v1} from 'uuid';
import {AppStateType} from '../state/store';

/*export const testTodolist = {
    id: '1',
    title: 'test todolist',
    filter: 'all' as FilterValuesType
}
export const testTask = {
    id: '1', title: 'test task', isDone: false
}*/


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all'},
        {id: 'todolistId2', title: 'What to buy', filter: 'all'}
    ],
    tasks: {
        ['todolistId1']: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true}
        ],
        ['todolistId2']: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'React Book', isDone: true}
        ]
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppStateType)

export const DecoratorProvider = (Story: React.ElementType) => (
    <Provider store={storyBookStore}>
        <Story/>
    </Provider>
)