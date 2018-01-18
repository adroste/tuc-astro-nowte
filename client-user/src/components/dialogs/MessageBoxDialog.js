/**
 * @author Alexander Droste
 * @date 15.01.18
 */
import React from 'react';
import PropTypes from 'prop-types';
import {ModalDialog} from 'react-modal-dialog';
import {Button} from "../base/Button";
import {DialogResultEnum, DialogButtonsEnum, DialogButtonsContainer, DialogHeading, DialogMainContent} from "./Common";


export class MessageBoxDialog extends React.Component {
    /**
     * propTypes
     * @property {string} title title of the dialog
     * @property {function(result: DialogResultEnum)} onResult called on user result
     * @property {number} [buttons=DialogButtonsEnum.OK] defines buttons to show
     * @property {string} [buttonOkYesText] text of OK/Yes button
     * @property {string} [buttonOkYesTheme] theme of OK/Yes button
     * @property {string} [buttonCancelNoText] text of Cancel/No button
     * @property {string} [buttonCancelNoTheme] theme of Cancel/No button
     */
    static get propTypes() {
        return {
            title: PropTypes.string,
            onResult: PropTypes.func.isRequired,
            buttons: PropTypes.number,
            buttonOkYesText: PropTypes.string,
            buttonOkYesTheme: PropTypes.string,
            buttonCancelNoText: PropTypes.string,
            buttonCancelNoTheme: PropTypes.string,
        };
    }

    static get defaultProps() {
        return {
            buttons: DialogButtonsEnum.OK,
        };
    }


    get _buttonOkYesText() {
        return this.props.buttonOkYesText ? this.props.buttonOkYesText
                : (this.props.buttons === DialogButtonsEnum.OK ? 'OK' : 'Yes');
    }


    get _buttonCancelNoText() {
        return this.props.buttonCancelNoText ? this.props.buttonCancelNoText : "No";
    }


    _handleModalClose = () => {
        this.props.onResult(DialogResultEnum.CANCEL_NO);
    };


    _handleCancelNoClick = () => {
        this.props.onResult(DialogResultEnum.CANCEL_NO);
    };


    _handleOkYesClick = () => {
        this.props.onResult(DialogResultEnum.OK_YES);
    };


    render() {
        return (
            <ModalDialog
                className={this.props.className}
                onClose={this._handleModalClose}
            >
                <DialogHeading>
                    {this.props.title}
                </DialogHeading>
                <DialogMainContent>
                    {this.props.children}
                </DialogMainContent>
                <DialogButtonsContainer>
                    <Button
                        onClick={this._handleOkYesClick}
                        theme={this.props.buttonOkYesTheme}
                        marginLeft
                    >
                        {this._buttonOkYesText}
                    </Button>
                    {this.props.buttons === DialogButtonsEnum.YES_NO &&
                        <Button
                            onClick={this._handleCancelNoClick}
                            theme={this.props.buttonCancelNoTheme}
                            marginLeft
                        >
                            {this._buttonCancelNoText}
                        </Button>
                    }
                </DialogButtonsContainer>
            </ModalDialog>
        );
    }
}