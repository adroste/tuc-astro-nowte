/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const shareSchema = new Schema({
    isFolder: {
        type: Boolean,
        required: [true, 'isFolder is required']
    },
    fileId: {
        type: Schema.Types.ObjectId,
        required: [true, 'fileId is required']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'userId is required']
    },
    permissions: {
        type: Schema.Types.Mixed,
        required: [true, 'permission is required']
    }
});


const Share = mongoose.model('Share', shareSchema);

module.exports.Share = Share;
