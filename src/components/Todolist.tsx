import React, {useCallback, useEffect, useMemo} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {addTaskTC, getTasksTC} from '../state/tasks-reducer';
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
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';


type PropsType = {
    todolist: TodolistDomainType
}

export const Todolist = React.memo((props: PropsType) => {
    // console.log('Todolist')
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


    useEffect(() => {
        dispatch(getTasksTC(id))
    }, [])

    const tasksJSX = useMemo(() => {
        // console.log('TASKS MEMO')
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


    return (

        <div>
            <h3><EditableSpan value={title} onChange={changeTodolistTitle}
                              disabled={props.todolist.entityStatus === 'loading'}/>
                <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'}/>
            {tasksJSX}
            <div style={{paddingTop: '10px'}}>
                <Button variant={filter === 'all' ? 'outlined' : 'text'}
                        onClick={() => onChangeFilterHandler('all')}
                        color={filter === 'all' ? 'primary' : 'secondary'}
                >All
                </Button>
                <Button variant={filter === 'active' ? 'outlined' : 'text'}
                        onClick={() => onChangeFilterHandler('active')}
                        color={filter === 'active' ? 'primary' : 'secondary'}>Active
                </Button>
                <Button variant={filter === 'completed' ? 'outlined' : 'text'}
                        onClick={() => onChangeFilterHandler('completed')}
                        color={filter === 'completed' ? 'primary' : 'secondary'}>Completed
                </Button>
            </div>
        </div>

    )
})


