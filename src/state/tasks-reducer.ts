import {FilterValuesType, TasksStateType} from '../App';
import {v1} from 'uuid';
import {TaskType} from '../components/Todolist';
import {AddTodolistACType, RemoveTodolistACType} from './todolists-reducer';

export const tasksReducer = (state: TasksStateType, action: UnionACType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        case 'ADD-TASK': {
            const newTask: TaskType = {id: v1(), title: action.payload.title, isDone: false}
            return {
                ...state,
                [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]
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
            const newId = action.payload.todolistId
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
        default:
            return state
    }
}

export type UnionACType = RemoveTaskACType | AddTaskACType |
    ChangeTaskStatusACType | ChangeTaskTitleACType |
    AddTodolistACType | RemoveTodolistACType

export type RemoveTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            taskId,
            todolistId
        }
    } as const
}

export type AddTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            title,
            todolistId
        }
    } as const
}

export type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
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

export type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
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