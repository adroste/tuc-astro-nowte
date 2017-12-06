/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const docSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'name is required']
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
        required: [true, 'parentId is required']
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'ownerId is required']
    },
    shareIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Share'
    }],
    data: {
        type: Schema.Types.Mixed
    }
}, { usePushEach: true }); // TODO remove with mongoose v5


/**
 * Mongoose Model of Document Schema
 */
const DocumentModel = mongoose.model('Document', docSchema);

module.exports = DocumentModel;
