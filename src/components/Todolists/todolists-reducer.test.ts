// export const todolistsReducerTest = 0

import {v1} from 'uuid';
import {TodolistType} from '../../api/api';
import {
    addTodolist,
    removeTodolist,
    changeTodolistTitle,
    changeFilter,
    todolistsReducer, TodolistDomainType, FilterValuesType
} from './todolists-reducer';
// import {FilterValuesType, TodolistType} from '../App';

let todoId1: string;
let todoId2: string;

let startState: Array<TodolistDomainType> = []

beforeEach(() => {
    todoId1 = v1();
    todoId2 = v1();

    startState = [
        {id: todoId1, title: 'What to learn', addedDate: '', order: 0, filter: 'all', entityStatus: 'idle'},
        {id: todoId2, title: 'What to buy', addedDate: '', order: 1, filter: 'all', entityStatus: 'idle'}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolist(todoId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoId2);
});

test('correct todolist should be added', () => {

    let newTodolistTitle = 'New Todolist';
    const newTodo: TodolistType = {
        id: '4',
        title: newTodolistTitle,
        addedDate: '',
        order: 0
    }

    const endState = todolistsReducer(startState, addTodolist(newTodo))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = 'New Todolist';

    /*const action = {
        type: 'CHANGE-TODOLIST-TITLE',
        id: todolistId2,
        title: newTodolistTitle
    };*/

    const endState = todolistsReducer(startState, changeTodolistTitle({id: todoId2, title: newTodolistTitle}));

    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = 'completed';

    /*const action = {
        type: 'CHANGE-TODOLIST-FILTER',
        id: todolistId2,
        filter: newFilter
    };*/

    const endState = todolistsReducer(startState, changeFilter({id: todoId2, filter: newFilter}));

    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe(newFilter);
});
