import * as UserActionTypes from '../actiontypes/user';

/**
 * Creates login action
 * @param {string} token sets the current login session token
 * @param {string} email email of the logged in user
 * @param {string} username
 * @param {string} userId
 * @returns {Object} action
 */
export const login = (token, email, username, userId) => {
    return {
        type: UserActionTypes.LOGIN,
        token: token,
        email: email,
        username: username,
        userId: userId,
    };
};

/**
 * Creates logout action
 * @returns {Object} action
 */
export const logout = () => {
    return {
        type: UserActionTypes.LOGOUT,
    }
};

/**
 * Creates action to set email
 * @param {string} email
 * @returns {Object} action
 */
export const setEmail = (email) => {
    return {
        type: UserActionTypes.SET_EMAIL,
        email: email
    };
};
