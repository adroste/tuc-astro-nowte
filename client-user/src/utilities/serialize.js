/**
 * calls the serialize function on each array member
 * @param {Array|null} array
 * @return {Array|null}
 */
export const serializeArray = (array) => {
    if(!array)
        return null;

    let res = [];
    for(let value of array){
        res.push(value.serialize());
    }
    return res;
};

/**
 * calls the deserializer function for each object in the array
 * @param {Array|null} array
 * @param {function(object)} deserializer
 * @return {Array|null}
 */
export const deserializeArray = (array, deserializer) => {
    if(!array)
        return null;

    let res = [];
    for(let value of array) {
        res.push(deserializer(value));
    }
    return res;
};