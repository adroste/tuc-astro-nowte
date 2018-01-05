import * as ProjectActionTypes from '../actiontypes/project';


/**
 * initial state
 */
const initialState = {
    projectId: undefined,
    title: undefined,
    permissions: undefined,
};

/**
 * Project reducer function
 * @param state last state
 * @param action action to be applied
 */
export const project = (state = initialState, action) => {
    switch (action.type){
        case ProjectActionTypes.SELECT:
            return {
                ...state,
                projectId: action.projectId,
                title: action.title,
                permissions: action.permissions,
            };

        case ProjectActionTypes.DESELECT:
            // reset all data
            return initialState;

        default:
            return state;
    }
};
