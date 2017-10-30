import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import UserRegistrationForm from "./ui/UserRegistrationForm";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            curState: "login"
        };
    }

    onStateChangeHandler = (newState) => {
        this.lastState = newState;
        this.setState({
           curState: newState
        });
    };

    render() {
        switch (this.state.curState){
            case "login":
                return <LoginScreen onStateChange={this.onStateChangeHandler}/>;
            case "register":
                return <RegistrationScreen onStateChange={this.onStateChangeHandler}/>
            default:
                return <h1>Invalid State: {this.state.curState}</h1>;
        }
    }
}

export default App;
