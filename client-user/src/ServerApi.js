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

export const logOut = (onSuccess, onError) => {
    const sessionToken = store.getState().user.token;
    if(sessionToken === undefined){
        // already logged out
        onSuccess();
        return;
    }

    const url = SERVER_URL + '/api/user/logout';
    fetch(url, {
        method: "POST",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
            sessionToken: sessionToken,
        })
    }).then(
        (response) => verifyResponseCode(response, 204, onSuccess, onError),
        onError
    );
};

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
    const url = SERVER_URL + '/api/file/create-file';
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

export const shareFile = (fileId, userEmail, permission, onSuccess, onError) => {
    share(fileId, false, userEmail, permission, onSuccess, onError);
};

export const shareFolder = (fileId, userEmail, permission, onSuccess, onError) => {
    share(fileId, true, userEmail, permission, onSuccess, onError);
};

const share = (fileId, isFolder, userEmail, permission, onSuccess, onError) => {
    const sessionToken = store.getState().user.token;
    const url = SERVER_URL + '/api/file/create-share';
    fetch(url, {
        method: "POST",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
            sessionToken: sessionToken,
            fileId: fileId,
            isFolder: isFolder,
            permissions: permission,
            shareUserId: userEmail,
        })
    }).then(
        (response) => verifyResponseCode(response, 204, onSuccess, onError),
        onError
    );
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

// helper to retrieve the json from a response
const getJsonBody = (response, successStatusCode, onSuccess, onError) => {
    if(response.status === successStatusCode){
        response.json().then(onSuccess, onError);
    } else {
        response.json().then((data) => onError("code: " + response.status + " " + data.error.message), onError);
    }
};

// helper to check if the response code was correct
const verifyResponseCode = (response, successStatusCode, onSuccess, onError) => {
    if(response.status === successStatusCode) {
        onSuccess();
    } else {
        response.json().then((data) => onError("code: " + response.status + " " + data.error.message), onError);
    }
};