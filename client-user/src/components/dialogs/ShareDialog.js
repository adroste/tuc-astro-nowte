import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {ModalDialog} from 'react-modal-dialog';
import {COLOR_CODES, FONT_SIZES} from "../../Globals";
import {Button, greyBorderTheme, greenFilledTheme} from "../base/Button";
import * as API from '../../ServerApi'
import DropdownMenu from "../base/DropdownMenu";
import {DialogButtonsContainer, DialogHeading, DialogMainContent} from "./Common";
import {ValidatedInputField} from "../base/ValidatedInputField";
import {INPUT_TYPES, greyTheme} from "../base/InputField";
import {validateStringNotEmptyCustomMessage} from "../../utilities/inputFieldValidators";


const ShareList = styled.div`
    width: 550px;
    height: 250px;
    overflow: scroll;
    border-radius: 5px;
    border: 1px solid ${COLOR_CODES.GREY_LIGHT};
    font-size: ${FONT_SIZES.NORMAL};
    padding: 5px;
`;


const SubInfo = styled.div`
    font-size: ${FONT_SIZES.SMALL};
    color: ${COLOR_CODES.GREY};
`;


const ShareListItem = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${COLOR_CODES.GREY_LIGHT};
    display: flex;
    align-items: center;
    justify-content: center;
`;


const ShareListItemLeftInner = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;


const AddShareControlsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;


const ValidatedInputFieldFlex = styled(ValidatedInputField)`
    flex: 1;
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
        for(let access of body){
            users.push(Object.assign({}, access));
        }
        this.setState({users});
    };


    _setAccess = (email, permissions) => {
        API.share(this.props.user.token, this.props.projectId, email, permissions, this._handleShared, this._handleError);        
    };


    _handleShareClick = () => {
        if(!this.state.shareEmailValidation)
            return;
        this._setAccess(this.state.shareEmail, this.state.sharePermission);
    };


    _handlePermissionsChange = () => {
        // TODO implement
        throw new Error('not implemented yet');
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

        for(let access of this.state.users){
            shares.push(
                <ShareListItem key={access.user.email}>
                    <ShareListItemLeftInner>
                        <div>
                            <div>
                                {access.user.name} ({access.user.email})
                            </div>
                            <SubInfo>
                                Shared by: {access.grantedBy.name} ({access.grantedBy.email})
                            </SubInfo>
                        </div>
                    </ShareListItemLeftInner>
                    permission: {access.permissions}
                    
                </ShareListItem>);
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
                    <AddShareControlsContainer>
                        <ValidatedInputFieldFlex
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
                        <Button 
                            onClick={this._handleShareClick}
                            theme={greenFilledTheme}
                            marginLeft
                        >
                            Share
                        </Button>
                    </AddShareControlsContainer>
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