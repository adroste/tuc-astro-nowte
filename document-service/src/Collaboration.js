
const colorTable = [
      '#ad2e24',
      '#2e2ebd',
      '#bbbb2e',
      '#2e802e',
      '#3e9090',
      '#cd662e',
      '#a000a0',
];

class Collaboration{

    constructor(){
        // pointers of other users
        this._pointer = {};

        // colors of other users
        this._userInfo = {};

        this._curColorCode = 0;
    }

    // serialize data for new clients
    lean(){
        return {
            pointer: this._pointer,
            userInfo: this._userInfo,
        }
    }

    /**
     *
     * @param userId unique user id (e.g. session token)
     * @param id general user id
     * @param name username
     * @return returns the user color code
     */
    registerUser(userId, id, name) {
        // generate a new color
        // TODO make a better algorithm maybe
        const color = colorTable[this._curColorCode];

        this._userInfo[userId] = {
            color: color,
            id: id,
            name: name,
        };
        this._curColorCode = (this._curColorCode + 1) % colorTable.length;

        return color;
    }

    /**
     *
     * @param userId
     * @return {color, id, name | undefined}
     */
    getUserInfo(userId) {
        return this._userInfo[userId];
    }

    unregisterUser(userId) {
        delete this._pointer[userId];
        delete this._userInfo[userId];
    }

    /**
     * sets the current mouse position for the user
     * @param userId
     * @param point
     */
    handleUserPointer(userId, point) {
        this._pointer[userId] = point;
    }
}

module.exports = Collaboration;