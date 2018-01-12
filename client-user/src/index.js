import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './index.css';
import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {project as projectReducer} from "./reducers/project";
import {app as appReducer} from "./reducers/app";
import {user as userReducer} from "./reducers/user";
import {loadState, saveState} from "./utilities/storage";


const reducers = combineReducers({
    routing: routerReducer,
    user: userReducer,
    project: projectReducer,
    app: appReducer,
});

const preloadedState = loadState();

const store = createStore(
    reducers,
    preloadedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


store.subscribe(() => {
    const user = store.getState().user;
    const project = store.getState().project;

    saveState({
        user: user
    }, true);

    saveState({
        project: project
    }, false);
});



ReactDOM.render(
    <App store={store}/>,
  document.getElementById('root')
);
