

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
};