/**
 * calls the lean function on each array member
 * @param {Array|null} array
 * @return {Array|null}
 */
export const leanArray = (array) => {
    if(!array)
        return null;

    let res = [];
    for(let value of array){
        res.push(value.lean());
    }
    return res;
};

/**
 * calls the fromObject function for each object in the array
 * @param {Array|null} array
 * @param {function(object)} fromObjectFunc
 * @return {Array|null}
 */
export const fromObjectArray = (array, fromObjectFunc) => {
    if(!array)
        return null;

    let res = [];
    for(let value of array) {
        res.push(fromObjectFunc(value));
    }
    return res;
};