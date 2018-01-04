import { createStore, combineReducers } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import { dispatcher as userDispatcher } from './reducers/user';
import { dispatcher as projectDispatcher } from './reducers/project';

// this will put different reducers (basically dispatch functions) into a single function
// which calls all function provided sequentially
// note that each dispatcher will have its own state.
// the following state will look like: {routing: {routingState}, user: {userState}, project: {projectState}}
const reducers = combineReducers({
    routing: routerReducer,
    user: userDispatcher,
    project: projectDispatcher
});

export const store = createStore(reducers);

// advanced history that syncs navigation events with the store
export const history = syncHistoryWithStore(createHistory(), store);