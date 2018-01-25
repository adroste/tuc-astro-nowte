
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
        this._colors = {};

        this._curColorCode = 0;
    }

    // serialize data for new clients
    lean(){
        return {
            pointer: this._pointer,
            colors: this._colors,
        }
    }

    registerUser(userId) {
        // generate a new color
        // TODO make a better algorithm maybe
        this._colors[userId] = colorTable[this._curColorCode];
        this._curColorCode = (this._curColorCode + 1) % colorTable.length;
    }

    unregisterUser(userId) {
        delete this._pointer[userId];
        delete this._colors[userId];
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