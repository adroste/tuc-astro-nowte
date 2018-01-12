import * as UserActionTypes from '../actiontypes/user';


/**
 * initial state
 */
const initialState = {
    token: undefined,
    email: undefined,
    username: undefined,
    userId: undefined,
};

/**
 * User reducer function
 * @param state last state
 * @param action action to be applied
 */
export const user = (state = initialState, action) => {
    switch (action.type){
        case UserActionTypes.LOGIN:
            return {
                ...state,
                token: action.token,
                email: action.email,
                username: action.username,
                userId: action.userId,
            };

        case UserActionTypes.LOGOUT:
            // reset all data
            return initialState;

        case UserActionTypes.SET_EMAIL:
            return {
                ...state,
                email: action.email
            };

        // browser navigation
        // case "@@router/LOCATION_CHANGE":
        //     return state;

        default:
            return state;
    }
};
