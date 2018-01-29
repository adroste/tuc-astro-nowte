/**
 * @author Alexander Droste
 * @date 29.01.18
 */


const Document = require('./Document');


class DocumentsManager {

    constructor() {
        /**
         * holds all open documents
         * @type {Array}
         * @private
         */
        this._openDocuments = [];
    }


    /**
     * Returns matching element from _openDocuments array
     * @param {string} projectId
     * @param {string} documentId
     * @returns {number} result is -1 if document was not found
     * @private
     */
    _findIndexOpenDocument(projectId, documentId) {
        return this._openDocuments.findIndex(elem => {
            return elem.projectId === projectId && elem.documentId === documentId;
        });
    }


    /**
     * Request/retrieve document from storage (db)
     * @param {string} projectId
     * @param {string} documentId
     * @returns {Document}
     * @private
     */
    _openDocument(projectId, documentId) {
        // TODO load doc from database
        // TODO check if requested document is assigned to this service

        const document = new Document(
            null,                                               // save callback
            () => this._closeDocument(projectId, documentId)    // exit callback
        );

        this._openDocuments.push({
            projectId,
            documentId,
            document
        });

        console.log('opened document: ' + documentId);

        return document;
    }


    _closeDocument(projectId, documentId) {
        const idx = this._findIndexOpenDocument(projectId, documentId);
        if (idx < 0)
            return;

        const d = this._openDocuments[idx];
        // TODO disconnect remaining clients

        // remove document from _openDocuments
        this._openDocuments.splice(idx, 1);

        console.log('closed document: ' + documentId);
    }


    /**
     * Returns Document instance for specified documentId
     * @param {string} projectId
     * @param {string} documentId
     * @returns {Document}
     * @todo check if user ist allowed to open document / document exists
     */
    getDocument(projectId, documentId) {
        const idx = this._findIndexOpenDocument(projectId, documentId);

        if (idx >= 0)
            return this._openDocuments[idx].document;

        return this._openDocument(projectId, documentId);
    }
}


module.exports = DocumentsManager;