/**
 * @author progmem
 * @date 12.11.17
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const folderSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'name is required']
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
        // null if root-dir
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'ownerId is required']
    },
    childIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Folder'
    }],
    documentIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }],
    shareIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Share'
    }]
});


/**
 * Mongoose Model of Folder Schema
 */
const FolderModel = mongoose.model('Folder', folderSchema);

module.exports = FolderModel;