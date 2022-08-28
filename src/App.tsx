import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {AddItemForm} from './components/AddItemForm';
import {
    addTodolistTC,
    getTodolistsTC,
} from './state/todolists-reducer';
import {AppStateType} from './state/store';
import {useAppDispatch, useAppSelector} from './app/hooks';
import {TaskType} from './api/todolists-api';


export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    // const todoLists = useSelector<AppStateType, Array<TodolistDomainType>>((state: AppStateType) => state.todolists)
    const todoLists = useAppSelector((state: AppStateType) => state.todolists)
    // const dispatch = useDispatch<AppDispatch>()
    const dispatch = useAppDispatch()

    const addTodolist = useCallback((title: string) => {
        // dispatch(addTodolistAC(title))
        dispatch(addTodolistTC(title))
    }, [dispatch])


    useEffect(() => {
        dispatch(getTodolistsTC())
    }, [])


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
