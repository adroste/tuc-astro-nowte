import * as AppActionTypes from '../actiontypes/app';

export const showDialog = (dialog) => {
    return {
        type: AppActionTypes.SHOW_DIALOG,
        dialog: dialog,
    };
};

export const closeDialog = () => {
    return showDialog(null);
};