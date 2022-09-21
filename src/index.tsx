import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './app/App';
import {Provider} from 'react-redux';
import {store} from './app/store';
import {createRoot} from 'react-dom/client';
import {HashRouter} from 'react-router-dom';


const container = document.getElementById('root') as HTMLElement;

const root = createRoot(container);
root.render(
    <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>
);

/*
ReactDOM.render(
    // <React.StrictMode>
    <Provider store={store}>
        <App/>
    </Provider>,
    // </React.StrictMode>,
    document.getElementById('root'));
*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
