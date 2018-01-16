/**
 * @author Alexander Droste
 * @date 16.01.18
 */


export const validateName = (name, cb) => {
    if(name.length === 0){
        return cb(false, 'Name field is required');
    }

    // TODO name requirements
    return cb(true, null);
};


export const validateEmail = (email, cb) => {
    if(email.length === 0){
        return cb(false, 'Email field is required');
    }

    // TODO verify email regex
    return cb(true, null);
};


export const validatePassword = (password, cb) => {
    if(password.length === 0){
        return cb(false, 'Password field is required');
    }

    // TODO password requirements
    return cb(true, null);
};


export const validatePasswordConfirm = (passwordToCompare) => (passwordConfirm, cb) => {
    if (passwordConfirm.length === 0)
        return cb(false, 'Password-confirm field is required');
    if (passwordConfirm !== passwordToCompare)
        return cb(false, 'Passwords do not match');

    return cb(true, null);
};