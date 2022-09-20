import React, {ChangeEvent, useCallback} from 'react';
import {removeTaskTC, updateTaskTC} from '../state/tasks-reducer';
// import Checkbox from './Checkbox';
import {EditableSpan} from './EditableSpan';
import {TaskStatuses, TaskType} from '../api/todolists-api';
import {useAppDispatch} from '../app/hooks';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';

export type TaskPropsType = {
    task: TaskType
    todolistId: string
}

const Task = React.memo(({task, todolistId}: TaskPropsType) => {
    // console.log('Task')
    const dispatch = useAppDispatch()

    const onClickDeleteHandler = () => {
        dispatch(removeTaskTC(todolistId, task.id))
    }

    const onTitleChangeHandler = useCallback((title: string) => {
        dispatch(updateTaskTC(todolistId, task.id, {title}))
    }, [dispatch])

    const onChangeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const status: TaskStatuses = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC(todolistId, task.id, {status}))
    }, [dispatch])


    return (

        <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox
                checked={task.status === TaskStatuses.Completed}
                color="primary"
                onChange={onChangeTaskStatusHandler}
            />

            <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            <IconButton onClick={onClickDeleteHandler}>
                <Delete/>
            </IconButton>
        </div>

    )

    /*return <li className={task.status ? 'is-done' : ''}>
        <Checkbox onChange={(checked) => onChangeTaskStatusHandler(checked)}
                  checked={task.status === TaskStatuses.Completed}/>
        <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
        <button onClick={onClickDeleteHandler}>x</button>
    </li>*/
})

export default Task;