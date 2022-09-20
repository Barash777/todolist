import {todolistsAPI, TodolistType} from '../api/todolists-api';
import {AppThunk} from './store';
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from '../app/app-reducer';

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: UnionTodolistsActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.id)
        case 'ADD-TODOLIST':
            return [{
                ...action.payload.todolist,
                filter: 'all',
                entityStatus: 'idle'
            }, ...state]
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(e => e.id === action.payload.id ? {...e, filter: action.payload.filter} : e)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(e => e.id === action.payload.id ? {...e, title: action.payload.title} : e)
        case 'SET-TODOLISTS':
            return action.payload.todolists.map(t => {
                return {...t, filter: 'all', entityStatus: 'idle'}
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
    dispatch(setAppStatusAC('loading'))
    todolistsAPI
        .getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI
        .createTodolist(title)
        /*.then(res => {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        })*/
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppErrorAC(res.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC('Some error occurred'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        })
}
export const removeTodolistTC = (id: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI
        .deleteTodolist(id)
        .then(() => {
            dispatch(removeTodolistAC(id))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const updateTodolistTC = (id: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI
        .updateTodolist(id, title)
        .then(() => {
            dispatch(changeTodolistTitleAC(id, title))
            dispatch(setAppStatusAC('succeeded'))
        })
}