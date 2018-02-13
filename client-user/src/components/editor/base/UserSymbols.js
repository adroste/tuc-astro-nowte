import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FONT_SIZES } from '../../../Globals';
import {determineInitials} from '../../../utilities/stringUtil';
import {PopUpBox} from '../../base/PopUpBox';


const Wrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 15px;
    user-select: none;
    z-index: 960;    
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
     * @property {string} className used for styling
     * @property {object} clients other clients that are currently connected (dictionary: key=userUniqueId value={id, name, color})
     */
    static get propTypes() {
        return {
            className: PropTypes.string,
            clients: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    shouldComponentUpdate(nextProps) {
        if (this.props.className !== nextProps.className)
            return true;
        const keys = Object.keys(this.props.clients);
        const keysNew = Object.keys(nextProps.clients);
        if (keys.length !== keysNew.length)
            return true;
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (k !== keysNew[i])
                return true;
            const c1 = this.props.clients[k];
            const c2 = nextProps.clients[k];
            if (c1.name !== c2.name || c1.color !== c2.color)
                return true;
        }
        return false;
    }


    renderClients = () => {
        return Object.keys(this.props.clients).map(key => {
            const client = this.props.clients[key];            
            return (
                <PopUpBox
                    key={key}
                    activeOnClick={false}
                    right
                    content={
                        <span>
                            {client.name}
                        </span>
                    }
                >
                    <Symbol
                        bgColor={client.color}
                    >
                        {determineInitials(client.name)}
                    </Symbol>
                </PopUpBox>
            );
        });
    };


    render() {
        return (
            <Wrapper
                className={this.props.className}
            >
                {this.renderClients()}
            </Wrapper>
        );
    }

}