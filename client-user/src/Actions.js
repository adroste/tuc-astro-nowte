/**
 * @param newState desired state
 * @returns action
 */
export const stateChange = (newState) => {
    return {
        type: "STATE_CHANGE",
        state: newState
    };
};

/**
 * @param token sets the current login session token
 * @param email email of the logged in user
 * @returns action
 */
export const login = (token, email) => {
    return {
        type: "LOGIN",
        token: token,
        email: email
    };
};

export const requestValidation = (email) => {
    return {
        type: "AWAIT_VALIDATION",
        email: email
    };
};