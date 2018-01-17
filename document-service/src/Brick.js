
class Brick {

    constructor(id) {
        this._id = id;

        // paths that are currently drawn (dictionary with user id)
        this._tempPaths = {};
        // finished splines
        this._splines = [];
    }

    // serialize data for new clients
    lean() {
        return {
            paths: this._tempPaths,
            splines: this._splines,
        }
    }

    get id() {
        return this._id;
    }

    handleBeginPath(userId, strokeStyle) {
        this._tempPaths[userId] = {
            strokeStyle: strokeStyle,
            points: [],
        }
    }

    handleAddPathPoints(userId, points) {
        const user = this._tempPaths[userId];
        if(!user)
            throw new Error("user has no unfinished path");
        // TODO is concat correct?
        user.points.concat(points);
    }

    handleEndPath(userId, spline) {
        // remove temp path
        this._tempPaths[userId] = undefined;
        this._splines.push(spline);
    }

    handleDisconnectClient(userId) {
        // remove path that was draw
        this._tempPaths[userId] = undefined;

        // TODO send notification if line drawing was disrupted
    }
}

module.exports = Brick;