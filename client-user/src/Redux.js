import { createStore, combineReducers } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import { user as userReducer } from './reducers/user';
import { project as projectReducer } from './reducers/project';
import { app as appReducer } from './reducers/app';

// this will put different reducers (basically dispatch functions) into a single function
// which calls all function provided sequentially
// note that each dispatcher will have its own state.
// the following state will look like: {routing: {routingState}, user: {userState}, project: {projectState}}
const reducers = combineReducers({
    routing: routerReducer,
    user: userReducer,
    project: projectReducer,
    app: appReducer,
});

export const store = createStore(reducers);

// advanced history that syncs navigation events with the store
export const history = syncHistoryWithStore(createHistory(), store);