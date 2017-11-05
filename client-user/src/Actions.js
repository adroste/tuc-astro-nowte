import { store } from 'redux';

/**
 * @param newState desired state
 * @returns action
 */
export const stateChange = (newState) => {
    return {
        type: "STATE_CHANGE",
        state: newState
    };
};