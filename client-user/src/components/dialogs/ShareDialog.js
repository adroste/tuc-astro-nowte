import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {ModalDialog} from 'react-modal-dialog';
import {COLOR_CODES} from "../../Globals";
import {Button, greyBorderTheme} from "../base/Button";
import "./ShareDialog.css"
import * as API from '../../ServerApi'
import DropdownMenu from "../base/DropdownMenu";
import {DialogButtonsContainer, DialogHeading, DialogMainContent} from "./Common";
import {ValidatedInputField} from "../base/ValidatedInputField";
import {INPUT_TYPES, greyTheme} from "../base/InputField";
import {validateStringNotEmptyCustomMessage} from "../../utilities/inputFieldValidators";


const ShareList = styled.div`
    width: 450px;
    height: 250px;
    overflow: scroll;
    border-radius: 5px;
    border: 1px solid ${COLOR_CODES.GREY_LIGHT};
`;


export default class ShareDialog extends React.Component {
    /**
     * propTypes
     * @property {string} title title of the dialog
     * @property {function()} onClose called when user closed dialog
     * @property {string} projectId id of the project
     * @property {object} user user state
     */
    static get propTypes() {
        return {
            title: PropTypes.string,
            onClose: PropTypes.func.isRequired,
            projectId: PropTypes.string.isRequired,
            user: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    constructor(props){
        super(props);

        this.state = {
            users: [],
            shareEmail: '',
            shareEmailValidation: false,
            sharePermission: 5,
        };
    }


    componentDidMount() {
        this._getShares();
    }


    _getShares = () => {
        API.getShares(this.props.user.token, this.props.projectId, this._handleShareList, this._handleError);
    };


    _handleShareList = (body) => {
        const users = [];
        for(let share of body){
            users.push({
                name: share.user.name,
                email: share.user.email,
                permissions: share.permissions,
            });
        }

        this.setState({users});
    };


    _handleShareClick = () => {
        if(!this.state.shareEmailValidation)
            return;

        API.share(this.props.user.token, this.props.projectId, this.state.shareEmail, this.state.sharePermission, this._handleShared, this._handleError);
    };


    _handleShared = () => {
        this._getShares();
    };


    _handleError = (error) => {
        // TODO: proper error handling
        alert(error);
    };


    _getShareListItems = () => {
        let shares = [];

        for(let user of this.state.users){
            shares.push(
                <div key={user.email}>
                    name: {user.name} email: {user.email} permission: {user.permissions}
                </div>);
        }

        return shares;
    };


    render() {
        return (
            <ModalDialog
                className={this.props.className}
                onClose={this.props.onClose}
            >
                <DialogHeading>
                    {this.props.title}
                </DialogHeading>
                <DialogMainContent>
                    <ShareList>
                        {this._getShareListItems()}
                    </ShareList>
                    <ValidatedInputField
                        name="email"
                        type={INPUT_TYPES.TEXT}
                        onInputChange={(shareEmail) => this.setState({shareEmail})}
                        onValidationResultChange={(success) => this.setState({shareEmailValidation: success})}
                        value={this.state.shareEmail}
                        placeholder="email of user"
                        validator={validateStringNotEmptyCustomMessage(null)}
                        defaultTheme={greyTheme}
                        errorTheme={greyTheme}
                    />

                    <DropdownMenu label="Permisson" entrys={["NONE","READ","ANNOTATE","EDIT","MANAGE","OWNER"]}/>
                    <Button onClick={this._handleShareClick}>
                        Share
                    </Button>
                </DialogMainContent>
                <DialogButtonsContainer>
                    <div className="align-right">
                        <Button
                            onClick={this.props.onClose}
                            theme={greyBorderTheme}
                        >
                            Close
                        </Button>
                    </div>
                </DialogButtonsContainer>
            </ModalDialog>
        );
    }
}