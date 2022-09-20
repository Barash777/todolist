import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../AddItemForm';
import {Todolist} from '../Todolist';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {AppStateType} from '../../state/store';
import {addTodolistTC, getTodolistsTC} from '../../state/todolists-reducer';

const Todolists = () => {

    const todolists = useAppSelector((state: AppStateType) => state.todolists)
    const dispatch = useAppDispatch()

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])


    useEffect(() => {
        dispatch(getTodolistsTC())
    }, [])

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