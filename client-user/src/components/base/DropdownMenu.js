import React from 'react';
import PropTypes from 'prop-types';
import './DropdownMenu.css';


export default class DropdownMenu extends React.Component {

    /**
     * propTypes
     * @property {string} label for the Dropdownmenue
     * @property {string} Array of entrys for the Dropdown
     * @property {function()} onClick callback for openig dropdown
     */
    static get propTypes() {
        return {
            label: PropTypes.string,
            entrys: PropTypes.array,
            onclick: PropTypes.func
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
            <div className="dropdown" onClick={this.onClickHandler}>
                <button className="dropbtn">{this.props.label}</button>
                <div className="dropdown-content">
                    {this.props.entrys.map((entry) => <ul>{entry}</ul>)}
                </div>
            </div>
        );
    }
}