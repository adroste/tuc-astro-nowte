/**
 * @param token sets the current login session token
 * @param email email of the logged in user
 * @param username
 * @param userId
 * @returns action
 */
export const login = (token, email, username, userId) => {
    return {
        type: "LOGIN",
        token: token,
        email: email,
        username: username,
        userId: userId,
    };
};

export const logOut = () => {
    return {
        type: "LOGOUT",
    }
};

export const requestValidation = (email) => {
    return {
        type: "AWAIT_VALIDATION",
        email: email
    };
};
