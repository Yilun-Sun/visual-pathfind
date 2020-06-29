import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainRoute from './route/MainRoute';
import { BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Pathfind from './components/pages/Pathfind/Pathfind'

ReactDOM.render(
    // TODO: React.StrictMode
    // <React.StrictMode>
    //     <Router>
    //         <MainRoute />
    //     </Router>
    // </React.StrictMode>,
    <Router>
        <MainRoute />
    </Router>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
