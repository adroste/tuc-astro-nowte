
const colorTable = [
      '#FF0000',
      '#0000FF',
      '#FFFF00',
      '#00FF00',
      '#00FFFF',
      '#F39C12',
      '#FF00FF',
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
     */
    registerUser(userId, id, name) {
        // generate a new color
        // TODO make a better algorithm maybe
        this._userInfo[userId] = {
            color: colorTable[this._curColorCode],
            id: id,
            name: name,
        };
        this._curColorCode = (this._curColorCode + 1) % colorTable.length;
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