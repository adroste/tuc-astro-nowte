import * as ProjectActionTypes from '../actiontypes/project';

/**
 * Action to select a project
 * @param {string} projectId
 * @param {string} title
 * @param {number} permissions
 * @returns {Object} action
 */
export const select = (projectId, title, permissions) => {
    return {
        type: ProjectActionTypes.SELECT,
        projectId: projectId,
        title: title,
        permissions: permissions
    }
};


/**
 * Action to deselect a project
 * @returns {Object} action
 */
export const deselect = () => {
    return {
        type: ProjectActionTypes.DESELECT,
    }
};
