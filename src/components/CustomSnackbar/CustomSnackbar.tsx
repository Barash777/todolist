import React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
// import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
// import {setAppErrorAC, setAppSuccessAC} from '../../../app/app_reducer';
import {AlertColor} from '@mui/material/Alert/Alert';


export const UniversalSnackbar = () => {
    /*const dispatch = useAppDispatch()
    const error = useAppSelector(state => state.app.error)
    const success = useAppSelector(state => state.app.success)
    const severity: AlertColor = success ? 'success' : 'error'
    const message = success ? success : error

    const handleClose = async () => {
        // reset error after X seconds
        error && dispatch(setAppErrorAC(null))
        success && dispatch(setAppSuccessAC(null))
    }

    const isOpen: boolean = !!error || !!success

    return (<>
        {message && <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert variant="filled" severity={severity}>{message}</Alert>
        </Snackbar>}
    </>);*/

    return <></>
};