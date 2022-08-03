import React, {useCallback} from 'react';
import './App.css';
import {TaskType, Todolist} from './components/Todolist';
import {AddItemForm} from './components/AddItemForm';
import {
    addTodolistAC
} from './state/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from './state/store';

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    const todoLists = useSelector<AppStateType, Array<TodolistType>>((state: AppStateType) => state.todolists)
    const dispatch = useDispatch()

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    }, [dispatch])

    return (
        <div className="App">
            <AddItemForm addItem={addTodolist}/>
            {
                todoLists.map(tl => {

                    return <Todolist
                        key={tl.id}
                        todolist={tl}
                    />
                })
            }

        </div>
    );
}

export default App;
