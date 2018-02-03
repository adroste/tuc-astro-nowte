import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const Wrapper = styled.div`
    pointer-events: none;
`;


const Pointer = styled.div.attrs({
    style: ({x, y}) => ({
        top: y,
        left: x
    }),
})`
    position: absolute;
    background: ${props => props.color};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    z-index: 910;
    transition: left 0.1s linear, top 0.1s linear;
`;


export class ClientPointers extends React.Component {
    /**
     * propTypes
     * @property {object} clients other clients that are currently connected (dictionary: key=userUniqueId value={id, name, color, mouse})
     */
    static get propTypes() {
        return {
            clients: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    renderPointers = () => {
        return Object.keys(this.props.clients).map(key => {
            const c = this.props.clients[key];
            return c.mouse && (
                    <Pointer
                        key={key}
                        color={c.color}
                        x={c.mouse.x}
                        y={c.mouse.y}
                    />);
        });
    }


    render() {
        return (
            <Wrapper
                className={this.props.className}
            >
                {this.renderPointers()}
            </Wrapper>
        );
    }
}