/**
 * @author progmem
 * @date 26.11.17
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const docSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'projectId is required']
    },
    createdById: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'createdById is required']
    },
    data: {
        type: Schema.Types.Mixed
    }
});


/**
 * Mongoose Model of Document Schema
 */
const DocumentModel = mongoose.model('Document', docSchema);

module.exports = DocumentModel;
