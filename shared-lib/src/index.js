/**
 * @author Alexander Droste
 * @date 31.01.18
 */

const ConfigTool = require('./ConfigTool');
const dbConnection = require('./init/mongo-init');
const mailer = require('./init/mailer-init');

const FileController = require('./controller/FileController');
const UserController = require('./controller/UserController');
const DocumentController = require('./controller/DocumentController');

const DocumentModel = require('./models/DocumentModel');
const ProjectModel = require('./models/ProjectModel');
const UserModel = require('./models/UserModel');

const ErrorUtil = require('./utilities/ErrorUtil');
const FileUtil = require('./utilities/FileUtil');
const PermissionsEnum = require('./utilities/PermissionsEnum');
const UserUtil = require('./utilities/UserUtil');


module.exports = {
    ConfigTool: ConfigTool,
    dbConnection: dbConnection,
    mailer: mailer,
    controller: {
        FileController: FileController,
        UserController: UserController,
        DocumentController: DocumentController
    },
    models: {
        DocumentModel: DocumentModel,
        ProjectModel: ProjectModel,
        UserModel: UserModel
    },
    utilities: {
        ErrorUtil: ErrorUtil,
        FileUtil: FileUtil,
        PermissionsEnum: PermissionsEnum,
        UserUtil: UserUtil
    }
};