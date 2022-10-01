import {
    addTodolist,
    removeTodolist,
    setTodolists,
} from './todolists-reducer';
import {TaskType, todolistApi, UpdateTaskModelType} from '../../api/api';
import {RequestStatusType, setAppStatus, setAppSuccess} from '../../app/app-reducer';
import {checkWithResultCode, errorUtils} from '../../common/utils/error-utils';
import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {AppStateType} from "../../app/store";

const initialState = {} as TasksStateType

export type DomainTaskType = TaskType & {
    entityStatus: RequestStatusType
}
export type TasksStateType = {
    [key: string]: Array<DomainTaskType>
}


// THUNKS
export const getTasksTC = createAsyncThunk('tasks/getTasks', async (todolistId: string, thunkAPI) => {
    const {dispatch} = thunkAPI
    dispatch(setAppStatus('loading'))
    try {
        const res = await todolistApi.getTasks(todolistId)
        dispatch(setAppStatus('succeeded'))
        return {todolistId, tasks: res.data.items}
    } catch (e: any) {
        errorUtils(e, dispatch)
        return thunkAPI.rejectWithValue(e)
    }
})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    const {dispatch} = thunkAPI
    const {todolistId, taskId} = param
    dispatch(setAppStatus('loading'))
    dispatch(changeTaskEntityStatus({todolistId, taskId, entityStatus: 'loading'}))
    try {
        let res = await todolistApi
            .deleteTask(todolistId, taskId);
        if (checkWithResultCode(res, dispatch, () => {
            dispatch(setAppSuccess('You deleted task'))
        })) {
            return ({todolistId, taskId})
        } else {
            return thunkAPI.rejectWithValue(res)
        }
    } catch (e: any) {
        errorUtils(e, dispatch)
        dispatch(changeTaskEntityStatus({todolistId, taskId, entityStatus: 'idle'}))
        return thunkAPI.rejectWithValue(e)
    }
})
export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { todolistId: string, title: string }, thunkAPI) => {
    const {dispatch} = thunkAPI
    const {todolistId, title} = param
    dispatch(setAppStatus('loading'))
    try {
        let res = await todolistApi
            .createTask(todolistId, title);
        if (checkWithResultCode(res, dispatch, () => {
            // const task = res.data.data.item
            // dispatch(addTask(task))
            dispatch(setAppSuccess('You added new task'))
        })) {
            const task = res.data.data.item
            return (task)
        } else {
            return thunkAPI.rejectWithValue(res)
        }


    } catch (e: any) {
        errorUtils(e, dispatch)
        return thunkAPI.rejectWithValue(e)
    }
})
export const updateTaskTC = createAsyncThunk<{ todolistId: string, taskId: string, model: UpdateTaskModelType },
    { todolistId: string, taskId: string, model: UpdateTaskModelType },
    { state: AppStateType }>('tasks/updateTask',
    async (param: { todolistId: string, taskId: string, model: UpdateTaskModelType }, thunkAPI) => {
        const {dispatch, getState, rejectWithValue} = thunkAPI
        const {todolistId, taskId, model} = param

        const task = getState().tasks[todolistId].find(t => t.id === taskId)

        if (task) {
            dispatch(setAppStatus('loading'))
            dispatch(changeTaskEntityStatus({todolistId, taskId, entityStatus: 'loading'}))
            try {
                let res = await todolistApi
                    .updateTask(todolistId, taskId, {
                        title: task.title,
                        deadline: task.deadline,
                        description: task.description,
                        priority: task.priority,
                        status: task.status,
                        startDate: task.startDate,
                        ...model
                    })

                if (checkWithResultCode(res, dispatch, () => {
                    // dispatch(updateTask({todolistId, taskId, model}))
                })) {
                    return ({todolistId, taskId, model})
                } else {
                    return rejectWithValue(res)
                }
            } catch (e: any) {
                errorUtils(e, dispatch)
                return rejectWithValue(e)
            } finally {
                dispatch(changeTaskEntityStatus({todolistId, taskId, entityStatus: 'idle'}))
            }
        }

        return rejectWithValue('not found task with set id')
    })

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        changeTaskEntityStatus(state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) {
            let task = state[action.payload.todolistId].find(t => t.id === action.payload.taskId)
            if (task) {
                task.entityStatus = action.payload.entityStatus
            }
        },
        /*updateTask(state, action: PayloadAction<{ todolistId: string, taskId: string, model: UpdateTaskModelType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }

            /!*const tasks = state[action.payload.todolistId]
            let task = tasks.find(t => t.id === action.payload.taskId)
            if (task) {
                task = {...task, ...action.payload.model}
            }*!/
        }*/
    },
    extraReducers: builder => {
        builder
            .addCase(addTodolist, (state, action) => {
                state[action.payload.id] = []
            })
            .addCase(removeTodolist, (state, action) => {
                delete state[action.payload]
            })
            .addCase(setTodolists, (state, action) => {
                state = {}
                action.payload.forEach(t => {
                    state[t.id] = [];
                })
                return state
            })
            .addCase(getTasksTC.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
            })
            /*.addCase(getTasksTC.rejected, (state, action) => {
                console.log(action)
                // state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
            })*/
            .addCase(removeTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            })
            /*.addCase(removeTaskTC.rejected, (state, action) => {
                console.log(action.payload)
            })*/
            .addCase(addTaskTC.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift({
                    ...action.payload,
                    entityStatus: 'idle'
                })
            })
            /*.addCase(addTaskTC.rejected, (state, action) => {
                console.log('addTask: ', action)
            })*/
            .addCase(updateTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model}
                }
            })
    }
})

export const tasksReducer = tasksSlice.reducer;
export const {
    changeTaskEntityStatus,
} = tasksSlice.actions

export type UnionTasksActionType =
    ChangeTaskEntityStatusActionType

export type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatus>
