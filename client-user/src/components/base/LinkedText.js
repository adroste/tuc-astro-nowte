import React from 'react';
import PropTypes from 'prop-types';
import './LinkedText.css';

/**
 * text that looks like a link and can be clicked
 */
export default class LinkedText extends React.Component {
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
        return {};
    }

    onClickHandler = (event) => {
        if(this.props.onClick)
            this.props.onClick();
    };

    render() {
        return (
            <span onClick={this.onClickHandler} className="linked-text" tabIndex="0">{this.props.label}</span>
        );
    }
}