import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {Todolist} from './Todolist/Todolist';
import {useAppDispatch, useAppSelector} from '../../common/hooks/hooks';
import {AppStateType} from '../../app/store';
import {addTodolistTC, getTodolistsTC} from './todolists-reducer';
import {Navigate} from 'react-router-dom';

const Todolists = () => {

    const todolists = useAppSelector((state: AppStateType) => state.todolists)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])


    useEffect(() => {
        isLoggedIn && dispatch(getTodolistsTC())
    }, [])


    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    key={tl.id}
                                    todolist={tl}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    );
};

export default Todolists;