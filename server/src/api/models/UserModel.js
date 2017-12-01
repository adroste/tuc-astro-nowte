/**
 * @author progmem
 * @date 22.10.17
 */

'use strict';


const validator = require('validator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const sessionSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    expires: {
        type: Date
    },
    description: {
        type: String
    }
});

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'email is required'],
        validate: [(email) => validator.isEmail(email), 'invalid email'],
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    folderId: {
        type: Schema.Types.ObjectId,
        ref: 'Folder'
    },
    created: {
        type: Date,
        default: Date.now
    },
    emailValidated: {
        type: Boolean,
        default: false
    },
    sessions: [sessionSchema]
});

/**
 * Mongoose Model of User Schema
 */
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;