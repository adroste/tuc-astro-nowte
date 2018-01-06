import React from 'react';
import PropTypes from 'prop-types';
import './Editor.css';

export class Editor extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {
            socketUrl: PropTypes.string,
            user: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    render() {
        return (
            <div className="wrapper">
                <div className="outer-page">
                    <div className="inner-page">
                        This is a fancy editor
                    </div>
                </div>
            </div>
        );
    }
}