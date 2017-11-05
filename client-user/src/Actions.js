import { store } from 'redux';

export const stateChange = (newState) => {
    return {
        type: "STATE_CHANGE",
        state: newState
    };
};