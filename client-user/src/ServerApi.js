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
            onSuccess({files: [{name: "my first document", id: 0}]});
            return;
        case 1:
            onSuccess( {
                folder: [
                    {name: "my folder", id: 1},
                    {name: "my other folder", id: 2},
                ],
                files: [
                    {name: "my file", id: 1},
                    {name: "my other file", id: 2},
                ],
            });
            return;
        case 2:
            onSuccess({
                files: [
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
                    {name: "peter", email: "peter1@2.de", docs: [{name: "mydoc1", id: 14}], folder: []}
                ]
            });
            return;
        case 1:
            onSuccess({
                users: [
                    {name: "hans", email: "hanspeter1@2.de", docs: [], folder: [{name: "my shared folder", id: 2324}]}
                ]
            });
            return;
    }
    onError("unknown");
};