import React, {useCallback, useEffect, useMemo} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {addTaskAC, addTaskTC, getTasksTC} from '../state/tasks-reducer';
import {
    changeFilterAC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
    updateTodolistTC
} from '../state/todolists-reducer';
import Task from './Task';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {TaskStatuses} from '../api/todolists-api';


type PropsType = {
    todolist: TodolistDomainType
}

export const Todolist = React.memo((props: PropsType) => {
    console.log('Todolist')
    const {id, title, filter} = props.todolist

    // let tasks = useSelector<AppStateType, Array<TaskType>>(state => state.tasks[id])
    let tasks = useAppSelector(state => state.tasks[id])
    const dispatch = useAppDispatch()


    const addTask = useCallback((title: string) => {
        // dispatch(addTaskAC(title, id))
        dispatch(addTaskTC(id, title))
    }, [dispatch])
    const removeTodolist = useCallback(() => {
        dispatch(removeTodolistTC(id))
    }, [dispatch])
    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(updateTodolistTC(id, title))
    }, [dispatch])
    const onChangeFilterHandler = (value: FilterValuesType) => {
        dispatch(changeFilterAC(id, value))
    }

    /*const onChangeFilterHandler = useCallback((value: FilterValuesType) => {
        dispatch(changeFilterAC(id, value))
    }, [dispatch])*/

    /*const onChangeFilterAllHandler = useCallback(() => {
        dispatch(changeFilterAC(id, 'all'))
    }, [dispatch])
    const onChangeFilterActiveHandler = useCallback(() => {
        dispatch(changeFilterAC(id, 'active'))
    }, [dispatch])
    const onChangeFilterCompletedHandler = useCallback(() => {
        dispatch(changeFilterAC(id, 'completed'))
    }, [dispatch])*/

    useEffect(() => {
        dispatch(getTasksTC(id))
    }, [])

    const tasksJSX = useMemo(() => {
        console.log('TASKS MEMO')
        if (filter === 'active') {
            tasks = tasks.filter(t => t.status !== TaskStatuses.Completed);
        }
        if (filter === 'completed') {
            tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
        }

        return (
            <ul>
                {tasks && tasks.map(t => <Task key={t.id} task={t} todolistId={id}/>)}
            </ul>
        )
    }, [tasks, filter])


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
        </div>
    </div>
})


