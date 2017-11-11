import { createStore } from 'redux';

/**
 * initial state
 * @type {{state: string}} state for the state machine
 */
const initialState = {
    token: undefined,
    email: undefined,
    username: undefined
};

/**
 * @param state last state
 * @param action action to be applied
 */
const dispatcher = (state = initialState, action) => {
    switch (action.type){
        case "LOGIN":
            return Object.assign({}, state, {
                state: "logged_in",
                token: action.token,
                email: action.email
            });

        case "AWAIT_VALIDATION":
            return Object.assign({}, state, {
               state: "request_email_validation",
               email: action.email
            });

        default:
            return state;
    }
};

export const store = createStore(dispatcher, initialState);