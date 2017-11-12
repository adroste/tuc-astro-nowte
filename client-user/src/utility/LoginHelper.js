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

/**
 * verifies the content of the password fields an returns a status message
 * @param password
 * @param password2
 * @return {string} error message if invalid or empty string if valid
 */
export function verifyPasswordFields(password, password2) {
    if(password.length === 0) {
        return "this field is required";
    }

    if(this.password2.length === 0) {
        return "please reenter the password below";
    }

    if(this.password2 !== this.password) {
        return "passwords don't match";
    }

    // TODO verify min length

    return "";
}