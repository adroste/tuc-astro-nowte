
class Brick {

    constructor(id) {
        this._id = id;

        // paths that are currently drawn (key = unique user id, value = path)
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

    /**
     *
     * @param userId unique user id
     * @param strokeStyle
     */
    handleBeginPath(userId, strokeStyle) {
        this._tempPaths[userId] = {
            strokeStyle: strokeStyle,
            points: [],
        }
    }

    /**
     * @param userId unique user id
     * @param points
     */
    handleAddPathPoints(userId, points) {
        const user = this._tempPaths[userId];
        if(!user)
            throw new Error("user has no unfinished path");
        // TODO is concat correct?
        user.points.concat(points);
    }

    /**
     * @param userId unique user id
     * @param spline
     */
    handleEndPath(userId, spline) {
        // remove temp path
        delete this._tempPaths[userId];
        this._splines.push(spline);
    }

    /**
     * @param userId unique user id
     */
    handleDisconnectClient(userId) {
        // remove path that was draw
        delete this._tempPaths[userId];

        // TODO send notification if line drawing was disrupted
    }
}

module.exports = Brick;