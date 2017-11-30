import { createStore, combineReducers } from 'redux';
import createHistory from 'history/createBrowserHistory'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

/**
 * initial state
 * @type {{state: string}} state for the state machine
 */
const initialState = {
    token: undefined,
    email: undefined,
    username: undefined,
    rootFolder: undefined,
    userId: undefined,
};

/**
 * @param state last state
 * @param action action to be applied
 */
const dispatcher = (state = initialState, action) => {
    switch (action.type){
        case "LOGIN":
            return Object.assign({}, state, {
                token: action.token,
                email: action.email,
                username: action.username,
                rootFolder: action.rootFolder,
                userId: action.userId,
            });

        case "AWAIT_VALIDATION":
            return Object.assign({}, state, {
               email: action.email
            });

            // browser navigation
        case "@@router/LOCATION_CHANGE":
            return state;

        default:
            return state;
    }
};

// this will put different reducers (basically dispatch functions) into a single function
// which calls all function provided sequentially
// note that each dispatcher will have its own state.
// the following state will look like: {routing: {routingState}, user: {userState}}
const reducers = combineReducers({
    routing: routerReducer,
    user: dispatcher,
});

export const store = createStore(reducers, initialState);

// advanced history that syncs navigation events with the store
export const history = syncHistoryWithStore(createHistory(), store);