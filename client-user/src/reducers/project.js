/**
 * initial state
 */
export const initialState = {
    projectId: undefined,
    title: undefined,
    permissions: undefined,
};

/**
 * @param state last state
 * @param action action to be applied
 */
export const dispatcher = (state = initialState, action) => {
    switch (action.type){
        case "SELECT_PROJECT":
            return Object.assign({}, state, {
                projectId: action.projectId,
                title: action.title,
                permissions: action.permissions,
            });
        case "DESELECT_PROJECT":
            // reset all data
            return initialState;

        default:
            return state;
    }
};
