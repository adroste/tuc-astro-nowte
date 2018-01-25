
class Collaboration{

    constructor(){
        this._tempPaths = {};
    }

    // serialize data for new clients
    lean(){
        return {
            // TODO information correct
            paths: this._tempPaths,
        }
    }

    handleBeginPath(userId) {
        this._tempPaths[userId] = [];
    }

    handleAddPathPoints(userId, points) {
        const user = this._tempPaths[userId];
        if(!user)
            throw new Error("user has no magic path");
        user.concat(points);
    }

    handleEndPath(userId) {
        delete this._tempPaths[userId];
    }
}

module.exports = Collaboration;