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
     * Request/retrieve document from storage (db)
     * @param {string} projectId
     * @param {string} documentId
     * @returns {Document}
     * @private
     */
    _openDocument(projectId, documentId) {
        // TODO load doc from database
        // TODO check if requested document is assigned to this service

        const document = new Document();

        this._openDocuments.push({
            projectId,
            documentId,
            document
        });

        return document;
    }


    /**
     * Returns Document instance for specified documentId
     * @param {string} projectId
     * @param {string} documentId
     * @returns {Document}
     * @todo check if user ist allowed to open document / document exists
     */
    getDocument(projectId, documentId) {
        let d = this._openDocuments.find(elem => {
            return elem.projectId === projectId && elem.documentId === documentId;
        });

        if (d)
            return d.document;

        return this._openDocument(projectId, documentId);
    }
}


module.exports = DocumentsManager;