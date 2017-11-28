// helper class for the communication with the server

"use strict";

// helper for now
/**
 * @param num maximal number - 1
 * @return {number} integer between 0 and number - 1
 */
function getRand(num) {
    return Math.floor(Math.random() * num);
}

let randId = 1;

export const getFolder = (folderId, onSuccess, onError) => {
    // reply with dummy folder for now
    switch (getRand(3)){
        case 0:
            // empty folder
            onSuccess({docs: [{name: "my first document", id: randId++}]});
            return;
        case 1:
            onSuccess( {
                folder: [
                    {name: "my folder", id: randId++},
                    {name: "my other folder", id: randId++},
                ],
                docs: [
                    {name: "my file", id: randId++},
                    {name: "my other file", id: randId++},
                ],
            });
            return;
        case 2:
            onSuccess({
                docs: [
                    {name: "aaaaiiisd.txt", id: randId++},
                    {name: "test1233", id: randId++},
                    {name: "test12343", id: randId++},
                ],
            });
            return;
    }
    onError("unknown");
};

export const getShares = (userId, onSuccess, onError) => {
    switch (getRand(2))
    {
        case 0:
            onSuccess({
                users: [
                    {name: "peter", email: "peter1@2.de", id: randId++, docs: [{name: "mydoc1", id: randId++}], folder: []}
                ]
            });
            return;
        case 1:
            onSuccess({
                users: [
                    {name: "peter", email: "peter1@2.de", id: randId++, docs: [{name: "mydoc1", id: randId++}], folder: []},
                    {name: "hans", email: "hanspeter1@2.de", id: randId++, docs: [], folder: [{name: "my shared folder", id: randId++}]}
                ]
            });
            return;
    }
    onError("unknown");
};

export const createFile = (folderId, filename, onSuccess, onError) => {

};

export const createFolder = (folderId, foldername, onSuccess, onError) => {

};

export const removeFile = (fileId, onSuccess, onError) => {
    onSuccess();
};

export const removeFolder = (folderId, onSuccess, onError) => {
    onSuccess();
};

export const shareFile = (fileId, userId, permission, onSuccess, onError) => {

};

export const shareFolder = (fileId, userId, permission, onSuccess, onError) => {

};

export const renameFile = (fileId, title, onSuccess, onError) => {

};

export const renameFolder = (folderId, title, onSuccess, onError) => {

};

export const moveFile = (fileId, folderId, onSuccess, onError) => {

};

export const moveFolder = (srcFolderId, dstFolderId, onSuccess, onError) => {

};