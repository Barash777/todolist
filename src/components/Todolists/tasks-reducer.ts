import {
    addTodolist,
    removeTodolist,
    setTodolists,
} from './todolists-reducer';
import {AppStateType, AppThunk} from '../../app/store';
import {TaskType, todolistApi, UpdateTaskModelType} from '../../api/api';
import {RequestStatusType, setAppStatus, setAppSuccess} from '../../app/app-reducer';
import {checkWithResultCode, errorUtils} from '../../common/utils/error-utils';
import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {} as TasksStateType

export type DomainTaskType = TaskType & {
    entityStatus: RequestStatusType
}
export type TasksStateType = {
    [key: string]: Array<DomainTaskType>
}

export const getTasksTC = createAsyncThunk('tasks/getTasks', (todolistId: string, thunkAPI) => {
    const {dispatch} = thunkAPI
    dispatch(setAppStatus('loading'))
    return todolistApi
        .getTasks(todolistId)
        .then(res => {
            dispatch(setAppStatus('succeeded'))
            // dispatch(setTasks({todolistId, tasks: res.data.items}))
            return {todolistId, tasks: res.data.items}
        })
    // .catch(e => {
    //     errorUtils(e, dispatch)
    //     return (e)
    // })
})

export const removeTaskTC = createAsyncThunk('tasks/removeTask', (param: { todolistId: string, taskId: string }, thunkAPI) => {
    const {dispatch} = thunkAPI
    const {todolistId, taskId} = param
    dispatch(setAppStatus('loading'))
    dispatch(changeTaskEntityStatus({todolistId, taskId, entityStatus: 'loading'}))
    return todolistApi
        .deleteTask(todolistId, taskId)
        .then((res) => {
            if (checkWithResultCode(res, dispatch, () => {
                dispatch(setAppSuccess('You deleted task'))
            })) {
                // if all is ok!
                // think about this how to reject

                // return rejectWithValue(res.response.data)
                // return new Promise((resolve, reject) => {
                //     reject({todolistId, taskId})
                // })
            }
            return ({todolistId, taskId})
        })
    // .catch(e => {
    //     errorUtils(e, dispatch)
    //     dispatch(changeTaskEntityStatus({todolistId, taskId, entityStatus: 'idle'}))
    //     return (e)
    // })
})
export const addTaskTC = createAsyncThunk('tasks/addTask', (param: { todolistId: string, title: string }, thunkAPI) => {
    const {dispatch} = thunkAPI
    const {todolistId, title} = param
    dispatch(setAppStatus('loading'))
    return todolistApi
        .createTask(todolistId, title)
        .then(res => {
            checkWithResultCode(res, dispatch, () => {
                // const task = res.data.data.item
                // dispatch(addTask(task))
                dispatch(setAppSuccess('You added new task'))
            })

            const task = res.data.data.item
            return (task)
        })
    // .catch(e => {
    //     errorUtils(e, dispatch)
    // })
})

// THUNKS

/*export const removeTaskTC_ = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    dispatch(changeTaskEntityStatus({todolistId, taskId, entityStatus: 'loading'}))
    todolistApi
        .deleteTask(todolistId, taskId)
        .then((res) => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(removeTask({todolistId, taskId}))
                dispatch(setAppSuccess('You deleted task'))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
            dispatch(changeTaskEntityStatus({todolistId, taskId, entityStatus: 'idle'}))
        })
}*/
/*export const addTaskTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistApi
        .createTask(todolistId, title)
        .then(res => {
            checkWithResultCode(res, dispatch, () => {
                const task = res.data.data.item
                dispatch(addTask(task))
                dispatch(setAppSuccess('You added new task'))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
}*/
export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateTaskModelType): AppThunk =>
    (dispatch, getState: () => AppStateType) => {

        const task = getState().tasks[todolistId].find(t => t.id === taskId)

        if (task) {
            dispatch(setAppStatus('loading'))
            dispatch(changeTaskEntityStatus({todolistId, taskId, entityStatus: 'loading'}))
            todolistApi
                .updateTask(todolistId, taskId, {
                    title: task.title,
                    deadline: task.deadline,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    startDate: task.startDate,
                    ...model
                })
                .then((res) => {
                    checkWithResultCode(res, dispatch, () => {
                        dispatch(updateTask({todolistId, taskId, model}))
                    })
                })
                .catch(e => {
                    errorUtils(e, dispatch)
                })
                .finally(() => {
                    dispatch(changeTaskEntityStatus({todolistId, taskId, entityStatus: 'idle'}))
                })
        }

    }


const tasksSlice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        /*removeTask(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },*/
        /*addTask(state, action: PayloadAction<TaskType>) {
            state[action.payload.todoListId].unshift({
                ...action.payload,
                entityStatus: 'idle'
            })
        },*/
        changeTaskEntityStatus(state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) {
            let task = state[action.payload.todolistId].find(t => t.id === action.payload.taskId)
            if (task) {
                task.entityStatus = action.payload.entityStatus
            }
        },
        /*setTasks(state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
        },*/
        updateTask(state, action: PayloadAction<{ todolistId: string, taskId: string, model: UpdateTaskModelType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }

            /*const tasks = state[action.payload.todolistId]
            let task = tasks.find(t => t.id === action.payload.taskId)
            if (task) {
                task = {...task, ...action.payload.model}
            }*/
        }
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
                action.payload.forEach(t => {
                    state[t.id] = [];
                })
            })
            .addCase(getTasksTC.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
            })
            .addCase(removeTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            })
            .addCase(addTaskTC.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift({
                    ...action.payload,
                    entityStatus: 'idle'
                })
            })
    }
})

export const tasksReducer = tasksSlice.reducer;
export const {
    // removeTask,
    // addTask,
    changeTaskEntityStatus,
    // setTasks,
    updateTask
} = tasksSlice.actions

export type UnionTasksActionType =
// RemoveTaskActionType |
//     AddTaskActionType |
    ChangeTaskEntityStatusActionType |
    // SetTasksActionType |
    UpdateTaskActionType

// export type RemoveTaskActionType = ReturnType<typeof removeTask>
// export type AddTaskActionType = ReturnType<typeof addTask>
export type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatus>
// export type SetTasksActionType = ReturnType<typeof setTasks>
export type UpdateTaskActionType = ReturnType<typeof updateTask>
