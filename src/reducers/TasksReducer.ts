import {TaskType} from '../Todolist';
import {v1} from 'uuid';

export const TasksReducer = (state: Array<TaskType>, action: AllActionsType) => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return state.filter(e => e.id !== action.payload.taskID);
        }
        case 'ADD-TASK': {
            let task = {id: v1(), title: action.payload.title, isDone: false};
            return [task, ...state]
        }
        default: {
            return state
        }
    }
}

type AllActionsType = removeTaskACType | addTaskACType;

type removeTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (taskID: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            taskID
        }
    } as const
}


type addTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (title: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            title
        }
    } as const
}
