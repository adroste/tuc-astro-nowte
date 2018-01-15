
class Document {

    constructor() {
        this.bricks = [];
    }

    handleInsertBrick(user, heightIndex, brickId) {
        try {
            if (typeof heightIndex !== typeof 1)
                throw new Error("invalid height");
            if (heightIndex < 0 || heightIndex > this.bricks.length)
                throw new Error("height index out of range");

            // create entry
            this.bricks.splice(heightIndex, 0, {id: brickId});
        }
        catch (e){
            console.log("Error handleInsertBrick: " + e.message);
        }
    }
}

module.exports = Document;