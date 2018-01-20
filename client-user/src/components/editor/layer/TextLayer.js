import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


export class TextLayer extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {

        };
    }

    static get defaultProps() {
        return {};
    }


    render() {
        return (
            <div>
                This is a text layer
            </div>
        );
    }
}