import React, {useCallback} from 'react';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, removeTaskTC, updateTaskTC} from '../state/tasks-reducer';
import Checkbox from './Checkbox';
import {EditableSpan} from './EditableSpan';
import {useDispatch} from 'react-redux';
import {TaskStatuses, TaskType} from '../api/todolists-api';
import {useAppDispatch} from '../app/hooks';

export type TaskPropsType = {
    task: TaskType
    todolistId: string
}

const Task = React.memo(({task, todolistId}: TaskPropsType) => {
    console.log('Task')
    const dispatch = useAppDispatch()

    const onClickDeleteHandler = () => {
        dispatch(removeTaskTC(todolistId, task.id))
    }

    const onTitleChangeHandler = useCallback((title: string) => {
        // dispatch(changeTaskTitleAC(task.id, todolistId, newTitle))
        dispatch(updateTaskTC(todolistId, task.id, {title}))
    }, [dispatch])

    const onChangeTaskStatusHandler = useCallback((checked: boolean) => {
        // dispatch(changeTaskStatusAC(taskID, checked, todolistId))
        const status: TaskStatuses = checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC(todolistId, task.id, {status}))
    }, [dispatch])

    return <li className={task.status ? 'is-done' : ''}>
        <Checkbox onChange={(checked) => onChangeTaskStatusHandler(checked)}
                  checked={task.status === TaskStatuses.Completed}/>
        <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
        <button onClick={onClickDeleteHandler}>x</button>
    </li>
})

export default Task;