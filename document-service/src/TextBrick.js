const DrawBrick = require('./DrawBrick');
const err = require('./Error');

class TextBrick extends DrawBrick{

    constructor(id){
        super(id);

        this._text = "";
    }

    get _brickType(){
        return 1;
    }

    lean(){
        return Object.assign(super.lean(), {
            text: this._text,
        });
    }

    save() {
        return Object.assign(super.save(), {
            text: this._text,
        });
    }

    /**
     * loads data that was previously saved by save()
     * @param {object} data
     * @return {object} reference to self
     */
    load(data) {
        super.load(data);
        this._text = data.text;

        return this;
    }

    /**
     * removed deleted count characters at index and inserts insertedText afterwise
     * @param {array} changes changes in order
     */
    handleTextInsert(changes){

        let newText = "";
        let oldIdx = 0;
        for(let op of changes){
            if(op.r !== undefined) {
                // retain
                err.verifyType("retain", "number", op.r);
                err.verifyRange("retain", op.r, 0, this._text.length - oldIdx);
                newText = newText + this._text.substr(oldIdx, op.r);
                oldIdx += op.r;
            }
            else if(op.d !== undefined){
                // delete
                err.verifyType("delete", "number", op.d);
                err.verifyRange("delete", op.d, 0, this._text.length - oldIdx);
                oldIdx += op.r;
            } else if (op.i !== undefined){
                // insert
                err.verifyType("insert", "string", op.i);
                newText = newText + op.i;
            }
        }
        // TODO check if inserted text and deleted text is valid (valid html syntax)
        if(oldIdx < this._text.length){
            // append remaining
            newText = newText + this._text.substr(oldIdx);
        }

        this._text = newText;
    }
}

module.exports = TextBrick;