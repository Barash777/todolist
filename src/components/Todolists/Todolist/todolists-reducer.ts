import {todolistApi, TodolistType} from '../../../api/api';
import {AppThunk} from '../../../state/store';
import {RequestStatusType, setAppStatusAC} from '../../../app/app-reducer';
import {checkWithResultCode, errorUtils} from '../../../common/utils/error-utils';

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
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(e => e.id === action.payload.id ? {...e, entityStatus: action.payload.entityStatus} : e)
        case 'SET-TODOLISTS':
            return action.payload.todolists.map(t => {
                return {...t, filter: 'all', entityStatus: 'idle'}
            })
        default:
            return state
    }
}

export type UnionTodolistsActionType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeFilterActionType |
    ChangeTodolistTitleActionType |
    SetTodolistsActionType |
    ChangeTodolistEntityStatusActionType

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeFilterActionType = ReturnType<typeof changeFilterAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>


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
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => {
    return {
        type: 'CHANGE-TODOLIST-ENTITY-STATUS',
        payload: {
            id,
            entityStatus
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
    todolistApi
        .getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistApi
        .createTodolist(title)
        .then(res => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(addTodolistAC(res.data.data.item))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
}
export const removeTodolistTC = (id: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(id, 'loading'))
    todolistApi
        .deleteTodolist(id)
        .then((res) => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(removeTodolistAC(id))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
            dispatch(changeTodolistEntityStatusAC(id, 'failed'))
        })
}
export const updateTodolistTC = (id: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(id, 'loading'))
    todolistApi
        .updateTodolist(id, title)
        .then((res) => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(changeTodolistTitleAC(id, title))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
        .finally(() => {
            dispatch(changeTodolistEntityStatusAC(id, 'idle'))
        })
}