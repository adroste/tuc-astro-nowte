
class Brick {

    constructor(id) {
        this._id = id;

        // paths that are currently drawn (key = user id, value = path)
        this._tempPaths = {};
        // finished splines
        this._splines = [];
    }

    // serialize data for new clients
    lean() {
        const paths = [];
        // just take stroke style and points from tempPaths
        for(let userId of Object.keys(this._tempPaths)){
            paths.push(this._tempPaths[userId]);
        }

        return {
            id: this._id,
            paths: paths,
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
        delete this._tempPaths[userId];
        this._splines.push(spline);
    }

    handleDisconnectClient(userId) {
        // remove path that was draw
        delete this._tempPaths[userId];

        // TODO send notification if line drawing was disrupted
    }
}

module.exports = Brick;