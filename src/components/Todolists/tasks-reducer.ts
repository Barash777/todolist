import {
    addTodolist,
    AddTodolistActionType, removeTodolist,
    RemoveTodolistActionType, setTodolists,
    SetTodolistsActionType
} from './todolists-reducer';
import {AppStateType, AppThunk} from '../../app/store';
import {TaskType, todolistApi, UpdateTaskModelType} from '../../api/api';
import {RequestStatusType, setAppStatus, setAppSuccess} from '../../app/app-reducer';
import {checkWithResultCode, errorUtils} from '../../common/utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {} as TasksStateType

export type DomainTaskType = TaskType & {
    entityStatus: RequestStatusType
}
export type TasksStateType = {
    [key: string]: Array<DomainTaskType>
}


/*export const removeTask = (todolistId: string, taskId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            taskId,
            todolistId
        }
    } as const
}
export const addTask = (task: TaskType) => {
    return {
        type: 'ADD-TASK',
        payload: {
            task
        }
    } as const
}
export const changeTaskStatus = (taskId: string, isDone: boolean, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            taskId,
            isDone,
            todolistId
        }
    } as const
}
export const changeTaskEntityStatus = (todolistId: string, taskId: string, entityStatus: RequestStatusType) => {
    return {
        type: 'CHANGE-TASK-ENTITY-STATUS',
        payload: {
            taskId,
            entityStatus,
            todolistId
        }
    } as const
}
export const changeTaskTitle = (taskId: string, todolistId: string, title: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            taskId,
            todolistId,
            title
        }
    } as const
}
export const setTasks = (todolistId: string, tasks: TaskType[]) => {
    return {
        type: 'SET-TASKS',
        payload: {
            todolistId,
            tasks
        }
    } as const
}
export const updateTask = (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            todolistId,
            taskId,
            model
        }
    } as const
}*/

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTask(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        },
        addTask(state, action: PayloadAction<TaskType>) {
            return {
                ...state,
                [action.payload.todoListId]: [{
                    ...action.payload,
                    entityStatus: 'idle'
                }, ...state[action.payload.todoListId]]
            }
        },
        changeTaskStatus(state, action: PayloadAction<{ taskId: string, isDone: boolean, todolistId: string }>) {
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                        ...t,
                        isDone: action.payload.isDone
                    } : t)
            }
        },
        changeTaskEntityStatus(state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) {
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                        ...t,
                        entityStatus: action.payload.entityStatus
                    } : t)
            }
        },
        changeTaskTitle(state, action: PayloadAction<{ taskId: string, todolistId: string, title: string }>) {
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                        ...t,
                        title: action.payload.title
                    } : t)
            }
        },
        setTasks(state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) {
            return {
                ...state,
                [action.payload.todolistId]: action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
            }
        },
        updateTask(state, action: PayloadAction<{ todolistId: string, taskId: string, model: UpdateTaskModelType }>) {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => {
                    return t.id === action.payload.taskId
                        ? {...t, ...action.payload.model}
                        : t
                })
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addTodolist, (state, action) => {
                const newId = action.payload.id
                state[newId] = []
            })
            .addCase(removeTodolist, (state, action) => {
                delete state[action.payload]
            })
            .addCase(setTodolists, (state, action) => {
                // const copy = {...state}
                action.payload.forEach(t => {
                    state[t.id] = [];
                })
                // return copy
            })
    }
})

export const tasksReducer = tasksSlice.reducer;
export const {
    removeTask,
    addTask,
    changeTaskStatus,
    changeTaskEntityStatus,
    changeTaskTitle,
    setTasks,
    updateTask
} = tasksSlice.actions

/*export const tasksReducer = (state: TasksInitialStateType = initialState, action: UnionTasksActionType): TasksInitialStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        case 'ADD-TASK': {
            // const newTask: TaskType = {id: v1(), title: action.payload.title, isDone: false}
            return {
                ...state,
                [action.payload.task.todoListId]: [{
                    ...action.payload.task,
                    entityStatus: 'idle'
                }, ...state[action.payload.task.todoListId]]
            }
        }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                        ...t,
                        isDone: action.payload.isDone
                    } : t)
            }
        case 'CHANGE-TASK-ENTITY-STATUS':
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                        ...t,
                        entityStatus: action.payload.entityStatus
                    } : t)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                        ...t,
                        title: action.payload.title
                    } : t)
            }
        case 'ADD-TODOLIST': {
            const newId = action.payload.todolist.id
            return {
                ...state,
                [newId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copy = {...state}
            delete copy[action.payload.id]
            return copy

            /!*const copy = {...state}
            const {[action.payload.id]: remove, ...rest} = copy;
            return rest*!/
        }
        case 'SET-TODOLISTS': {
            const copy = {...state}
            action.payload.todolists.forEach(t => {
                copy[t.id] = [];
            })
            return copy
        }
        case 'SET-TASKS': {
            return {
                ...state,
                [action.payload.todolistId]: action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
            }
        }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => {
                    return t.id === action.payload.taskId
                        ? {...t, ...action.payload.model}
                        : t
                })
            }
        }
        default:
            return state
    }
}*/

export type UnionTasksActionType =
    RemoveTaskActionType |
    AddTaskActionType |
    ChangeTaskStatusActionType |
    ChangeTaskEntityStatusActionType |
    ChangeTaskTitleActionType |
    AddTodolistActionType |
    RemoveTodolistActionType |
    SetTodolistsActionType |
    SetTasksActionType |
    UpdateTaskActionType

export type RemoveTaskActionType = ReturnType<typeof removeTask>
export type AddTaskActionType = ReturnType<typeof addTask>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatus>
export type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatus>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitle>
export type SetTasksActionType = ReturnType<typeof setTasks>
export type UpdateTaskActionType = ReturnType<typeof updateTask>


// THUNKS
export const getTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistApi
        .getTasks(todolistId)
        .then(res => {
            dispatch(setTasks({todolistId, tasks: res.data.items}))
            dispatch(setAppStatus('succeeded'))
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
}
export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
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
}
export const addTaskTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
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
}
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