import React, {ChangeEvent, useCallback} from 'react';
import {DomainTaskType, removeTaskTC, updateTaskTC} from '../tasks-reducer';
// import Checkbox from './Checkbox';
import {EditableSpan} from '../../EditableSpan/EditableSpan';
import {TaskStatuses} from '../../../api/api';
import {useAppDispatch} from '../../../common/hooks/hooks';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';

export type TaskPropsType = {
    task: DomainTaskType
    todolistId: string
}

const Task = React.memo(({task, todolistId}: TaskPropsType) => {
    // console.log('Task')
    const dispatch = useAppDispatch()

    const onClickDeleteHandler = useCallback(() => {
        dispatch(removeTaskTC({todolistId, taskId: task.id}))
    }, [dispatch])

    const onTitleChangeHandler = (title: string) => {
        if (title === task.title) {
            return;
        }

        dispatch(updateTaskTC({todolistId, taskId: task.id, model: {title}}))
    }

    const onChangeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const status: TaskStatuses = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        /*if (status === task.status) {
            return;
        }*/

        dispatch(updateTaskTC({todolistId, taskId: task.id, model: {status}}))
    }, [dispatch])


    const isDisabled = task.entityStatus === 'loading'

    return (

        <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox
                checked={task.status === TaskStatuses.Completed}
                color="primary"
                onChange={onChangeTaskStatusHandler}
                disabled={isDisabled}
            />

            <EditableSpan value={task.title} onChange={onTitleChangeHandler} disabled={isDisabled}/>
            <IconButton onClick={onClickDeleteHandler} disabled={isDisabled}>
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