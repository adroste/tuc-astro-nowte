'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LabelledInputBox extends React.Component {

    /**
     * hi
     * @returns {XML}
     */
    render(){
        return (
            <h1>{this.props.label}</h1>
        );
    }

    /**
     * propTypes
     * @property {string} label counrty list
     */
    static get propTypes() {
        return {
            label: PropTypes.string
        };
    }
}