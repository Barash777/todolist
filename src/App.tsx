import React from 'react';
import './App.css';
import {TaskType, Todolist} from './components/Todolist';
import {AddItemForm} from './components/AddItemForm';
import {
    addTodolistAC
} from './state/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from './state/state';

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
    const todolists = useSelector<AppStateType, Array<TodolistType>>((state: AppStateType) => state.todolists)
    const dispatch = useDispatch()

    function addTodolist(title: string) {
        const action = addTodolistAC(title)
        dispatch(action)
    }

    return (
        <div className="App">
            <AddItemForm addItem={addTodolist}/>
            {
                todolists.map(tl => {

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
