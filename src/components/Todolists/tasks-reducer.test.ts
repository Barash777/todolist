import {addTask, getTasksTC, removeTask, tasksReducer, TasksStateType, updateTask} from './tasks-reducer';
import {TaskPriorities, TaskStatuses} from '../../api/api';
import {addTodolist, removeTodolist} from './todolists-reducer';


let startState: TasksStateType
let todoId1 = 'todolistId1'
let todoId2 = 'todolistId2'

beforeEach(() => {
    startState = {
        [todoId1]: [
            {
                id: '1',
                title: 'CSS',
                description: '',
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 0,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '2',
                title: 'JS',
                description: '',
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 1,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '3',
                title: 'React',
                description: '',
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 2,
                addedDate: '',
                entityStatus: 'idle'
            }
        ],
        [todoId2]: [
            {
                id: '1',
                title: 'bread',
                description: '',
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 0,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '2',
                title: 'milk',
                description: '',
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 1,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '3',
                title: 'tea',
                description: '',
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 2,
                addedDate: '',
                entityStatus: 'idle'
            }
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTask({taskId: '2', todolistId: todoId2})

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        [todoId1]: [
            {
                id: '1',
                title: 'CSS',
                description: '',
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 0,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '2',
                title: 'JS',
                description: '',
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 1,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '3',
                title: 'React',
                description: '',
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 2,
                addedDate: '',
                entityStatus: 'idle'
            }
        ],
        [todoId2]: [
            {
                id: '1',
                title: 'bread',
                description: '',
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 0,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '3',
                title: 'tea',
                description: '',
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoId1,
                order: 2,
                addedDate: '',
                entityStatus: 'idle'
            }
        ]
    })
});

test('correct task should be added to correct array', () => {

    const task = {
        id: '4',
        title: 'juice',
        description: '',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: todoId2,
        order: 0,
        addedDate: ''
    }
    const action = addTask(task)

    const endState = tasksReducer(startState, action)

    expect(endState[todoId1].length).toBe(3)
    expect(endState[todoId2].length).toBe(4)
    expect(endState[todoId2][0].id).toBeDefined()
    expect(endState[todoId2][0].title).toBe('juice')
})

test('status of specified task should be changed', () => {

    const model = {status: TaskStatuses.Completed}
    const action = updateTask({todolistId: todoId2, taskId: '2', model})

    const endState = tasksReducer(startState, action)

    expect(startState[todoId2][1].status).toBe(TaskStatuses.New)
    expect(endState[todoId1][1].status).toBe(TaskStatuses.New)
    expect(endState[todoId2][1].status).toBe(TaskStatuses.Completed)
})

test('title of specified task should be changed', () => {

    const model = {title: 'newTitle'}
    const action = updateTask({todolistId: todoId2, taskId: '2', model})
    const endState = tasksReducer(startState, action)

    expect(startState[todoId2][1].title).toBe('milk')
    expect(endState[todoId1][1].title).toBe('JS')
    expect(endState[todoId2][1].title).toBe('newTitle')
})

test('new array should be added when new todolist is added', () => {

    const todo = {
        id: '124',
        title: 'test',
        addedDate: '',
        order: 0
    }
    const action = addTodolist(todo)
    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {

    const action = removeTodolist(todoId2)
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState[todoId2]).not.toBeDefined()
})

test('tasks should be added for todolist', () => {

    const tasks = [
        {
            id: '1',
            title: 'CSS',
            description: '',
            status: TaskStatuses.New,
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            todoListId: todoId1,
            order: 0,
            addedDate: '',
            entityStatus: 'idle'
        }
    ]
    const action = getTasksTC.fulfilled({todolistId: todoId2, tasks}, '', todoId2)

    /*const action = {
        type: 'CHANGE-TODOLIST-FILTER',
        id: todolistId2,
        filter: newFilter
    };*/

    const endState = tasksReducer(startState, action);

    expect(startState[todoId1].length).toBe(3);
    expect(startState[todoId2].length).toBe(3);
    expect(endState[todoId1].length).toBe(3);
    expect(endState[todoId2].length).toBe(1);
});

