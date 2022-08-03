import React, {useCallback, useMemo} from 'react';
import {FilterValuesType, TodolistType} from '../App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from '../state/store';
import {addTaskAC} from '../state/tasks-reducer';
import {changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from '../state/todolists-reducer';
import Task from './Task';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodolistType
}

export const Todolist = React.memo((props: PropsType) => {
    console.log('Todolist')
    const {id, title, filter} = props.todolist

    let tasks = useSelector<AppStateType, Array<TaskType>>(state => state.tasks[id])
    // const tasks2 = useSelector<AppStateType, Array<TaskType>>(state => state.tasks[id])
    // console.log('t === t2', tasks === tasks2)

    /*const addTaskStraight = () => {
        tasks = [...tasks, {id: v1(), title: 'from code', isDone: false}]
        console.log(tasks, tasks2)
    }*/

    // let filteredTasks = tasks


    // console.log('t === filtered', tasks === filteredTasks)

    const dispatch = useDispatch()


    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, id))
    }, [dispatch])
    const removeTodolist = useCallback(() => {
        dispatch(removeTodolistAC(id))
    }, [dispatch])
    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleAC(id, title))
    }, [dispatch])

    /*const onChangeFilterHandler = useCallback((value: FilterValuesType) => {
        dispatch(changeFilterAC(id, value))
    }, [dispatch])*/
    const onChangeFilterHandler = (value: FilterValuesType) => {
        dispatch(changeFilterAC(id, value))
    }


    /*const onChangeFilterAllHandler = useCallback(() => {
        dispatch(changeFilterAC(id, 'all'))
    }, [dispatch])
    const onChangeFilterActiveHandler = useCallback(() => {
        dispatch(changeFilterAC(id, 'active'))
    }, [dispatch])
    const onChangeFilterCompletedHandler = useCallback(() => {
        dispatch(changeFilterAC(id, 'completed'))
    }, [dispatch])*/


    const tasksJSX = useMemo(() => {
        console.log('TASKS MEMO')
        if (filter === 'active') {
            tasks = tasks.filter(t => !t.isDone);
        }
        if (filter === 'completed') {
            tasks = tasks.filter(t => t.isDone);
        }

        return (
            <ul>
                {tasks.map(t => <Task key={t.id} task={t} todolistId={id}/>)}
            </ul>
        )
    }, [tasks, filter])

    /*if (filter === 'active') {
        tasks = tasks.filter(t => !t.isDone);
    }
    if (filter === 'completed') {
        tasks = tasks.filter(t => t.isDone);
    }

    const tasksJSX = (
        <ul>
            {tasks.map(t => <Task key={t.id} task={t} todolistId={id}/>)}
        </ul>
    )*/


    return <div>
        <h3>
            <EditableSpan value={title} onChange={changeTodolistTitle}/>
            <button onClick={removeTodolist}>x</button>
        </h3>
        <AddItemForm addItem={addTask}/>
        {tasksJSX}
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

            {/*<button className={filter === 'all' ? 'active-filter' : ''}
                    onClick={onChangeFilterAllHandler}>All
            </button>
            <button className={filter === 'active' ? 'active-filter' : ''}
                    onClick={onChangeFilterActiveHandler}>Active
            </button>
            <button className={filter === 'completed' ? 'active-filter' : ''}
                    onClick={onChangeFilterCompletedHandler}>Completed
            </button>*/}

            {/*<button onClick={addTaskStraight}>Add</button>*/}
        </div>
    </div>
})


