/**
 * @author progmem
 * @date 22.10.17
 */

'use strict';

const validator = require('validator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email address is required'],
        validate: [validator.isEmail, 'Invalid email'],
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        validate: [(pass) => validator.isHash(pass, 'sha512'), 'Invalid password (no sha512 hash)']
    },
    folderId: {
        type: Schema.Types.ObjectId
    },
    created: {
        type: Date,
        default: Date.now
    },
    sessions: [sessionSchema]
});

const User = mongoose.model('User', userSchema);

module.exports.User = User;