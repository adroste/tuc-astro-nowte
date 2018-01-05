import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export default class Button extends React.Component {
    /**
     * propTypes
     * @property {string} label text on the button
     * @property {function()} onClick callback when button was clicked
     */
    static get propTypes() {
        return {
            label: PropTypes.string,
            onClick: PropTypes.func
        };
    }

    static get defaultProps() {
        return {

        };
    }

    onClickHandler = (event) => {
        if(this.props.onClick)
            this.props.onClick();
    };

    render() {
        return (
            <div className="button" onClick={this.onClickHandler} tabIndex="0">
                {this.props.label}
            </div>
        );
    }
}