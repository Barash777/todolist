import {FilterValuesType, TodolistType} from '../App';
import {v1} from 'uuid';

export const todolistsReducer = (state: Array<TodolistType>, action: UnionTodolistACType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.id)
        case 'ADD-TODOLIST':
            const newTodolistId = v1();
            const newTodolist: TodolistType = {id: newTodolistId, title: action.payload.title, filter: 'all'};
            return [...state, newTodolist];
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(e => e.id === action.payload.id ? {...e, filter: action.payload.filter} : e)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(e => e.id === action.payload.id ? {...e, title: action.payload.title} : e)
        default:
            return state
    }
}

export type UnionTodolistACType = RemoveTodolistACType | AddTodolistACType |
    ChangeFilterACType | ChangeTodolistTitleACType

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id
        }
    } as const
}

export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export const addTodolistAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            title
        }
    } as const
}

export type ChangeFilterACType = ReturnType<typeof changeFilterAC>
export const changeFilterAC = (id: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            id,
            filter
        }
    } as const
}

export type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            id,
            title
        }
    } as const
}