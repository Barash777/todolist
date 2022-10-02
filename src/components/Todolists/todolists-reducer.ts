import {todolistApi, TodolistType} from '../../api/api';
import {AppThunk} from '../../app/store';
import {RequestStatusType, setAppStatus, setAppSuccess} from '../../app/app-reducer';
import {checkWithResultCode, errorUtils} from '../../common/utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

// THUNKS
export const getTodolistsTC = createAsyncThunk('todolist/getTodolists', async (_, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus('loading'))
    try {
        let res = await todolistApi.getTodolists()
        dispatch(setAppStatus('succeeded'))
        return (res.data)
    } catch (e: any) {
        errorUtils(e, dispatch)
        return rejectWithValue(e)
    }
})
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
    },
    extraReducers: builder => {
        builder
            .addCase(getTodolistsTC.fulfilled, (state, action) => {
                return action.payload.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
            })


    }

})

export const {
    removeTodolist,
    addTodolist,
    changeFilter,
    changeTodolistTitle,
    changeTodolistEntityStatus,
} = todolistSlice.actions

export const todolistsReducer = todolistSlice.reducer;

export type UnionTodolistsActionType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeFilterActionType |
    ChangeTodolistTitleActionType |
    ChangeTodolistEntityStatusActionType

export type RemoveTodolistActionType = ReturnType<typeof removeTodolist>
export type AddTodolistActionType = ReturnType<typeof addTodolist>
export type ChangeFilterActionType = ReturnType<typeof changeFilter>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitle>
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatus>


