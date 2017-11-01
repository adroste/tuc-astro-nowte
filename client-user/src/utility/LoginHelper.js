/*
 * utility functions that should help when loggin in or registering an account
 */

/**
 * verifies the content of an email field and returns a status message for that field
 * @param email that should be verified
 * @returns {string} error message if invalid or empty string if valid
 */
export function verifyEmailField(email) {
    if(email.length === 0){
        return "this field is required";
    }

    // TODO verify email regex
    return "";
}