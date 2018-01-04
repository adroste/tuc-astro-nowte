/**
 * Action to select a project
 * @param {string} projectId
 * @param {string} title
 * @param {number} permissions
 * @returns {Object} action
 */
export const selectProject = (projectId, title, permissions) => {
    return {
        type: "SELECT_PROJECT",
        projectId: projectId,
        title: title,
        permissions: permissions
    }
};


/**
 * Action to deselect a project
 * @returns {Object} action
 */
export const deselectProject = () => {
    return {
        type: "DESELECT_PROJECT",
    }
};
