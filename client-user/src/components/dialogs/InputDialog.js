import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {InputField} from "../base/InputField";
import {DialogButtonsEnum} from "./Common";
import {MessageBoxDialog} from "./MessageBoxDialog";


const FixedWidthInputField = styled(InputField)`
    width: 300px;
`;


export default class InputDialog extends React.Component {
    /**
     * propTypes
     * @property {string} title title of the dialog
     * @property {function(result: DialogResultEnum, inputText: string)} onResult called on user result
     * @property {number} [buttons=DialogButtonsEnum.OK] defines buttons to show
     * @property {string} [buttonOkYesText] text of OK/Yes button
     * @property {string} [buttonOkYesTheme] theme of OK/Yes button
     * @property {string} [buttonCancelNoText] text of Cancel/No button
     * @property {string} [buttonCancelNoTheme] theme of Cancel/No button
     * @property {string} [placeholder] string that will be displayed in the background of the input field
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
            placeholder: PropTypes.string
        };
    }

    static get defaultProps() {
        return {
            buttons: DialogButtonsEnum.OK,
        };
    }


    constructor(props) {
        super(props);

        this.state = {
            inputText: "",
        };
    }


    _handleResult = (result) => {
        this.props.onResult(result, this.state.inputText);
    };


    render() {
        return (
            <MessageBoxDialog 
                className={this.props.className}  
                title={this.props.title}
                onResult={this._handleResult}
                buttons={this.props.buttons}
                buttonOkYesText={this.props.buttonOkYesText}
                buttonOkYesTheme={this.props.buttonOkYesTheme}
                buttonCancelNoText={this.props.buttonCancelNoText}
                buttonCancelNoTheme={this.props.buttonCancelNoTheme}
            >
                <FixedWidthInputField
                    placeholder={this.props.placeholder}
                    value={this.state.inputText}
                    onInputChange={(inputText) => this.setState({inputText})}
                    maxLength={255}
                />
            </MessageBoxDialog>
        );
    }
}