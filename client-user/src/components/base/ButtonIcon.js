import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export default class ButtonIcon extends React.Component {
    /**
     * propTypes
     * @property {string} imgSrc, path to source of icon picture
     * @property {string} label text on the button next to the icon
     * @property {function()} onClick callback when button was clicked
     */
    static get propTypes() {
        return {
            imgSrc: PropTypes.string,
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
            <div className="button" onClick={this.onClickHandler}>
                <img src={this.props.imgSrc} alt={"Icon missing"}/>
                {this.props.label}
            </div>
        );
    }
}