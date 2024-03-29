import React, {useCallback, useEffect, useMemo} from 'react';
import {AddItemForm} from '../../AddItemForm/AddItemForm';
import {EditableSpan} from '../../EditableSpan/EditableSpan';
import {addTaskTC, getTasksTC} from '../tasks-reducer';
import {
    changeFilter,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
    updateTodolistTC
} from '../todolists-reducer';
import Task from '../Task/Task';
import {useAppDispatch, useAppSelector} from '../../../common/hooks/hooks';
import {TaskStatuses} from '../../../api/api';
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
        dispatch(addTaskTC({todolistId: id, title}))
    }, [dispatch])
    const removeTodolist = useCallback(() => {
        dispatch(removeTodolistTC(id))
    }, [dispatch])
    const changeTodolistTitle = (newTitle: string) => {
        if (newTitle === title) {
            return;
        }

        dispatch(updateTodolistTC({id, title: newTitle}))
    }
    const onChangeFilterHandler = (filter: FilterValuesType) => {
        dispatch(changeFilter({id, filter}))
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


