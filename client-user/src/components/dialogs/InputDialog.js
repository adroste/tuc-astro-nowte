import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import LabelledInputBox from "../base/LabelledInputBox";
import Button from "../base/Button";
import "./InputDialog.css"

export default class InputDialog extends React.Component {
    /**
     * propTypes
     * onCreate {function(name: string)} callback when create was clicked. name is the value of the input box
     * onCancel {function()} callback when dialog was forcibly closed
     * title {string} title of the box
     */
    static get propTypes() {
        return {
            onCreate: PropTypes.func.isRequired,
            onCancel: PropTypes.func.isRequired,
            title: PropTypes.string
        };
    }

    static get defaultProps() {
        return {};
    }

    // variables
    text = "";

    handleCreate = () => {
        if(this.text === "")
            return;

        // forward
        this.props.onCreate(this.text);
    };

    render() {
        return (
            <ModalDialog onClose={this.props.onCancel}  width="400px">
                <h1>{this.props.title}</h1>
                <LabelledInputBox
                    placeholder="filename"
                    value={this.text}
                    onChange={(value) => this.text = value}
                    maxLength={255}
                />

                <div className="align-right">
                    <Button
                        label="Cancel"
                        onClick={this.props.onCancel}
                    />
                    <Button
                        label="Create"
                        onClick={this.handleCreate}
                    />
                </div>
            </ModalDialog>
        );
    }
}