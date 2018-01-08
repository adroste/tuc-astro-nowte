/**
 * @author Alexander Droste
 * @date 03.01.18
 */


/**
 * Loads state in sessionStorage and localStorage and combines them.
 * @returns {Object} combined state (sessionStorage + localStorage)
 */
export const loadState = () => {
    try {
        const session = JSON.parse(sessionStorage.getItem('sessionState'));
        const local = JSON.parse(localStorage.getItem('localState'));
        if (session === null && local === null)
            return undefined;
        return Object.assign({}, local, session);
    } catch (err) {
        return undefined;
    }
};


/**
 * Saves state in either sessionStorage or localStorage
 * @param {Object} state state to save
 * @param {boolean} [persistent=false] if true state will be saved in localStorage, otherwise in sessionStorage
 */
export const saveState = (state, persistent = false) => {
    try {
        const serialized = JSON.stringify(state);
        if (persistent)
            localStorage.setItem('localState', serialized);
        else
            sessionStorage.setItem('sessionState', serialized);
    } catch (err) {
        // TODO proper logging
        console.error(err);
    }
};