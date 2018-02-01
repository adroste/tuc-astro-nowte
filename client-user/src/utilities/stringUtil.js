
/**
 * Method to determine Initials (exact two)
 * @param {string} name
 * @returns {string}  
 */
export function determineInitials(name) {
    const split = name.split(' ');
    const firstInitial = split[0].charAt(0).toUpperCase();
    const secondInitial = split.length > 1 ? split[split.length - 1].charAt(0).toUpperCase() : split[0].charAt(1);
    return firstInitial + secondInitial;
}