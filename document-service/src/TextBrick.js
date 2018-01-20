const DrawBrick = require('./DrawBrick');

class TextBrick extends DrawBrick{

    constructor(id){
        super(id);
    }

    get _brickType(){
        return 1;
    }
}

module.exports = TextBrick;