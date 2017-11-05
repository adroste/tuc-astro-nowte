import { createStore } from 'redux';

/**
 * initial state
 * @type {{state: string}} state for the state machine
 */
const initialState = {
    state: "login"
};

/**
 * performs a deepcopy
 * @param obj object
 */
const copy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
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
    let newState = undefined;
    switch (action.type){
        case "STATE_CHANGE":
            newState = copy(state);
            newState.state = action.state;
            break;
        default:
            return state;
    }

    return newState;
};

export const store = createStore(dispatcher, initialState);

store.subscribe(() => {
   console.log(store.getState());
});