import React, {useEffect} from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import {Login} from './components/Login/Login';
import Todolists from './components/Todolists/Todolists';
import {useAppDispatch, useAppSelector} from './app/hooks';
import {UniversalSnackbar} from './components/CustomSnackbar/CustomSnackbar';
import {initializeAppTC} from './app/app-reducer';
import {logoutTC} from './components/Login/auth-reducer';


function App() {
    const status = useAppSelector(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, []);

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '40%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    // const loginHandler = (event: MouseEvent<HTMLButtonElement>) => {
    //     return <Navigate to={'/login'}/>
    // }

    function logoutHandler() {
        dispatch(logoutTC())
    }

    return (
        <div>
            <UniversalSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                    {/*: <Button color="inherit" onClick={loginHandler}>Login</Button>}*/}
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
