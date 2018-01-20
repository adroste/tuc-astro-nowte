
class DrawBrick {

    constructor(id) {
        this._id = id;

        // paths that are currently drawn (key = unique user id, value = path)
        this._tempPaths = {};
        // finished splines {id, spline} pair
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
            type: this._brickType,
            paths: paths,
            splines: this._splines,
        }
    }

    get _brickType(){
        return 0;
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
     * @param id
     */
    handleEndPath(userId, spline, id) {
        // remove temp path
        delete this._tempPaths[userId];
        this._splines.push({
            spline: spline,
            id: id,
        });
    }

    handleEraseSplines(ids) {
        // make ids to a dictionary for faster access
        const idDict = {};
        for(let id of ids){
            idDict[id] = true;
        }

        // remove splines with matching ids
        this._splines = this._splines.filter((value) => {
            return idDict[value.id] !== true;
        });
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

module.exports = DrawBrick;