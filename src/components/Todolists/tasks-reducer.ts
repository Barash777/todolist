import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from './todolists-reducer';
import {AppStateType, AppThunk} from '../../app/store';
import {TaskType, todolistApi, UpdateTaskModelType} from '../../api/api';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {checkWithResultCode, errorUtils} from '../../common/utils/error-utils';

const initialState = {} as TasksStateType

export type DomainTaskType = TaskType & {
    entityStatus: RequestStatusType
}
export type TasksStateType = {
    [key: string]: Array<DomainTaskType>
}

type TasksInitialStateType = typeof initialState

export const tasksReducer = (state: TasksInitialStateType = initialState, action: UnionTasksActionType): TasksInitialStateType => {
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

            /*const copy = {...state}
            const {[action.payload.id]: remove, ...rest} = copy;
            return rest*/
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
}

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

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatusAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>

export const removeTaskAC = (todolistId: string, taskId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            taskId,
            todolistId
        }
    } as const
}

export const addTaskAC = (task: TaskType) => {
    return {
        type: 'ADD-TASK',
        payload: {
            task
        }
    } as const
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            taskId,
            isDone,
            todolistId
        }
    } as const
}
export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, entityStatus: RequestStatusType) => {
    return {
        type: 'CHANGE-TASK-ENTITY-STATUS',
        payload: {
            taskId,
            entityStatus,
            todolistId
        }
    } as const
}
export const changeTaskTitleAC = (taskId: string, todolistId: string, title: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            taskId,
            todolistId,
            title
        }
    } as const
}
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => {
    return {
        type: 'SET-TASKS',
        payload: {
            todolistId,
            tasks
        }
    } as const
}
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            todolistId,
            taskId,
            model
        }
    } as const
}


// THUNKS
export const getTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistApi
        .getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(todolistId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(e => {
            errorUtils(e, dispatch)
        })
}
export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
    todolistApi
        .deleteTask(todolistId, taskId)
        .then((res) => {
            checkWithResultCode(res, dispatch, () => {
                dispatch(removeTaskAC(todolistId, taskId))
            })
        })
        .catch(e => {
            errorUtils(e, dispatch)
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'idle'))
        })
}
export const addTaskTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistApi
        .createTask(todolistId, title)
        .then(res => {
            checkWithResultCode(res, dispatch, () => {
                const task = res.data.data.item
                dispatch(addTaskAC(task))
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
            dispatch(setAppStatusAC('loading'))
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
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
                        dispatch(updateTaskAC(todolistId, taskId, model))
                    })
                })
                .catch(e => {
                    errorUtils(e, dispatch)
                })
                .finally(() => {
                    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'idle'))
                })
        }

    }