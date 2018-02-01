import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FONT_SIZES } from '../../../Globals';
import {determineInitials} from '../../../utilities/stringUtil';


const Wrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 15px;
    user-select: none;
`;


const Symbol = styled.div`
    color: white;
    background-color: ${props => props.bgColor};
    font-size: ${FONT_SIZES.NORMAL};
    line-height: 16px;
    padding: 4px;
    border-radius: 5px;
    text-transform: uppercase;
    width: 24px;
    height: 24px;
    margin-top: 5px;
`;



export class UserSymbols extends React.Component {
    /**
     * propTypes
     * @property {object} clients other clients that are currently connected (dictionary: key=userUniqueId value={id, name, color})
     */
    static get propTypes() {
        return {
            clients: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    renderClients = () => {
        return Object.keys(this.props.clients).map(key => {
            const client = this.props.clients[key];            
            return (
                <Symbol
                    key={key}
                    bgColor={client.color}
                >
                    {determineInitials(client.name)}
                </Symbol>
            );
        });
    };


    render() {
        return (
            <Wrapper>
                {this.renderClients()}
            </Wrapper>
        );
    }

}