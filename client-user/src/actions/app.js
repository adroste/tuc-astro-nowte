import * as AppActionTypes from '../actiontypes/app';

export const pushDialog = (dialog) => {
    return {
        type: AppActionTypes.PUSH_DIALOG,
        dialog: dialog,
    };
};

export const popDialog = () => {
    return {
        type: AppActionTypes.POP_DIALOG,
    };
};