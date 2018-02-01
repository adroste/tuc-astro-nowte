/**
 * @author Alexander Droste
 * @date 01.02.18
 */

const DocumentModel = require('../models/DocumentModel');
const ErrorUtil = require('../utilities/ErrorUtil');


/**
 * DocumentController contains methods for handling document-state
 */
class DocumentController {
    /**
     * Loads document data from db
     * @todo check if service instance is allowed to open document
     * @param {string} projectId id of project
     * @param {string} documentId id of document
     * @returns {Promise<*>} document data
     * @throws {Error} msg: 'documentId not found' with status: 404 if no document with specified id could be found
     */
    static async loadDocument(projectId, documentId) {
        let documentEntry;
        try {
            documentEntry = await DocumentModel.findById(documentId, {_id: 0, data: 1}).lean();
            //documentEntry = await DocumentModel.findById(documentId);
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(documentEntry == null, 'documentId not found', 404);

        return documentEntry.data;
    }


    /**
     * Saves document data to db
     * @todo check if service instance is allowed to save document
     * @param {string} projectId
     * @param {string} documentId
     * @param {object} data
     * @returns {Promise<void>}
     */
    static async saveDocument(projectId, documentId, data) {
        let rawResponseUpdate;
        try {
            rawResponseUpdate = await DocumentModel.update(
                {_id: documentId},
                {$set: {data: data}});
        } catch (err) {
            ErrorUtil.throwAndLog(err, 'unknown mongo error');
        }
        ErrorUtil.conditionalThrowWithStatus(rawResponseUpdate.n === 0, 'documentId not found', 404);
    }
}


module.exports = DocumentController;
