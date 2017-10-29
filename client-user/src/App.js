import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import LabelledInputBox from './ui/base/LabelledInputBox';
import UserRegistrationForm from "./ui/UserRegistrationForm";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
            <LabelledInputBox label="Hi" maxLength="12"/>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <UserRegistrationForm/>
      </div>
    );
  }
}

export default App;
