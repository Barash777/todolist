import React, {useEffect} from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Menu from '@mui/icons-material/Menu';
import {Login} from './components/Login/Login';
import Todolists from './components/Todolists/Todolists';
import {useAppDispatch, useAppSelector} from './app/hooks';
import {UniversalSnackbar} from './components/CustomSnackbar/CustomSnackbar';
import {initializeAppTC} from './app/app-reducer';


function App() {
    const status = useAppSelector(state => state.app.status)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, []);

    return (
        <div>
            <UniversalSnackbar/>
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
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path="/" element={<Todolists/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="*" element={<h3>404: PAGE NOT FOUND</h3>}/>
                </Routes>
            </Container>

        </div>
    );
}

export default App;
