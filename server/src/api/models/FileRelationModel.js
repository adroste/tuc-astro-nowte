/**
 * @author progmem
 * @date 09.12.17
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const fileRelationSchema = new Schema({
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
        required: [true, 'parentId is required']
    },
    childId: {
        type: Schema.Types.ObjectId,
        required: [true, 'childId is required']
    },
    isFolder: {
        type: Boolean,
        required: [true, 'isFolder is required']
    },
    distance: {
        type: Number,
        required: [true, 'distance is required']
    }
});


/**
 * Mongoose Model of FileRelation Schema
 */
const FileRelationModel = mongoose.model('FileRelation', fileRelationSchema);

module.exports = FileRelationModel;
