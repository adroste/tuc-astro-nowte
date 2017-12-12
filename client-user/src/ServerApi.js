// helper class for the communication with the server
import { SERVER_URL } from "./Globals";
import {store} from "./Redux";

"use strict";

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

// see: https://gitlab.progmem.de/tuc/astro-nowte/wikis/server/api/rest/file/list-projects
export const getProjects = (onSuccess, onError) => {

    const sessionToken = store.getState().user.token;
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
export const createProject = (title, onSuccess, onError) => {

    const sessionToken = store.getState().user.token;
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