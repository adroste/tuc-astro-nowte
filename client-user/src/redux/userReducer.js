/**
 * initial state
 * @type {{state: string}} state for the state machine
 */
export const initialState = {
    token: undefined,
    email: undefined,
    username: undefined,
    userId: undefined,
};

/**
 * @param state last state
 * @param action action to be applied
 */
export const dispatcher = (state = initialState, action) => {
    switch (action.type){
        case "LOGIN":
            return Object.assign({}, state, {
                token: action.token,
                email: action.email,
                username: action.username,
                userId: action.userId,
            });
        case "LOGOUT":
            // reset all data
            return initialState;

        case "AWAIT_VALIDATION":
            return Object.assign({}, state, {
                email: action.email
            });

        // browser navigation
        // case "@@router/LOCATION_CHANGE":
        //     return state;

        default:
            return state;
    }
};
