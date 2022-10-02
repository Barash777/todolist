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
        dispatch(setTodolists(res.data))
        // return (res.data)
    } catch (e: any) {
        errorUtils(e, dispatch)
        return rejectWithValue(e)
    }
})
export const addTodolistTC = createAsyncThunk('todolist/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus('loading'))
    try {
        let res = await todolistApi.createTodolist(title)
        if (checkWithResultCode(res, dispatch, () => {
            dispatch(setAppSuccess('You added new todolist'))
        })) {
            dispatch(addTodolist(res.data.data.item))
            // return (res.data.data.item)
        } else {
            return rejectWithValue(res)
        }
    } catch (e: any) {
        errorUtils(e, dispatch)
        return rejectWithValue(e)
    }
})
export const removeTodolistTC = createAsyncThunk('todolist/removeTodolist', async (id: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus('loading'))
    dispatch(changeTodolistEntityStatus({id, entityStatus: 'loading'}))
    try {
        let res = await todolistApi.deleteTodolist(id)
        if (checkWithResultCode(res, dispatch, () => {
            dispatch(setAppSuccess('You deleted todolist'))
        })) {
            dispatch(removeTodolist(id))
            // return (id)
        } else {
            return rejectWithValue(res)
        }
    } catch (e: any) {
        errorUtils(e, dispatch)
        dispatch(changeTodolistEntityStatus({id, entityStatus: 'failed'}))
        return rejectWithValue(e)
    }
})

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
        addTodolist(state, action: PayloadAction<TodolistType>) {
            state.unshift({
                ...action.payload,
                filter: 'all',
                entityStatus: 'idle'
            })
        },
        setTodolists(state, action: PayloadAction<TodolistType[]>) {
            return action.payload.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        },

    },
    extraReducers: builder => {
        // builder
        /*.addCase(getTodolistsTC.fulfilled, (state, action) => {
            return action.payload.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        })
        .addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({
                ...action.payload,
                filter: 'all',
                entityStatus: 'idle'
            })
        })*/
        /*.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload)
            if (index > -1) {
                state.splice(index, 1)
            }
        })*/


    }

})

export const {
    removeTodolist,
    changeFilter,
    changeTodolistTitle,
    changeTodolistEntityStatus,
    setTodolists,
    addTodolist
} = todolistSlice.actions

export const todolistsReducer = todolistSlice.reducer;

export type UnionTodolistsActionType =
    RemoveTodolistActionType |
    ChangeFilterActionType |
    ChangeTodolistTitleActionType |
    ChangeTodolistEntityStatusActionType |
    SetTodolistsActionType |
    AddTodolistActionType

export type RemoveTodolistActionType = ReturnType<typeof removeTodolist>
export type ChangeFilterActionType = ReturnType<typeof changeFilter>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitle>
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatus>
export type SetTodolistsActionType = ReturnType<typeof setTodolists>
export type AddTodolistActionType = ReturnType<typeof addTodolist>


