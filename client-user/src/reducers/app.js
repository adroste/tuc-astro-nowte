import * as AppActionTypes from '../actiontypes/app';

const initialState = {
    activeDialogs: [],
};

let localDialogId = 0;

/**
 * Project reducer function
 * @param state last state
 * @param action action to be applied
 */
export const app = (state = initialState, action) => {
    switch (action.type){
        case AppActionTypes.PUSH_DIALOG:
        {
            let newDias = state.activeDialogs.slice();
            newDias.push({dialog: action.dialog, id: ++localDialogId});
            return {
                ...state,
                // TODO deep copy required?
                activeDialogs: newDias,
            };
        }
        case AppActionTypes.POP_DIALOG:
        {
            if(state.activeDialogs.length === 0)
                return state;
            let newDias = state.activeDialogs.slice();
            newDias.pop();
            return {
                ...state,
                activeDialogs: newDias,
            };
        }
        default:
            return state;
    }
};