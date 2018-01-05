import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './index.css';
import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {project as projectReducer} from "./reducers/project";
import {app as appReducer} from "./reducers/app";
import {user as userReducer} from "./reducers/user";


const reducers = combineReducers({
    routing: routerReducer,
    user: userReducer,
    project: projectReducer,
    app: appReducer,
});

const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);




ReactDOM.render(
    <App store={store}/>,
  document.getElementById('root')
);
