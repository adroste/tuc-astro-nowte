import * as AppActionTypes from '../actiontypes/app';

const initialState = {
    activeDialog: null,
};

/**
 * Project reducer function
 * @param state last state
 * @param action action to be applied
 */
export const app = (state = initialState, action) => {
    switch (action.type){
        case AppActionTypes.SHOW_DIALOG:
            return {
                ...state,
                activeDialog: action.dialog,
            };
        default:
            return state;
    }
};