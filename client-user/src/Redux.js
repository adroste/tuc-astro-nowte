import { createStore } from 'redux';

/**
 * initial state
 * @type {{state: string}} state for the state machine
 */
const initialState = {
    state: "login"
};

/**
 * Actions:
 *
 * type: STATE_CHANGE
 *      - state: {string} new state
 */

/**
 * @param state last state
 * @param action action to be applied
 */
const dispatcher = (state = initialState, action) => {
    switch (action.type){
        case "STATE_CHANGE":
            return Object.assign({}, state, {
                state: action.state
            });
        default:
            return state;
    }
};

export const store = createStore(dispatcher, initialState);