/**
 * @author Alexander Droste
 * @date 06.01.18
 */

import React from 'react';
import PropTypes from "prop-types";

export class Container extends React.Component {
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
}