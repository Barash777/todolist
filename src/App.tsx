import React from 'react';
import './App.css';
import {TaskType} from './api/todolists-api';
import {Route, Routes} from 'react-router-dom';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Menu} from '@mui/icons-material';
// import {UniversalSnackbar} from './components/CustomSnackbar/CustomSnackbar';
import {Login} from './components/Login/Login';
import Todolists from './components/Todolists/Todolists';


export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    return (
        <div>
            {/*<UniversalSnackbar/>*/}
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {/*{status === 'loading' && <LinearProgress/>}*/}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path="/" element={<Todolists/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="*" element={<h3>404: PAGE NOT FOUND</h3>}/>
                    {/*<Route path="/404" element={<h3>404: PAGE NOT FOUND</h3>}/>*/}
                    {/*<Route path="*" element={<Navigate to={'/404'}/>}/>*/}
                </Routes>
            </Container>


            {/*<AddItemForm addItem={addTodolist}/>
            {
                todoLists.map(tl => {

                    return <Todolist
                        key={tl.id}
                        todolist={tl}
                    />
                })
            }*/}

        </div>
    );
}

export default App;
