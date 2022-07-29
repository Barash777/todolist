import React from 'react';
import {FilterValuesType, TodolistType} from '../App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import Checkbox from './Checkbox';
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from '../state/state';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from '../state/tasks-reducer';
import {changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from '../state/todolists-reducer';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodolistType
}

export function Todolist(props: PropsType) {
    const {id, title, filter} = props.todolist

    const tasks = useSelector<AppStateType, Array<TaskType>>(state => state.tasks[id])
    // const tasks2 = useSelector<AppStateType, Array<TaskType>>(state => state.tasks[id])

    // console.log(tasks)
    // console.log('t === t2', tasks === tasks2)

    // tasks = [{id: 'test', title: 'from code', isDone: false}]

    let filteredTasks = tasks
    if (filter === 'active') {
        filteredTasks = tasks.filter(t => !t.isDone);
    }
    if (filter === 'completed') {
        filteredTasks = tasks.filter(t => t.isDone);
    }

    // console.log('t === filtered', tasks === filteredTasks)

    const dispatch = useDispatch()

    const addTask = (title: string) => {
        dispatch(addTaskAC(title, id))
    }

    const removeTodolist = () => {
        dispatch(removeTodolistAC(id))
    }
    const changeTodolistTitle = (title: string) => {
        dispatch(changeTodolistTitleAC(id, title))
    }

    const onChangeFilterHandler = (value: FilterValuesType) => dispatch(changeFilterAC(id, value))

    const onChangeTaskStatusHandler = (taskID: string, checked: boolean) => {
        // props.changeTaskStatus(taskID, checked, props.id);
        dispatch(changeTaskStatusAC(taskID, checked, id))
    }

    return <div>
        <h3><EditableSpan value={title} onChange={changeTodolistTitle}/>
            <button onClick={removeTodolist}>x</button>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                filteredTasks.map(t => {
                    const onClickHandler = () => dispatch(removeTaskAC(t.id, id))

                    const onTitleChangeHandler = (newTitle: string) => {
                        dispatch(changeTaskTitleAC(t.id, id, newTitle))
                    }

                    return <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                        {/*<input type="checkbox" onChange={onChangeHandler} checked={t.isDone}/>*/}
                        <Checkbox onChange={(checked) => onChangeTaskStatusHandler(t.id, checked,)}
                                  checked={t.isDone}/>
                        <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                        <button onClick={onClickHandler}>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={filter === 'all' ? 'active-filter' : ''}
                    onClick={() => onChangeFilterHandler('all')}>All
            </button>
            <button className={filter === 'active' ? 'active-filter' : ''}
                    onClick={() => onChangeFilterHandler('active')}>Active
            </button>
            <button className={filter === 'completed' ? 'active-filter' : ''}
                    onClick={() => onChangeFilterHandler('completed')}>Completed
            </button>
        </div>
    </div>
}


