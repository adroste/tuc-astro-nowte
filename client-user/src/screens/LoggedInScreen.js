import React from 'react';
import PropTypes from 'prop-types';
import FileTree from "../ui/FileTree";

export default class LoggedInScreen extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {};
    }

    static get defaultProps() {
        return {};
    }

    render() {
        return (
            <div>
                <FileTree/>
            </div>
        );
    }
}