import {TasksStateType} from '../App';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {AppStateType, AppThunk} from './store';
import {TaskType, todolistsAPI, UpdateTaskModelType} from '../api/todolists-api';
import {setAppErrorAC, setAppStatusAC} from '../app/app-reducer';

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: UnionTasksActionType): TasksStateType => {
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
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
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
                [action.payload.todolistId]: action.payload.tasks
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
    RemoveTaskACType |
    AddTaskACType |
    ChangeTaskStatusACType |
    ChangeTaskTitleACType |
    AddTodolistActionType |
    RemoveTodolistActionType |
    SetTodolistsActionType |
    SetTasksACType |
    UpdateTaskACType

export type RemoveTaskACType = ReturnType<typeof removeTaskAC>
export type AddTaskACType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
export type SetTasksACType = ReturnType<typeof setTasksAC>
export type UpdateTaskACType = ReturnType<typeof updateTaskAC>

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
    todolistsAPI
        .getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(todolistId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI
        .deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const addTaskTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI
        .createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                dispatch(addTaskAC(task))
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
export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateTaskModelType): AppThunk =>
    (dispatch, getState: () => AppStateType) => {

        const task = getState().tasks[todolistId].find(t => t.id === taskId)

        if (task) {
            dispatch(setAppStatusAC('loading'))
            todolistsAPI
                .updateTask(todolistId, taskId, {
                    title: task.title,
                    deadline: task.deadline,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    startDate: task.startDate,
                    ...model
                })
                .then(() => {
                    dispatch(updateTaskAC(todolistId, taskId, model))
                    dispatch(setAppStatusAC('succeeded'))
                })
        }

    }