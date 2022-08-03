import React, {useCallback} from 'react';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from '../state/tasks-reducer';
import Checkbox from './Checkbox';
import {EditableSpan} from './EditableSpan';
import {useDispatch} from 'react-redux';
import {TaskType} from './Todolist';

export type TaskPropsType = {
    task: TaskType
    todolistId: string
}

const Task = React.memo(({task, todolistId}: TaskPropsType) => {
    console.log('Task')
    const dispatch = useDispatch()

    const onClickHandler = () =>
        dispatch(removeTaskAC(task.id, todolistId))

    const onTitleChangeHandler = useCallback((newTitle: string) => {
        dispatch(changeTaskTitleAC(task.id, todolistId, newTitle))
    }, [dispatch])

    const onChangeTaskStatusHandler = useCallback((taskID: string, checked: boolean) => {
        dispatch(changeTaskStatusAC(taskID, checked, todolistId))
    }, [dispatch])

    return <li className={task.isDone ? 'is-done' : ''}>
        <Checkbox onChange={(checked) => onChangeTaskStatusHandler(task.id, checked)}
                  checked={task.isDone}/>
        <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
        <button onClick={onClickHandler}>x</button>
    </li>
})

export default Task;