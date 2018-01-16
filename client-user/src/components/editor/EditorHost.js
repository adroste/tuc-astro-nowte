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
            onStatsChange: PropTypes.func
        };
    }

    static get defaultProps() {
        return {};
    }


    /**
     * socket.io connection
     * @type {Object|null}
     * @private
     */
    _socket = null;


    /**
     * stats object
     * @type {Object}
     * @private
     */
    _stats = {};


    constructor(props) {
        super(props);

        this.state = {
            initialConnection: true,
            connectionState: ConnectionStateEnum.DISCONNECTED,
            bricks: [],
        };


        this.setStats({
            connectionRTT: -1
        });


        // create socket & bind listeners
        this._socket = lookupSocket('http://localhost:3210');
        this._socket.on('connect', this.handleConnect);
        this._socket.on('disconnect', this.handleDisconnect);
        this._socket.on('reconnecting', this.handleReconnecting);
        this._socket.on('echo', this.handleEcho);
        this._socket.on('initialize', this.handleInitialize);
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


    setStats = (stats) => {
        const prevStats = JSON.stringify(this._stats);
        Object.assign(this._stats, stats);
        if (this.props.onStatsChange && prevStats !== JSON.stringify(this._stats))
            this.props.onStatsChange(this._stats);
    };


    handleConnect = () => {
        this.setState({
            initialConnection: false,
            connectionState: ConnectionStateEnum.CONNECTED
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
            this.setStats({
                connectionRTT: Date.now() - data.timestamp
            });
    };

    handleInitialize = (data) => {
        //alert(JSON.stringify(data));
    };

    render() {
        return (
            <Host>
                {this.state.connectionState !== ConnectionStateEnum.CONNECTED &&
                <Overlay>
                    Connecting...
                </Overlay>}
                {!this.state.initialConnection &&
                <Editor
                    socket={this._socket}
                    user={this.props.user}
                    bricks={this.state.bricks}
                />}
            </Host>
        );
    }
}