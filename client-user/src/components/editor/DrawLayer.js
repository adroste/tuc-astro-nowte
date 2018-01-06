/**
 * @author Alexander Droste
 * @date 06.01.18
 */

import React from 'react';
import PropTypes from "prop-types";
import Paper from 'paper';

export class DrawLayer extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <canvas ref={(canvas) => this.canvas = canvas }/>
        );
    }
}