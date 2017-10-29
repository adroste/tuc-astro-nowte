import React from 'react';
import PropTypes from 'prop-types';
import './LabelledInputBox.css';

/**
 * input box with label on top of it
 */
export default class LabelledInputBox extends React.Component {
    /**
     * propTypes
     * @property {string} label - text above the input box
     * @property {string} name name of the input box
     * @property {string} value value (text) of the input box
     * @property {function(text: string)} onChange callback when input box text was changed
     * @property {number} maxLength maximal character count
     * @property {string} type type of the input box. default is "text". See https://www.w3schools.com/tags/att_input_type.asp for more types.
     * @property {object} child a jsx object that will be displayed below the input box
     */
    static get propTypes() {
        return {
            label: PropTypes.string,
            name: PropTypes.string,
            value: PropTypes.string,
            onChange: PropTypes.func,
            maxLength: PropTypes.string,
            child: PropTypes.object,
        };
    }

    static get defaultProps() {
        return {
            maxLength: 10,
            type: "text",
            // null will keep the last value from the input box
            value: null,
            object: null,
        }
    }

    onChangeHandler = (event) => {
        // TODO do something cool
        if(this.props.onChange)
            this.props.onChange(event.target.value);
    };


    /**
     * hi
     * @returns {XML}
     */
    render() {
        return (
            <div className="LabelledInputBox">
                {this.props.label}
                <input
                    type={this.props.type}
                    name={this.props.name}
                    onChange={this.onChangeHandler}
                    maxLength={this.props.maxLength}

                    value={this.props.value? this.props.value: this.value}
                />
                {this.props.child}
            </div>
        );
    }

}