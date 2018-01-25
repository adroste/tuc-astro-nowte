

module.exports = {
    verifyType: function(name, type, value){
        if(typeof value !== type){
            throw new Error(`${name} invalid type, expected ${type} but got ${typeof value}`);
        }
    },

    verifyRange: function (name, value, min, max) {
        if(value < min || value > max){
            throw new Error(`${name} invalid range, expected [${min}, ${max}] but got ${value}`);
        }
    },

    /**
     * verifies if an object is an array and applies comparator on all array elements
     * Example: verifyArray("myArray", [1,2], (arrayValue) => verifyType("myArray value", "number", arrayValue));
     * @param name {string} description of the array
     * @param value {array} object that should be an array
     * @param comparator {function(object)|null} function that will be applied on all array elements
     */
    verifyArray: function (name, value, comparator) {
        if(!(Array.isArray(value)))
            throw new Error(`${name} invalid type, expected array but got ${typeof value}`);

        if(comparator) {
            for (let obj of value) {
                comparator(obj);
            }
        }
    },

    /**
     * verifies a (complex) javascript object
     * @param name
     * @param expected
     * @param value
     */
    verifyObject: function (name, expected, value) {
        this.verifyType(name, "object", value);

        for(let key of Object.keys(expected)){
            // is the key in value?
            if(value[key] === undefined)
                throw new Error("missing key " + key + " in " + name);

            // is the value valid
            expected[key](value[key]);
        }
    },

    verifyPoint: function (name, value) {
        this.verifyObject(name, {
            x: (value) => this.verifyType("x", "number", value),
            y: (value) => this.verifyType("y", "number", value),
        }, value);
    }
};