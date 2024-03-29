import React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {AlertColor} from '@mui/material/Alert/Alert';
import {useAppDispatch, useAppSelector} from '../../common/hooks/hooks';
import {setAppError, setAppSuccess} from '../../app/app-reducer';


export const UniversalSnackbar = () => {
    const dispatch = useAppDispatch()
    const error = useAppSelector(state => state.app.error)
    const success = useAppSelector(state => state.app.success)
    const severity: AlertColor = success ? 'success' : 'error'
    const message = success ? success : error

    const handleClose = async () => {
        // reset error after X seconds
        error && dispatch(setAppError(null))
        success && dispatch(setAppSuccess(null))
    }

    const isOpen: boolean = !!error || !!success

    return (<>
        {message && <Snackbar open={isOpen} autoHideDuration={5000} onClose={handleClose}>
            <Alert variant="filled" severity={severity}>{message}</Alert>
        </Snackbar>}
    </>);
};