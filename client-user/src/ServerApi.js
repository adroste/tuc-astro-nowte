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

export const getFolder = (folderId, onSuccess, onError) => {
    // reply with dummy folder for now
    switch (getRand(3)){
        case 0:
            // empty folder
            onSuccess({docs: [{name: "my first document", id: 213}]});
            return;
        case 1:
            onSuccess( {
                folder: [
                    {name: "my folder", id: 123},
                    {name: "my other folder", id: 233},
                ],
                docs: [
                    {name: "my file", id: 1},
                    {name: "my other file", id: 2},
                ],
            });
            return;
        case 2:
            onSuccess({
                docs: [
                    {name: "aaaaiiisd.txt", id: 5},
                    {name: "test1233", id: 3},
                    {name: "test12343", id: 4},
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
                    {name: "peter", email: "peter1@2.de", id: 5, docs: [{name: "mydoc1", id: 14}], folder: []}
                ]
            });
            return;
        case 1:
            onSuccess({
                users: [
                    {name: "peter", email: "peter1@2.de", id: 5, docs: [{name: "mydoc1", id: 14}], folder: []},
                    {name: "hans", email: "hanspeter1@2.de", id: 6, docs: [], folder: [{name: "my shared folder", id: 2324}]}
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