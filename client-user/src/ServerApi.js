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