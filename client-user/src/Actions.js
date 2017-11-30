/**
 * @param token sets the current login session token
 * @param email email of the logged in user
 * @param username
 * @param folderId
 * @param userId
 * @returns action
 */
export const login = (token, email, username, folderId, userId) => {
    return {
        type: "LOGIN",
        token: token,
        email: email,
        username: username,
        rootFolder: folderId,
        userId: userId,
    };
};

export const requestValidation = (email) => {
    return {
        type: "AWAIT_VALIDATION",
        email: email
    };
};