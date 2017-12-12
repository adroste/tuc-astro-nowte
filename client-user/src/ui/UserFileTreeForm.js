import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "./FileTree";
import * as API from '../ServerApi'
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import InputDialog from "./InputDialog";
import ShareDialog from "./ShareDialog";
import {store} from "../Redux";

// helper
const copy = (object) => {
    return JSON.parse(JSON.stringify(object));
};

/**
 * this renders the file tree of the user as well as files shared for him
 */
export default class UserFileTreeForm extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {};
    }

    static get defaultProps() {
        return {};
    }

    constructor(props){
        super(props);

        this.state = {
        };

    }

    componentDidMount() {

    }


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
                LoggedIn
            </div>
        );
    }
}