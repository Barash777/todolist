import {Provider} from 'react-redux';
import React from 'react';
import {combineReducers, legacy_createStore as createStore} from 'redux';
import {todolistsReducer} from '../../components/Todolists/todolists-reducer';
import {tasksReducer,} from '../../components/Todolists/tasks-reducer';
import {v1} from 'uuid';
import {AppStateType} from '../../app/store';

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
    /*todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0}
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
    }*/
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppStateType)

export const DecoratorProvider = (Story: React.ElementType) => (
    <Provider store={storyBookStore}>
        <Story/>
    </Provider>
)