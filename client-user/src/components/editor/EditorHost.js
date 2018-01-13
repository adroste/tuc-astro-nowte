/**
 * @author Alexander Droste
 * @date 13.01.18
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import lookupSocket from 'socket.io-client';
import {Editor} from "./Editor";
import {ConnectionStateEnum} from "../../utilities/ConnectionStateEnum";


const Host = styled.div`
    position: relative;
    width: 100%;
    height: 100%
`;


const Overlay = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    z-index: 9999;
    font-size: 20px;    
`;


export class EditorHost extends React.Component {
    /**
     * propTypes
     */
    static get propTypes() {
        return {
            documentId: PropTypes.string.isRequired,
            user: PropTypes.object.isRequired,
        };
    }

    static get defaultProps() {
        return {};
    }


    /**
     * socket.io connection
     * @type {Object|null}
     */
    _socket = null;


    constructor(props) {
        super(props);

        this.state = {
            initialConnection: true,
            connectionState: ConnectionStateEnum.DISCONNECTED,
        };


        // create socket & bind listeners
        this._socket = lookupSocket('http://localhost:3210');
        this._socket.on('connect', this.handleConnect);
        this._socket.on('disconnect', this.handleDisconnect);
        this._socket.on('reconnecting', this.handleReconnecting);
        this._socket.on('echo', this.handleEcho);
    }


    componentDidMount() {
        this.latencyInterval = setInterval(() => {
            if (this.state.connectionState !== ConnectionStateEnum.CONNECTED)
                return;
            this._socket.emit('echo', { timestamp: Date.now() });
        }, 5000);
    }


    componentWillUnmount() {
        clearInterval(this.latencyInterval);
    }


    handleConnect = () => {
        this.setState({
            initialConnection: false,
            connectionState: ConnectionStateEnum.CONNECTED,
            connectionRTT: -1
        });
        console.log('connect');
    };


    handleDisconnect = () => {
        this.setState({
            connectionState: ConnectionStateEnum.DISCONNECTED
        });
        console.log('disconnect');
    };


    handleReconnecting = () => {
        this.setState({
            connectionState: ConnectionStateEnum.PENDING
        });
        console.log('reconnecting');
    };


    handleEcho = (data) => {
        if (data.hasOwnProperty('timestamp'))
            this.setState({
                connectionRTT: Date.now() - data.timestamp
            });
    };


    render() {
        return (
            <Host>
                RTT: {this.state.connectionRTT} ms
                {this.state.connectionState !== ConnectionStateEnum.CONNECTED &&
                <Overlay>
                    Connecting...
                </Overlay>}
                {!this.state.initialConnection &&
                <Editor
                    socket={this.state._socket}
                    user={this.props.user}
                />}
            </Host>
        );
    }
}