// helper class for the communication with the server
import { SERVER_URL } from "./Globals";
import {store} from "./Redux";

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
const REQUEST_HEADERS = new Headers({
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
});

export const getFolder = (folderId, onSuccess, onError) => {

    const sessionToken = store.getState().user.token;
    const url = SERVER_URL + '/api/file/list-folder/' + folderId + '?sessionToken=' + sessionToken;
    fetch(url, {
        method: "GET",
        headers: REQUEST_HEADERS,
    }).then(
        (response) => getJsonBody(response, 200, onSuccess, onError),
        onError
    );
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
    create(folderId, false, filename, onSuccess, onError);
};

export const createFolder = (folderId, foldername, onSuccess, onError) => {
    create(folderId, true, foldername, onSuccess, onError);
};

const create = (parentId, isFolder, title, onSuccess, onError) => {
    const sessionToken = store.getState().user.token;
    const url = SERVER_URL + '/api/file/create';
    fetch(url, {
        method: "POST",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
            sessionToken: sessionToken,
            parentId: parentId,
            isFolder: isFolder,
            title: title,
        })
    }).then(
        (response) => getJsonBody(response, 201, onSuccess, onError),
        onError
    );
};

export const removeFile = (fileId, onSuccess, onError) => {
    onSuccess();
};

export const removeFolder = (folderId, onSuccess, onError) => {
    onSuccess();
};

export const shareFile = (fileId, userId, permission, onSuccess, onError) => {
    onSuccess();
};

export const shareFolder = (fileId, userId, permission, onSuccess, onError) => {
    onSuccess();
};

export const renameFile = (fileId, title, onSuccess, onError) => {
    onSuccess();
};

export const renameFolder = (folderId, title, onSuccess, onError) => {
    onSuccess();
};

export const moveFile = (fileId, folderId, onSuccess, onError) => {
    onSuccess();
};

export const moveFolder = (srcFolderId, dstFolderId, onSuccess, onError) => {
    onSuccess();
};

export const getUserId = (email, onSuccess, onError) => {
    switch (email){
        case "someone@example.com":
            onSuccess(1);
            return;
        case "joe@example.com":
            onSuccess(2);
            return;
        case "max@mustermann.de":
            onSuccess(3);
            return;
    }
    onError("user not found");
};


// helper to retrieve the json from a response
const getJsonBody = (respone, successStatusCode, onSuccess, onError) => {
    if(respone.status === successStatusCode){
        respone.json().then(onSuccess, onError);
    } else {
        respone.json().then((data) => onError("code: " + respone.status + " " + data.error.message), onError);
    }
};