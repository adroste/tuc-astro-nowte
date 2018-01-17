/**
 * @author Alexander Droste
 * @date 16.01.18
 */

export const validateStringNotEmptyCustomMessage = (errorMessage) => (text, cb) => {
    if(text.length === 0)
        return cb(false, errorMessage);
    return cb(true, null);
};

// TODO name requirements
export const validateName = validateStringNotEmptyCustomMessage('Name field is required');

// TODO verify email regex
export const validateEmail = validateStringNotEmptyCustomMessage('Email field is required');

// TODO password requirements
export const validatePassword = validateStringNotEmptyCustomMessage('Password field is required');


export const validatePasswordConfirm = (passwordToCompare) => (passwordConfirm, cb) => {
    if (passwordConfirm.length === 0)
        return cb(false, 'Password-confirm field is required');
    if (passwordConfirm !== passwordToCompare)
        return cb(false, 'Passwords do not match');

    return cb(true, null);
};