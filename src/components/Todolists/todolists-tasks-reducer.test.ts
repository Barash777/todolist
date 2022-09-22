import {tasksReducer, TasksStateType} from './tasks-reducer';
import {addTodolist, TodolistDomainType, todolistsReducer} from './todolists-reducer';
import {TodolistType} from '../../api/api';

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const newTodo: TodolistType = {
        id: '4',
        title: 'new Title',
        order: 0,
        addedDate: ''
    }
    const action = addTodolist(newTodo)

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.id)
    expect(idFromTodolists).toBe(action.payload.id)
})
