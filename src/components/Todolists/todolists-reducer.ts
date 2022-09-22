import {todolistApi, TodolistType} from '../../api/api';
import {AppThunk} from '../../app/store';
import {RequestStatusType, setAppStatus, setAppSuccess} from '../../app/app-reducer';
import {checkWithResultCode, errorUtils} from '../../common/utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const todolistSlice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolist(state, action: PayloadAction<string>) {
            const index = state.findIndex(tl => tl.id === action.payload)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolist(state, action: PayloadAction<TodolistType>) {
            state.unshift({
                ...action.payload,
                filter: 'all',
                entityStatus: 'idle'
            })
        },
        changeFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].filter = action.payload.filter
            }
        },
        changeTodolistTitle(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].title = action.payload.title
            }
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].entityStatus = action.payload.entityStatus
            }
        },
        setTodolists(state, action: PayloadAction<Array<TodolistType>>) {
            // state = action.payload.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
            return action.payload.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        }
    }
})

export const {
    removeTodolist,
    addTodolist,
    changeFilter,
    changeTodolistTitle,
    changeTodolistEntityStatus,
    setTodolists
} = todolistSlice.actions

export const todolistsReducer = todolistSlice.reducer;

/*export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: UnionTodolistsActionType): Array<TodolistDomainType> => {
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
}*/

export type UnionTodolistsActionType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeFilterActionType |
    ChangeTodolistTitleActionType |
    SetTodolistsActionType |
    ChangeTodolistEntityStatusActionType

export type RemoveTodolistActionType = ReturnType<typeof removeTodolist>
export type AddTodolistActionType = ReturnType<typeof addTodolist>
export type ChangeFilterActionType = ReturnType<typeof changeFilter>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitle>
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatus>
export type SetTodolistsActionType = ReturnType<typeof setTodolists>


/*export const removeTodolist = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id
        }
    } as const
}
export const addTodolist = (todolist: TodolistType) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            todolist
        }
    } as const
}
export const changeFilter = (id: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            id,
            filter
        }
    } as const
}
export const changeTodolistTitle = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            id,
            title
        }
    } as const
}
export const changeTodolistEntityStatus = (id: string, entityStatus: RequestStatusType) => {
    return {
        type: 'CHANGE-TODOLIST-ENTITY-STATUS',
        payload: {
            id,
            entityStatus
        }
    } as const
}
export const setTodolists = (todolists: Array<TodolistType>) => {
    return {
        type: 'SET-TODOLISTS',
        payload: {
            todolists
        }
    } as const
}*/


// THUNKS
export const getTodolistsTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistApi
        .getTodolists()
        .then(res => {
            dispatch(setTodolists(res.data))
            dispatch(setAppStatus('succeeded'))
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistApi
        .createTodolist(title)
        .then(res => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(addTodolist(res.data.data.item))
                dispatch(setAppSuccess('You added new todolist'))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
}
export const removeTodolistTC = (id: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    dispatch(changeTodolistEntityStatus({id, entityStatus: 'loading'}))
    todolistApi
        .deleteTodolist(id)
        .then((res) => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(removeTodolist(id))
                dispatch(setAppSuccess('You deleted todolist'))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
            dispatch(changeTodolistEntityStatus({id, entityStatus: 'failed'}))
        })
}
export const updateTodolistTC = (id: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    dispatch(changeTodolistEntityStatus({id, entityStatus: 'loading'}))
    todolistApi
        .updateTodolist(id, title)
        .then((res) => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(changeTodolistTitle({id, title}))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
        .finally(() => {
            dispatch(changeTodolistEntityStatus({id, entityStatus: 'idle'}))
        })
}