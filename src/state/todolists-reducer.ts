import {todolistsAPI, TodolistType} from '../api/todolists-api';
import {AppThunk} from './store';

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: UnionTodolistsActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.id)
        case 'ADD-TODOLIST':
            return [{
                ...action.payload.todolist,
                filter: 'all'
            }, ...state]
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(e => e.id === action.payload.id ? {...e, filter: action.payload.filter} : e)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(e => e.id === action.payload.id ? {...e, title: action.payload.title} : e)
        case 'SET-TODOLISTS':
            return action.payload.todolists.map(t => {
                return {...t, filter: 'all'}
            })
        default:
            return state
    }
}

export type UnionTodolistsActionType =
    RemoveTodolistACType |
    AddTodolistACType |
    ChangeFilterACType |
    ChangeTodolistTitleACType |
    SetTodolistsACType

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export type ChangeFilterACType = ReturnType<typeof changeFilterAC>
export type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>


export const removeTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id
        }
    } as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            todolist
        }
    } as const
}
export const changeFilterAC = (id: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            id,
            filter
        }
    } as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            id,
            title
        }
    } as const
}
export const setTodolistsAC = (todolists: Array<TodolistType>) => {
    return {
        type: 'SET-TODOLISTS',
        payload: {
            todolists
        }
    } as const
}


// THUNKS
export const getTodolistsTC = (): AppThunk => (dispatch) => {
    todolistsAPI
        .getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    todolistsAPI
        .createTodolist(title)
        .then(res => {
            dispatch(addTodolistAC(res.data.data.item))
        })
}
export const removeTodolistTC = (id: string): AppThunk => (dispatch) => {
    todolistsAPI
        .deleteTodolist(id)
        .then(res => {
            dispatch(removeTodolistAC(id))
        })
}
export const updateTodolistTC = (id: string, title: string): AppThunk => (dispatch) => {
    todolistsAPI
        .updateTodolist(id, title)
        .then(res => {
            dispatch(changeTodolistTitleAC(id, title))
        })
}