// helper class for the communication with the server
import { SERVER_URL } from "./Globals";

// eslint-disable-next-line
'use strict';

const REQUEST_HEADERS = new Headers({
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
});


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


export const logout = (sessionToken, onSuccess, onError) => {
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

// see: https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/list-projects
export const getProjects = (sessionToken, onSuccess, onError) => {
    if(typeof sessionToken !== "string")
        throw new Error("session token should be a string");

    const url = SERVER_URL + '/api/file/list-projects?sessionToken=' + sessionToken;
    fetch(url, {
        method: "GET",
        headers: REQUEST_HEADERS,
    }).then(
        (response) => getJsonBody(response, 200, onSuccess, onError),
        onError
    );
};

// see: https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/create-project
export const createProject = (sessionToken, title, onSuccess, onError) => {
    if(typeof sessionToken !== "string")
        throw new Error("session token should be a string");

    const url = SERVER_URL + '/api/file/create-project';
    fetch(url, {
        method: "POST",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
            sessionToken: sessionToken,
            title: title,
        })
    }).then(
        (response) => getJsonBody(response, 201, onSuccess, onError),
        onError
    );
};

// see https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/list-tree
export const getFileTree = (sessionToken, projectId, onSuccess, onError) => {
    if(typeof sessionToken !== "string")
        throw new Error("session token should be a string");

    const url = SERVER_URL + '/api/file/list-tree/' + projectId + '?sessionToken=' + sessionToken;
    fetch(url, {
        method: "GET",
        headers: REQUEST_HEADERS,
    }).then(
        (response) => getJsonBody(response, 200, onSuccess, onError),
        onError
    );
};

// see https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/create-path
export const createFolder = (sessionToken, projectId, path, onSuccess, onError) => {
    if(typeof sessionToken !== "string")
        throw new Error("session token should be a string");

    const url = SERVER_URL + '/api/file/create-path';
    fetch(url, {
        method: "POST",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
            sessionToken: sessionToken,
            projectId: projectId,
            path: path,
        })
    }).then(
        (response) => verifyResponseCode(response, 204, onSuccess, onError),
        onError
    );
};

// see https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/create-document
export const createDocument = (sessionToken, projectId, path, title, createPath, onSuccess, onError) => {
    if(typeof sessionToken !== "string")
        throw new Error("session token should be a string");

    const url = SERVER_URL + '/api/file/create-document';
    fetch(url, {
        method: "POST",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
            sessionToken: sessionToken,
            projectId: projectId,
            path: path,
            title: title,
            upsertPath: createPath,
        })
    }).then(
        (response) => getJsonBody(response, 201, onSuccess, onError),
        onError
    );
};

// see https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/delete-path
export const deleteFolder = (sessionToken, projectId, path, onSuccess, onError) => {
    if(typeof sessionToken !== "string")
        throw new Error("session token should be a string");

    const url = SERVER_URL + '/api/file/delete-path';

    fetch(url, {
        method: "DELETE",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
            sessionToken: sessionToken,
            projectId: projectId,
            path: path,
        })
    }).then(
        (response) => verifyResponseCode(response, 204, onSuccess, onError),
        onError
    );
};

// see https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/delete-document
export const deleteDocument = (sessionToken, projectId, path, documentId, onSuccess, onError) => {
    if(typeof sessionToken !== "string")
        throw new Error("session token should be a string");

    const url = SERVER_URL + '/api/file/delete-document';

    fetch(url, {
        method: "DELETE",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
            sessionToken: sessionToken,
            projectId: projectId,
            path: path,
            documentId: documentId,
        })
    }).then(
        (response) => verifyResponseCode(response, 204, onSuccess, onError),
        onError
    );
};

// see https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/delete-project
export const deleteProject = (sessionToken, projectId, onSuccess, onError) => {
    if(typeof sessionToken !== "string")
        throw new Error("session token should be a string");

    const url = SERVER_URL + '/api/file/delete-project';

    fetch(url, {
        method: "DELETE",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
            sessionToken: sessionToken,
            projectId: projectId,
        })
    }).then(
        (response) => verifyResponseCode(response, 204, onSuccess, onError),
        onError
    );
};

// see https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/set-access
export const share = (sessionToken, projectId, email, permissions, onSuccess, onError) => {
    if(typeof sessionToken !== "string")
        throw new Error("session token should be a string");

    const url = SERVER_URL + '/api/file/set-access';

    fetch(url, {
        method: "PUT",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
            sessionToken: sessionToken,
            projectId: projectId,
            shareEmail: email,
            permissions: permissions,
        })
    }).then(
        (response) => verifyResponseCode(response, 204, onSuccess, onError),
        onError
    );
};

// see https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/list-access
export const getShares = (sessionToken, projectId, onSuccess, onError) => {
    if(typeof sessionToken !== "string")
        throw new Error("session token should be a string");

    const url = SERVER_URL + '/api/file/list-access/' + projectId + "?sessionToken=" + sessionToken;

    fetch(url, {
        method: "GET",
        headers: REQUEST_HEADERS,
    }).then(
        (response) => getJsonBody(response, 200, onSuccess, onError),
        onError
    );
};