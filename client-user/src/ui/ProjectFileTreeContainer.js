import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "./FileTree";
import * as API from '../ServerApi'
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import InputDialog from "./InputDialog";
import ShareDialog from "./ShareDialog";
import {store} from "../Redux";
import Button from "./base/Button";
import LinkedText from "./base/LinkedText";

// helper
const copy = (object) => {
    return JSON.parse(JSON.stringify(object));
};

/**
 * this renders the file tree of the user as well as files shared for him
 */
export default class ProjectFileTreeContainer extends React.Component {

    /**
     * propTypes
     */
    static get propTypes() {
        return {
            projectId: PropTypes.string.isRequired,
            projectTitle: PropTypes.string.isRequired,
            permissions: PropTypes.number.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    constructor(props){
        super(props);


    }

    componentDidMount() {
        API.getFileTree(this.props.projectId, this.handleFileTreeReceive, this.handleError);
    }

    handleFileTreeReceive = (body) => {
        alert(JSON.stringify(body));
    };

    handleError = (msg) => {
        alert(msg);
    };

    render() {
        /*return (
            <div>
                {this.getFileTree("My Files", this.state.root, this.userId)}
                {this.state.activeDialog?
                    <ModalContainer onClose={() => {}}>
                        {this.state.activeDialog}
                    </ModalContainer>:''}

            </div>
        );*/
        return (
            <div>
                <h3>Project</h3>
            </div>
        );
    }
}