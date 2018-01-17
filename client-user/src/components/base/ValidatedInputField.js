/**
 * @author Alexander Droste
 * @date 16.01.18
 */
import React from 'react';
import PropTypes from 'prop-types';
import {errorTheme, greyTheme, INPUT_TYPES, InputField} from "./InputField";


export class ValidatedInputField extends React.Component {
    /**
     * propTypes
     * @property {string} [label] text above the input box
     * @property {string} [name] name of the input box
     * @property {string} value value (text) of the input box
     * @property {function(text: string)} onInputChange callback when input box text was changed
     * @property {function(success: boolean)} onValidationResultChange callback when validation result changes
     * @property {number} [maxLength=100] maximal character count
     * @property {string} [type=INPUT_TYPES.TEXT] type of the input box
     * @property {string} [placeholder] string that will be displayed in the background
     * @property {function(text: string, cb: function(success: boolean, display: Object))} validator used to validate user input
     * @property {object} [defaultTheme] default theme-template to apply
     * @property {object} [errorTheme] theme-template to apply on validation error
     */
    static get propTypes() {
        return {
            label: PropTypes.string,
            name: PropTypes.string,
            value: PropTypes.string.isRequired,
            onInputChange: PropTypes.func.isRequired,
            onValidationResultChange: PropTypes.func.isRequired,
            maxLength: PropTypes.number,
            type: PropTypes.string,
            placeholder: PropTypes.string,
            validator: PropTypes.func.isRequired,
            defaultTheme: PropTypes.object,
            errorTheme: PropTypes.object,
            // TODO 'success' theme
        };
    }

    static get defaultProps() {
        return {
            maxLength: 100,
            type: INPUT_TYPES.TEXT,
            defaultTheme: greyTheme,
            errorTheme: errorTheme
        }
    }


    constructor(props) {
        super(props);

        this.state = {
            validationSuccess: null,
            validationDisplay: null,
        };
    }


    handleValidationResult = (success, display) => {
        if (this.state.validationSuccess !== success)
            this.props.onValidationResultChange(success);

        this.setState({
            validationSuccess: success,
            validationDisplay: display
        });
    };


    _onChangeHandler = (text) => {
        this.props.onInputChange(text);
        this.props.validator(text, this.handleValidationResult);
    };


    render() {
        return (
            <InputField
                className={this.props.className}
                label={this.props.label}
                name={this.props.name}
                type={this.props.type}
                onInputChange={this._onChangeHandler}
                maxLength={this.props.maxLength}
                value={this.props.value}
                placeholder={this.props.placeholder}
                theme={this.state.validationSuccess === false ? this.props.errorTheme : this.props.defaultTheme}
            >
                {this.state.validationDisplay}
            </InputField>
        );
    }

}